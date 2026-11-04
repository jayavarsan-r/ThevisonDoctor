"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode; meta?: ReactNode };

/** Hairline accordion used for FAQs and curricula. Headings default to h3. */
export function Accordion({
  items,
  headingLevel = 3,
  className,
}: {
  items: AccordionItem[];
  headingLevel?: 3 | 4;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      className={cn("border-t border-line", className)}
    >
      {items.map((item) => (
        <RadixAccordion.Item key={item.id} value={item.id} className="border-b border-line">
          <RadixAccordion.Header asChild>
            {headingLevel === 3 ? (
              <h3>
                <Trigger item={item} />
              </h3>
            ) : (
              <h4>
                <Trigger item={item} />
              </h4>
            )}
          </RadixAccordion.Header>
          <RadixAccordion.Content className="accordion-content">
            <div className="measure pb-6 text-slate-600">{item.content}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}

function Trigger({ item }: { item: AccordionItem }) {
  return (
    <RadixAccordion.Trigger className="group flex w-full items-start justify-between gap-6 py-5 text-left text-[17px] font-semibold text-ink transition-colors hover:text-blue-900">
      <span className="flex flex-col gap-2">
        <span>{item.title}</span>
        {item.meta}
      </span>
      <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-blue-200 group-data-[state=open]:border-blue-900 group-data-[state=open]:bg-blue-900 group-data-[state=open]:text-white">
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </span>
    </RadixAccordion.Trigger>
  );
}
