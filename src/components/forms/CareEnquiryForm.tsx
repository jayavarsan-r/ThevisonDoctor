"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  CARE_FOR_WHOM,
  careEnquirySchema,
  contactLabels,
  CONTACT_METHODS,
  forWhomLabels,
  GENDERS,
  genderLabels,
  PREFERRED_TIMES,
  preferredTimeLabels,
  VISIT_TYPES,
  visitTypeLabels,
  type CareEnquiry,
  type CareEnquiryInput,
} from "@/lib/validation";
import { ConsentCheckbox } from "./ConsentCheckbox";
import {
  describedBy,
  Field,
  FieldError,
  FieldGroup,
  inputClasses,
  nativeCheckClasses,
  optionCardClasses,
  textareaClasses,
} from "./Field";
import { ErrorSummary, FormStatus } from "./FormStatus";
import { Turnstile } from "./Turnstile";
import { useEnquiry } from "./useEnquiry";

const ID = {
  service: "ce-service",
  forWhom: "ce-for-whom",
  guardianConfirm: "ce-guardian",
  age: "ce-age",
  gender: "ce-gender",
  visitType: "ce-visit-type",
  area: "ce-area",
  pincode: "ce-pincode",
  preferredTime: "ce-time",
  name: "ce-name",
  phone: "ce-phone",
  email: "ce-email",
  preferredContact: "ce-contact",
  message: "ce-message",
  consent: "ce-consent",
} as const;

/**
 * Eye-care enquiry (§12.2). Minimum data only: no medical history, symptoms
 * or date of birth. Nothing is booked until we call to confirm.
 */
