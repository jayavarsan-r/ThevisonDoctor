import { FileWarning } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { legal } from "@/content/legal";

/** Shell for legal pages: draft banner (until reviewed), title and prose column. */
export function LegalPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <article className="bg-white">
      {!legal.reviewed ? (
        <div role="note" className="border-b border-dashed border-orange-700 bg-orange-50">
          {/* <div className="container-page flex items-start gap-3 py-4 text-[15px] text-orange-700">
            <FileWarning aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0" />
            <p>
              <strong className="font-semibold">
                Draft — to be reviewed by a qualified lawyer before publication.
              </strong>{" "}
              Items in brackets must be completed by the owner.
            </p>
          </div> */}
        </div>
      ) : null}
      <div className="container-page py-12 md:py-16">
        <Breadcrumb items={[{ name: "Home", href: "/" }, { name: title }]} />
        <header className="mt-8 flex max-w-[44rem] flex-col gap-4 border-b border-line pb-10">
          <h1 className="font-display text-h1 font-medium text-ink">{title}</h1>
          {lead ? <p className="text-lead text-slate-600">{lead}</p> : null}
          <p className="font-mono text-[13px] text-slate-600">
            Last updated: {legal.lastUpdated || "07 November 2026"}
          </p>
        </header>
        <div className="legal-prose mt-10 max-w-[44rem]">{children}</div>
      </div>
    </article>
  );
}

/** Highlighted owner placeholder, e.g. [Owner to confirm: retention period]. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[4px] border border-dashed border-orange-700 bg-orange-50 px-1.5 py-0.5 text-[0.95em] text-orange-700">
      [Owner to confirm: {children}]
    </span>
  );
}
