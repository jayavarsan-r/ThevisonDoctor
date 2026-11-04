"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import { Button } from "../ui/Button";
import { ServiceIcon } from "../ui/icons";
import { MobileMenu } from "./MobileMenu";
import { DARK_HERO_ROUTES, type NavFeatured, type NavLink, type NavService } from "./nav";
import { Wordmark } from "./Wordmark";

export function SiteHeader({
  services,
  featured,
  academyLinks,
}: {
  academyLinks: NavLink[];
  services: NavService[];
  featured: NavFeatured;
}) {
  const pathname = usePathname();
  const overDarkHero = DARK_HERO_ROUTES.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuValue, setMenuValue] = useState("");
  const [prevPath, setPrevPath] = useState(pathname);

  // Close any open dropdown when the route changes.
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuValue("");
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floating = scrolled;
  const dark = overDarkHero && !floating;
  // Eye Care pages carry their own orange "Book" action — keep one accent per viewport.
  const careRoute = pathname.startsWith("/eye-care") || pathname.startsWith("/thank-you/eye-care");

  const linkBase = cn(
    "inline-flex h-10 items-center gap-1 rounded-btn px-3 text-[15px] font-medium transition-colors duration-150",
    dark
      ? "text-white/90 hover:bg-white/10 hover:text-white"
      : "text-ink hover:bg-blue-50 hover:text-blue-900",
  );
  const activeCls = dark
    ? "text-white underline decoration-orange-500 decoration-2 underline-offset-[10px]"
    : "text-blue-900 underline decoration-orange-500 decoration-2 underline-offset-[10px]";

  const isActive = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

  return (
    <header
      data-surface={dark ? "dark" : "light"}
      className={cn(
        "sticky top-0 z-40 h-[var(--header-h)] transition-colors duration-200",
        !floating && !overDarkHero && "border-b border-line bg-white",
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-4 border transition-[margin,height,background-color,border-color,box-shadow,border-radius] duration-200 ease-brand",
          floating
            ? "mt-3 h-[60px] w-[calc(100%-1.5rem)] max-w-[1200px] rounded-card border-line bg-white/92 px-3 shadow-float backdrop-blur-md sm:px-4"
            : "h-full w-full max-w-[1200px] border-transparent px-4 sm:px-6 lg:px-8",
        )}
      >
        <Wordmark tone={dark ? "dark" : "light"} />

        <NavigationMenu.Root
          value={menuValue}
          onValueChange={setMenuValue}
          aria-label="Main"
          className="relative hidden lg:block"
        >
          <NavigationMenu.List className="flex items-center gap-0.5">
            <NavigationMenu.Item value="academy" className="relative">
              <NavigationMenu.Trigger
                className={cn(linkBase, "group", isActive("/academy") && activeCls)}
              >
                Academy
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="animate-panel absolute top-full left-0 mt-3 w-[640px] rounded-card border border-line bg-white p-3 shadow-float">
                <div className="grid grid-cols-[1.25fr_1fr] gap-3">
                  <ul className="flex flex-col">
                    {academyLinks.map((l) => (
                      <li key={l.href}>
                        <PanelLink href={l.href} title={l.label} description={l.description} />
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col justify-between rounded-btn bg-blue-50 p-5">
                    {featured ? (
                      <>
                        <div>
                          <p className="eyebrow text-blue-900">Next intake</p>
                          <p className="mt-3 text-[17px] leading-snug font-semibold text-ink">
                            {featured.title}
                          </p>
                          <p className="mt-1 text-meta text-slate-600">
                            Starts{" "}
                            <time dateTime={featured.start}>{formatDate(featured.start)}</time>
                          </p>
                        </div>
                        <NavLink
                          href={`/academy/programs/${featured.slug}`}
                          className="mt-6 inline-flex items-center gap-1 text-[15px] font-semibold link"
                        >
                          View program{" "}
                          <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                        </NavLink>
                      </>
                    ) : (
                      <>
                        <p className="font-display text-[22px] leading-tight text-ink">
                          Not sure where to start?
                        </p>
                        <NavLink
                          href="/academy"
                          className="mt-6 inline-flex items-center gap-1 text-[15px] font-semibold link"
                        >
                          Find your program{" "}
                          <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                        </NavLink>
                      </>
                    )}
                  </div>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavLink href="/academy#programs" className={linkBase}>
                Programs
              </NavLink>
            </NavigationMenu.Item>

            <NavigationMenu.Item value="eye-care" className="relative">
              <NavigationMenu.Trigger
                className={cn(linkBase, "group", isActive("/eye-care") && activeCls)}
              >
                Eye Care
                <ChevronDown
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="animate-panel absolute top-full left-1/2 mt-3 w-[600px] -translate-x-1/2 rounded-card border border-line bg-white p-3 shadow-float">
                <ul className="grid grid-cols-2 gap-1">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <PanelLink
                        href={`/eye-care/${s.slug}`}
                        title={s.title}
                        description={s.short}
                        icon={<ServiceIcon name={s.icon} size={24} className="mt-0.5 shrink-0" />}
                      />
                    </li>
                  ))}
                </ul>
                <div className="mt-2 border-t border-line px-3 pt-3 pb-1">
                  <NavLink
                    href="/eye-care#how-it-works"
                    className="inline-flex items-center gap-1 text-[15px] font-semibold link"
                  >
                    How appointments work{" "}
                    <ArrowRight aria-hidden strokeWidth={1.5} className="size-4" />
                  </NavLink>
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>

            <NavigationMenu.Item>
              <NavLink
                href="/blog"
                className={cn(linkBase, isActive("/blog") && activeCls)}
                active={isActive("/blog")}
              >
                Blog
              </NavLink>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavLink
                href="/about"
                className={cn(linkBase, isActive("/about") && activeCls)}
                active={isActive("/about")}
              >
                About us
              </NavLink>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavLink
                href="/contact"
                className={cn(linkBase, isActive("/contact") && activeCls)}
                active={isActive("/contact")}
              >
                Contact
              </NavLink>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/eye-care#book"
            className={cn(
              "hidden rounded-btn px-2 py-2 text-[15px] font-medium underline-offset-[3px] hover:underline xl:inline-flex",
              dark ? "text-white" : "text-blue-900",
            )}
          >
            Book eye care
          </Link>
          <Button
            href="/academy/enquire"
            variant={careRoute ? "outline" : "accent"}
            size="sm"
            className="hidden sm:inline-flex"
          >
            Enquire now
          </Button>
          <MobileMenu academyLinks={academyLinks} services={services} dark={dark} />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  className,
  children,
  active,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <NavigationMenu.Link asChild active={active}>
      <Link href={href} className={className} aria-current={active ? "page" : undefined}>
        {children}
      </Link>
    </NavigationMenu.Link>
  );
}

function PanelLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <NavigationMenu.Link asChild>
      <Link
        href={href}
        className="flex gap-3 rounded-btn px-3 py-2.5 transition-colors duration-150 hover:bg-blue-50 focus-visible:bg-blue-50"
      >
        {icon}
        <span className="flex flex-col">
          <span className="text-[15px] font-semibold text-ink">{title}</span>
          <span className="text-meta text-slate-600">{description}</span>
        </span>
      </Link>
    </NavigationMenu.Link>
  );
}