export function CareEnquiryForm({
  services,
  defaultService = "",
  turnstileSiteKey,
}: {
  services: { slug: string; title: string }[];
  defaultService?: string;
  turnstileSiteKey?: string;
}) {
  const form = useForm<CareEnquiryInput, unknown, CareEnquiry>({
    resolver: zodResolver(careEnquirySchema),
    mode: "onTouched",
    defaultValues: {
      kind: "care",
      service: defaultService,
      forWhom: undefined as unknown as CareEnquiryInput["forWhom"],
      guardianConfirm: false,
      age: "",
      gender: undefined as unknown as CareEnquiryInput["gender"],
      visitType: undefined as unknown as CareEnquiryInput["visitType"],
      area: "",
      pincode: "",
      preferredTime: "",
      name: "",
      phone: "",
      email: "",
      preferredContact: "whatsapp",
      message: "",
      consent: false as unknown as true,
      website: "",
      turnstileToken: "",
    },
  });
  const { register, handleSubmit, setValue, control, formState } = form;
  const { errors, isSubmitting, submitCount } = formState;
  const forWhom = useWatch({ control, name: "forWhom" });
  const preferredContact = useWatch({ control, name: "preferredContact" });

  const { serverError, summaryRef, onFocusCapture, summary, submit } = useEnquiry<CareEnquiry>({
    kind: "care",
    fieldOrder: Object.entries(ID) as [keyof CareEnquiry & string, string][],
    thankYou: (ref, d) =>
      `/thank-you/eye-care?ref=${encodeURIComponent(ref)}${d.service && d.service !== "not-sure" ? `&service=${encodeURIComponent(d.service)}` : ""}`,
  });

  // Pre-fill from ?service= on the hub page.
  useEffect(() => {
    if (defaultService) return;
    const s = new URLSearchParams(window.location.search).get("service");
    if (s && services.some((x) => x.slug === s)) setValue("service", s);
  }, [defaultService, services, setValue]);

  const summaryErrors = submitCount > 0 ? summary(errors as never) : [];

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      onFocusCapture={onFocusCapture}
      aria-describedby="ce-required-note"
      className="flex flex-col gap-8"
    >
      <div className="flex gap-3 rounded-btn border border-blue-200 bg-blue-50 p-4 text-[15px] text-ink">
        <TriangleAlert
          aria-hidden
          strokeWidth={1.5}
          className="mt-0.5 size-5 shrink-0 text-orange-700"
        />
        <p>
          <strong className="font-semibold">Not for emergencies.</strong> {site.emergencyNote}
        </p>
      </div>

      <p id="ce-required-note" className="text-meta text-slate-600">
        All fields are required unless marked optional. Please don&apos;t include medical details —
        we&apos;ll discuss these with you directly.
      </p>

      <ErrorSummary ref={summaryRef} errors={summaryErrors} />

      <Field id={ID.service} label="Which service do you need?" error={errors.service?.message}>
        <Select
          id={ID.service}
          invalid={!!errors.service}
          aria-invalid={errors.service ? true : undefined}
          aria-describedby={describedBy(ID.service, undefined, errors.service?.message)}
          {...register("service")}
        >
          <option value="">Choose a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
          <option value="not-sure">Not sure — help me choose</option>
        </Select>
      </Field>

      <FieldGroup
        id={ID.forWhom}
        legend="Who is the appointment for?"
        error={errors.forWhom?.message}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {CARE_FOR_WHOM.map((v) => (
            <label key={v} className={optionCardClasses(!!errors.forWhom)}>
              <input
                type="radio"
                value={v}
                className={nativeCheckClasses}
                {...register("forWhom")}
              />
              <span>{forWhomLabels[v]}</span>
            </label>
          ))}
        </div>
        {forWhom === "child" ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor={ID.guardianConfirm}
              className={optionCardClasses(!!errors.guardianConfirm)}
            >
              <input
                id={ID.guardianConfirm}
                type="checkbox"
                aria-invalid={errors.guardianConfirm ? true : undefined}
                aria-describedby={describedBy(
                  ID.guardianConfirm,
                  undefined,
                  errors.guardianConfirm?.message,
                )}
                className={nativeCheckClasses}
                {...register("guardianConfirm")}
              />
              <span>
                I am the child&apos;s parent or guardian. I understand a parent or guardian must
                attend.
              </span>
            </label>
            <FieldError id={ID.guardianConfirm} error={errors.guardianConfirm?.message} />
          </div>
        ) : null}
      </FieldGroup>

      <div className="grid gap-6 sm:grid-cols-[10rem_minmax(0,1fr)]">
        <Field
          id={ID.age}
          label="Age (years)"
          hint={
            forWhom === "group"
              ? "Approximate, for a group."
              : "Of the person the appointment is for."
          }
          error={errors.age?.message}
        >
          <input
            id={ID.age}
            inputMode="numeric"
            maxLength={3}
            autoComplete="off"
            aria-invalid={errors.age ? true : undefined}
            aria-describedby={describedBy(ID.age, "hint", errors.age?.message)}
            className={inputClasses(!!errors.age)}
            {...register("age")}
          />
        </Field>
        <Field id={ID.gender} label="Gender" error={errors.gender?.message}>
          <Select
            id={ID.gender}
            invalid={!!errors.gender}
            aria-invalid={errors.gender ? true : undefined}
            aria-describedby={describedBy(ID.gender, undefined, errors.gender?.message)}
            defaultValue=""
            {...register("gender")}
          >
            <option value="" disabled>
              Choose one
            </option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {genderLabels[g]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <FieldGroup
        id={ID.visitType}
        legend="Where would you prefer the appointment?"
        error={errors.visitType?.message}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {VISIT_TYPES.map((v) => (
            <label key={v} className={optionCardClasses(!!errors.visitType)}>
              <input
                type="radio"
                value={v}
                className={nativeCheckClasses}
                {...register("visitType")}
              />
              <span>{visitTypeLabels[v]}</span>
            </label>
          ))}
        </div>
      </FieldGroup>

      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <Field
          id={ID.area}
          label="Your area or locality in Chennai"
          hint="For example, Kolathur."
          error={errors.area?.message}
        >
          <input
            id={ID.area}
            autoComplete="address-level2"
            aria-invalid={errors.area ? true : undefined}
            aria-describedby={describedBy(ID.area, "hint", errors.area?.message)}
            className={inputClasses(!!errors.area)}
            {...register("area")}
          />
        </Field>
        <Field id={ID.pincode} label="Pincode" optional error={errors.pincode?.message}>
          <input
            id={ID.pincode}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            aria-invalid={errors.pincode ? true : undefined}
            aria-describedby={describedBy(ID.pincode, undefined, errors.pincode?.message)}
            className={inputClasses(!!errors.pincode)}
            {...register("pincode")}
          />
        </Field>
      </div>

      <Field
        id={ID.preferredTime}
        label="Preferred time"
        optional
        hint="We'll confirm availability when we call."
        error={errors.preferredTime?.message}
      >
        <Select
          id={ID.preferredTime}
          aria-describedby={describedBy(ID.preferredTime, "hint", errors.preferredTime?.message)}
          {...register("preferredTime")}
        >
          {PREFERRED_TIMES.map((t) => (
            <option key={t || "none"} value={t}>
              {preferredTimeLabels[t]}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id={ID.name}
          label="Your name"
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <input
            id={ID.name}
            autoComplete="name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy(ID.name, undefined, errors.name?.message)}
            className={inputClasses(!!errors.name)}
            {...register("name")}
          />
        </Field>
        <Field
          id={ID.phone}
          label="Phone or WhatsApp number"
          hint="For example, 95141 62051."
          error={errors.phone?.message}
        >
          <input
            id={ID.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describedBy(ID.phone, "hint", errors.phone?.message)}
            className={inputClasses(!!errors.phone)}
            {...register("phone")}
          />
        </Field>
        <Field
          id={ID.email}
          label="Email"
          optional={preferredContact !== "email"}
          error={errors.email?.message}
        >
          <input
            id={ID.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy(ID.email, undefined, errors.email?.message)}
            className={inputClasses(!!errors.email)}
            {...register("email")}
          />
        </Field>
      </div>

      <FieldGroup
        id={ID.preferredContact}
        legend="How should we contact you?"
        error={errors.preferredContact?.message}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {CONTACT_METHODS.map((m) => (
            <label key={m} className={optionCardClasses(!!errors.preferredContact)}>
              <input
                type="radio"
                value={m}
                className={nativeCheckClasses}
                {...register("preferredContact")}
              />
              <span>{contactLabels[m]}</span>
            </label>
          ))}
        </div>
      </FieldGroup>

      <Field
        id={ID.message}
        label="Anything we should know to arrange the visit?"
        optional
        hint="For example, access or timing needs. Please don't include medical details."
        error={errors.message?.message}
      >
        <textarea
          id={ID.message}
          rows={3}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy(ID.message, "hint", errors.message?.message)}
          className={textareaClasses(!!errors.message)}
          {...register("message")}
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <ConsentCheckbox
        id={ID.consent}
        registration={register("consent")}
        error={errors.consent?.message}
      />

      <Turnstile siteKey={turnstileSiteKey} onToken={(t) => setValue("turnstileToken", t)} />

      <FormStatus error={serverError} context="care" />

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-meta text-slate-600">
          Nothing is booked until we call to confirm the place, time and fee.
        </p>
        <Button
          type="submit"
          variant="accent"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          icon={
            isSubmitting ? (
              <LoaderCircle aria-hidden className="size-[18px] animate-spin" />
            ) : undefined
          }
          arrow={!isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Book an eye appointment"}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {isSubmitting ? "Sending your enquiry." : ""}
      </p>
    </form>
  );
}
