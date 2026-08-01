import Link from "next/link";
import { BrandLogo } from "components/brand-logo";
import { NewsletterForm } from "components/newsletter-form";
import { COLLECTIONS, SITE_NAME, SUPPORT_EMAIL, SOCIALS } from "lib/brand";

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-neutral-400 transition-colors hover:text-[#f2a93b]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");

  return (
    <footer className="border-t border-white/10 bg-[#060d0e] text-sm text-neutral-400">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5 md:px-12">
        <div className="col-span-2 md:col-span-2">
          <BrandLogo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500">
            A curated shop for planted freshwater aquariums. Lighting, CO2,
            aquascaping tools, substrate and testing, chosen on specs instead of
            marketing.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              ["Instagram", SOCIALS.instagram],
              ["YouTube", SOCIALS.youtube],
              ["TikTok", SOCIALS.tiktok],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-[#f2a93b]/50 hover:text-[#f2a93b]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <Column
          title="Shop"
          links={[
            { label: "All products", href: "/search" },
            ...COLLECTIONS.map((c) => ({
              label: c.title,
              href: `/search/${c.handle}`,
            })),
          ]}
        />

        <Column
          title="Support"
          links={[
            { label: "Shipping & returns", href: "/shipping-returns" },
            { label: "FAQ", href: "/faq" },
            { label: "Contact", href: "/contact" },
            { label: "About", href: "/about" },
          ]}
        />

        <div className="col-span-2 md:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            The drop list
          </h3>
          <p className="mt-4 text-sm text-neutral-500">
            New gear, restocks and scaping guides.
          </p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 px-6 py-6 text-xs text-neutral-500 md:flex-row md:px-12">
          <p>
            &copy; {copyrightDate} {SITE_NAME}. Gear for planted aquariums.
          </p>
          <p className="md:ml-6">
            Secure checkout by Stripe · Visa · Mastercard · Amex · Apple Pay
          </p>
          <div className="flex gap-4 md:ml-auto">
            <Link href="/privacy" className="hover:text-neutral-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-300">
              Terms
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="hover:text-neutral-300"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
