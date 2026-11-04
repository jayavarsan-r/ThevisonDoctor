"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Faq } from "@/content/types";
import { Accordion } from "@/components/ui/Accordion";
import { faqItems } from "@/components/ui/faqItems";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** "Questions, answered." — two audiences (§6.10). */
export function FaqTabs({ learner, patient }: { learner: Faq[]; patient: Faq[] }) {
  const tabs = [
    {
      value: "learner",
      label: "For learners",
      items: learner,
      href: "/academy#faq",
      more: "All academy FAQs",
    },
    {
      value: "patient",
      label: "For patients",
      items: patient,
      href: "/eye-care#faq",
      more: "All patient FAQs",
    },
  ];

  return (
    <section aria-labelledby="faq-title" className="bg-white section-y">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeader id="faq-title" label="Questions" title="Questions, answered." />
        </div>
        <Tabs.Root defaultValue="learner" className="lg:col-span-8">
          <Tabs.List
            aria-label="Questions for"
            className="inline-flex gap-1 rounded-full border border-line p-1"
          >
            {tabs.map((t) => (
              <Tabs.Trigger
                key={t.value}
                value={t.value}
                className="h-10 rounded-full px-5 text-[15px] font-medium text-ink transition-colors hover:bg-blue-50 data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                {t.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {tabs.map((t) => (
            <Tabs.Content
              key={t.value}
              value={t.value}
              className="mt-8 focus-visible:outline-offset-4"
            >
              <Accordion items={faqItems(t.items)} />
              <Link
                href={t.href}
                className="mt-6 inline-flex items-center gap-1 font-semibold link"
              >
                {t.more} <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
              </Link>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </section>
  );
}
