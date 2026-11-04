import type { Metadata } from "next";
import { ThankYou } from "@/components/forms/ThankYou";
import { getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    title: "We read your enquiry",
    text: "We look at your background and the programs you're interested in.",
  },
  { title: "We contact you", text: "We confirm eligibility, schedule and fees with you directly." },
  { title: "You decide", text: "There's no obligation — you choose whether to secure a place." },
];

export default function AcademyThankYouPage() {
  const titles = Object.fromEntries(getPrograms().map((p) => [p.slug, p.title]));
  return (
    <section className="bg-white">
      <div className="container-page max-w-[960px] py-14 md:py-24">
        <ThankYou
          kind="academy"
          titles={titles}
          steps={STEPS}
          links={[
            { href: "/academy#programs", label: "Explore programs" },
            { href: "/academy/workshops", label: "Workshops & CME" },
          ]}
        />
      </div>
    </section>
  );
}
