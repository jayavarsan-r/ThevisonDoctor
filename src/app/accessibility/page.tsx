import type { Metadata } from "next";
import { LegalPage, Placeholder } from "@/components/legal/LegalPage";
import { legal } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Accessibility statement",
  alternates: { canonical: "/accessibility" },
  robots: legal.reviewed ? undefined : { index: false, follow: true },
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility statement"
      lead="We want everyone to be able to find a program or arrange eye care on this website."
    >
      <h2>1. Our standard</h2>
      <p>
        We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA across this
        website.
      </p>

      <h2>2. What we have done</h2>
      <ul>
        <li>Colour combinations are chosen to meet WCAG AA contrast ratios.</li>
        <li>
          Every page can be used with a keyboard, with a visible focus indicator and a &quot;Skip to
          main content&quot; link.
        </li>
        <li>Menus, tabs, accordions and dialogs follow standard accessible patterns.</li>
        <li>
          Forms have visible labels, explain errors in words and link an error summary to each
          field.
        </li>
        <li>
          Animations are reduced or switched off if your device asks for reduced motion; the
          background video can be paused.
        </li>
        <li>Text can be resized up to 200% without losing content.</li>
      </ul>

      <h2>3. Known limitations</h2>
      <ul>
        <li>WhatsApp is a third-party service, and its accessibility is outside our control.</li>
        <li>
          <Placeholder>any issues found in the latest accessibility review</Placeholder>
        </li>
      </ul>

      <h2>4. Feedback and help</h2>
      <p>
        If something on this website doesn&apos;t work for you, or you need information in another
        format, tell us at <a href={`mailto:${site.email}`}>{site.email}</a> or call{" "}
        {site.phone.display}. We aim to reply within{" "}
        <Placeholder>number of working days</Placeholder>.
      </p>

      <h2>5. Review</h2>
      <p>
        This statement was prepared on <Placeholder>date</Placeholder> and is reviewed whenever the
        website changes significantly.
      </p>
    </LegalPage>
  );
}
