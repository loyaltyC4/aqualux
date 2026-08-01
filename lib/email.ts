import { SITE_NAME, SUPPORT_EMAIL } from "./brand";

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function orderEmailHtml(params: {
  orderId: string;
  items: { title: string; quantity: number; unitAmount: number }[];
  amountTotal: number;
  currency: string;
}) {
  const rows = params.items
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #23252b;color:#e8e8e8;font-size:14px;">
          ${it.title} <span style="color:#8a8f98;">× ${it.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #23252b;color:#e8e8e8;font-size:14px;text-align:right;">
          ${money(it.unitAmount * it.quantity, params.currency)}
        </td>
      </tr>`,
    )
    .join("");

  return `
  <div style="background:#060d0e;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#0d1618;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:32px;">
        <div style="width:36px;height:36px;border-radius:10px;background:#f2a93b;margin-bottom:16px;"></div>
        <h1 style="color:#eceae4;font-size:22px;margin:0 0 8px;">Order confirmed. Grip it and rip it.</h1>
        <p style="color:#8a8f98;font-size:14px;margin:0 0 24px;">
          Order ${params.orderId.slice(0, 8).toUpperCase()} / we're on it. Ships within 1-2 business days.
        </p>
        <table role="presentation" width="100%">${rows}</table>
        <table role="presentation" width="100%" style="margin-top:12px;">
          <tr>
            <td style="color:#eceae4;font-weight:bold;font-size:15px;">Total</td>
            <td style="color:#f2a93b;font-weight:bold;font-size:15px;text-align:right;">
              ${money(params.amountTotal, params.currency)}
            </td>
          </tr>
        </table>
        <p style="color:#8a8f98;font-size:12px;margin-top:28px;">
          ${SITE_NAME} · Questions? Reply to this email or contact ${SUPPORT_EMAIL}
        </p>
      </td></tr>
    </table>
  </div>`;
}

/**
 * Sends a branded order-confirmation email via Resend. No-ops (returns
 * { sent: false }) when RESEND_API_KEY isn't set / this is an enhancement
 * layer, never a blocker: orders are recorded and viewable in /admin/orders
 * regardless of whether email is configured. Also bcc's the store owner so
 * there's a real notification channel with zero extra setup once one key
 * is added.
 */
export async function sendOrderConfirmationEmail(params: {
  to: string | null;
  orderId: string;
  items: { title: string; quantity: number; unitAmount: number }[];
  amountTotal: number;
  currency: string;
}): Promise<{ sent: boolean }> {
  if (!isResendConfigured() || !params.to) return { sent: false };

  const from =
    process.env.RESEND_FROM_EMAIL || "Aqualux <onboarding@resend.dev>";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || SUPPORT_EMAIL;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        bcc: adminEmail ? [adminEmail] : undefined,
        subject: `Your ${SITE_NAME} order is confirmed`,
        html: orderEmailHtml(params),
      }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false };
  }
}
