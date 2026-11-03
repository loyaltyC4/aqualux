import { SUPPORT_EMAIL } from "lib/brand";

/**
 * The site sits behind Cloudflare, whose Email Address Obfuscation rewrites a
 * plain mailto link into /cdn-cgi/l/email-protection. Crawlers follow that URL
 * and report a broken link on every page that has one. The email_off markers
 * tell Cloudflare to leave this link alone.
 */
export function EmailLink({ className }: { className?: string }) {
  const cls = className ? ` class="${className}"` : "";
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!--email_off--><a href="mailto:${SUPPORT_EMAIL}"${cls}>${SUPPORT_EMAIL}</a><!--/email_off-->`,
      }}
    />
  );
}
