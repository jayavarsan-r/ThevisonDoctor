import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type Crumb = { name: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-meta text-slate-600">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="underline-offset-[3px] hover:text-blue-900 hover:underline"
                >
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-ink" : undefined}
                >
                  {item.name}
                </span>
              )}
              {!last ? <ChevronRight aria-hidden strokeWidth={1.5} className="size-3.5" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
