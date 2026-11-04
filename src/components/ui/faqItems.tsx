import type { Faq } from "@/content/types";
import type { AccordionItem } from "./Accordion";
import { DraftTag } from "./DraftBadge";

/** Maps FAQs to accordion items; drafts (preview only) carry the draft label. */
export function faqItems(faqs: Faq[]): AccordionItem[] {
  return faqs.map((f) => ({
    id: f.id,
    title: f.q,
    content: f.a,
    meta: f.status === "draft" ? <DraftTag className="self-start" /> : undefined,
  }));
}
