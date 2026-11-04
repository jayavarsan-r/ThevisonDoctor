"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { specialityLabels, stageLabels } from "@/content/taxonomy";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  academyEnquirySchema,
  ACADEMY_INTENTS,
  contactLabels,
  CONTACT_METHODS,
  intentLabels,
  SPECIALITIES,
  STAGES,
  type AcademyEnquiry,
  type AcademyEnquiryInput,
  type AcademyIntent,
} from "@/lib/validation";
import { ConsentCheckbox } from "./ConsentCheckbox";
import {
  describedBy,
  Field,
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
  intent: "ae-intent",
  program: "ae-program",
  specialities: "ae-specialities",
  name: "ae-name",
  phone: "ae-phone",
  email: "ae-email",
  stage: "ae-stage",
  qualification: "ae-qualification",
  organisation: "ae-organisation",
  preferredContact: "ae-contact",
  message: "ae-message",
  consent: "ae-consent",
} as const;

const DEFAULTS: AcademyEnquiryInput = {
  kind: "academy",
  intent: "program",
  program: "",
  specialities: [],
  name: "",
  phone: "",
  email: "",
  stage: "",
  qualification: "",
  organisation: "",
  preferredContact: "whatsapp",
  message: "",
  consent: false as unknown as true,
  website: "",
  turnstileToken: "",
};

export function AcademyEnquiryForm({
  programs,
  turnstileSiteKey,
}: {
  programs: { slug: string; title: string }[];
  turnstileSiteKey?: string;
}) {
  const form = useForm<AcademyEnquiryInput, unknown, AcademyEnquiry>({
    resolver: zodResolver(academyEnquirySchema),
    mode: "onTouched",
    defaultValues: DEFAULTS,
  });
  const { register, handleSubmit, setValue, control, formState } = form;
  const { errors, isSubmitting, submitCount } = formState;
  const intent = useWatch({ control, name: "intent" });
  const preferredContact = useWatch({ control, name: "preferredContact" });

  const { serverError, summaryRef, onFocusCapture, summary, submit } = useEnquiry<AcademyEnquiry>({
    kind: "academy",
    fieldOrder: Object.entries(ID) as [keyof AcademyEnquiry & string, string][],
    thankYou: (ref, d) =>
      `/thank-you/academy?ref=${encodeURIComponent(ref)}${d.program ? `&program=${encodeURIComponent(d.program)}` : ""}`,
  });

  // Pre-fill from ?program= and ?intent= (§7.4).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const program = q.get("program");
    const qIntent = q.get("intent");
    if (program && programs.some((p) => p.slug === program)) {
      setValue("intent", "program");
      setValue("program", program);
    }
    if (qIntent && (ACADEMY_INTENTS as readonly string[]).includes(qIntent)) {
      setValue("intent", qIntent as AcademyIntent);
    }
  }, [programs, setValue]);

  const summaryErrors = submitCount > 0 ? summary(errors as never) : [];
  const showProgramSelect = intent === "program" && programs.length > 0;
  const showSpecialities = intent !== "program" || programs.length === 0;
  const isInstitution = intent === "institution";
  const submitLabel = intent === "notify" ? "Get notified" : "Enquire now";

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      onFocusCapture={onFocusCapture}
      aria-describedby="ae-required-note"
      className="flex flex-col gap-8"
    >
      <p id="ae-required-note" className="text-meta text-slate-600">
        All fields are required unless marked optional.
      </p>

      <ErrorSummary ref={summaryRef} errors={summaryErrors} />

      <FieldGroup
        id={ID.intent}
        legend="What is your enquiry about?"
        error={errors.intent?.message}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {ACADEMY_INTENTS.map((v) => (
            <label key={v} className={optionCardClasses(!!errors.intent)}>
              <input
                type="radio"
                value={v}
                className={nativeCheckClasses}
                {...register("intent")}
              />
              <span>{intentLabels[v]}</span>
            </label>
          ))}
        </div>
      </FieldGroup>

      {showProgramSelect ? (
        <Field id={ID.program} label="Which program?" optional error={errors.program?.message}>
          <Select id={ID.program} {...register("program")}>
            <option value="">Not sure yet</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      {showSpecialities ? (
        <FieldGroup
          id={ID.specialities}
          legend="Which specialities interest you?"
          optional
          error={errors.specialities?.message}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {SPECIALITIES.map((s) => (
              <label key={s} className={optionCardClasses()}>
                <input
                  type="checkbox"
                  value={s}
                  className={nativeCheckClasses}
                  {...register("specialities")}
                />
                <span>{specialityLabels[s]}</span>
              </label>
            ))}
          </div>
        </FieldGroup>
      ) : null}

      {isInstitution ? (
        <Field
          id={ID.organisation}
          label="Hospital, college or organisation"
          error={errors.organisation?.message}
        >
          <input
            id={ID.organisation}
            autoComplete="organization"
            aria-invalid={errors.organisation ? true : undefined}
            aria-describedby={describedBy(ID.organisation, undefined, errors.organisation?.message)}
            className={inputClasses(!!errors.organisation)}
            {...register("organisation")}
          />
        </Field>
      ) : null}

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

      <div className="grid gap-6 sm:grid-cols-2">
        {!isInstitution ? (
          <Field id={ID.stage} label="I am a…" error={errors.stage?.message}>
            <Select
              id={ID.stage}
              invalid={!!errors.stage}
              aria-invalid={errors.stage ? true : undefined}
              aria-describedby={describedBy(ID.stage, undefined, errors.stage?.message)}
              {...register("stage")}
            >
              <option value="">Choose one</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {stageLabels[s]}
                </option>
              ))}
            </Select>
          </Field>
        ) : null}
        <Field
          id={ID.qualification}
          label="Your qualification"
          optional
          hint="For example, B.Optom final year."
          error={errors.qualification?.message}
          className={isInstitution ? "sm:col-span-2" : undefined}
        >
          <input
            id={ID.qualification}
            aria-invalid={errors.qualification ? true : undefined}
            aria-describedby={describedBy(ID.qualification, "hint", errors.qualification?.message)}
            className={inputClasses(!!errors.qualification)}
            {...register("qualification")}
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
        label="Anything else you'd like us to know?"
        optional
        error={errors.message?.message}
      >
        <textarea
          id={ID.message}
          rows={4}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy(ID.message, undefined, errors.message?.message)}
          className={textareaClasses(!!errors.message)}
          {...register("message")}
        />
      </Field>

      {/* Honeypot — hidden from people and assistive tech. */}
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

      <FormStatus error={serverError} context="academy" />

      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-meta text-slate-600">
          We only use these details to reply to your enquiry.
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
          {isSubmitting ? "Sending…" : submitLabel}
        </Button>
      </div>
      <p className="sr-only" aria-live="polite">
        {isSubmitting ? "Sending your enquiry." : ""}
      </p>
    </form>
  );
}
