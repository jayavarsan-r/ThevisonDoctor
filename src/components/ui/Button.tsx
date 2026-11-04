import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost-dark" | "light" | "outline";

const base =
  "group inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,filter] duration-150 ease-brand disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none aria-disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "rounded-btn bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-700",
  secondary:
    "rounded-full bg-blue-200 text-blue-900 hover:shadow-[inset_0_0_0_1px_var(--color-blue-900)]",
  accent: "rounded-btn bg-orange-500 text-navy-950 hover:brightness-[0.94] active:brightness-90",
  "ghost-dark": "rounded-btn border border-white/35 bg-transparent text-white hover:bg-white/10",
  light: "rounded-btn bg-white text-blue-900 hover:bg-blue-50",
  outline:
    "rounded-btn border border-slate-300 bg-white text-blue-900 hover:border-blue-200 hover:bg-blue-50",
};

const sizes = {
  md: "h-12 px-5 text-[15px]",
  sm: "h-10 px-4 text-[14px]",
};

type Common = {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type LinkProps = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };
type NativeButtonProps = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: Pick<Common, "variant" | "size" | "className">) {
  return cn(base, variants[variant], sizes[size], className);
}

function Inner({ icon, arrow, children }: Pick<Common, "icon" | "arrow" | "children">) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden
          strokeWidth={1.5}
          className="size-[18px] transition-transform duration-150 ease-brand group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );
}

const isExternal = (href: string) => /^(https?:|tel:|mailto:)/.test(href);

export function Button(props: LinkProps | NativeButtonProps) {
  const { variant, size, arrow, icon, className, children, ...rest } = props;
  const classes = buttonClasses({ variant, size, className });

  if (typeof rest.href === "string") {
    const { href, ...anchor } = rest as LinkProps;
    if (isExternal(href)) {
      const newTab = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...anchor}
        >
          <Inner icon={icon} arrow={arrow}>
            {children}
          </Inner>
          {newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchor}>
        <Inner icon={icon} arrow={arrow}>
          {children}
        </Inner>
      </Link>
    );
  }

  const { type = "button", ...button } = rest as NativeButtonProps;
  return (
    <button type={type} className={classes} {...button}>
      <Inner icon={icon} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
