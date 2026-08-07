import {
  DISPATCH_MAX_DAYS,
  DISPATCH_MIN_DAYS,
  ZONES,
  deliveryWindow,
} from "lib/shipping";
import { CURRENCY } from "lib/brand";

/**
 * The delivery promise, rendered from lib/shipping rather than retyped.
 *
 * Six places on this site used to state a delivery time and they disagreed with
 * each other and with what Stripe charged. Anything that quotes a transit time
 * should render this, or read the same module.
 */
export function DeliveryTable() {
  return (
    <div className="not-prose">
      <p className="mb-4 text-[15px] text-[var(--aq-muted)]">
        Orders are packed and handed to the carrier within{" "}
        <strong className="text-[var(--aq-bone)]">
          {DISPATCH_MIN_DAYS}-{DISPATCH_MAX_DAYS} business days
        </strong>
        . The windows below are the total time from order to doorstep, dispatch
        included, and every order is tracked from the moment it leaves.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-[var(--aq-line)]">
              <th className="py-3 pr-4 font-medium text-[var(--aq-bone)]">
                Destination
              </th>
              <th className="py-3 pr-4 font-medium text-[var(--aq-bone)]">
                Delivery
              </th>
              <th className="py-3 pr-4 font-medium text-[var(--aq-bone)]">
                Shipping
              </th>
              <th className="py-3 font-medium text-[var(--aq-bone)]">
                Free over
              </th>
            </tr>
          </thead>
          <tbody>
            {ZONES.map((z) => {
              const w = deliveryWindow(z);
              return (
                <tr
                  key={z.id}
                  className="border-b border-[var(--aq-line)] align-top"
                >
                  <td className="py-3 pr-4 text-[var(--aq-bone)]">
                    {z.label}
                    <span className="mt-1 block text-[13px] text-[var(--aq-muted)]">
                      {z.note}
                    </span>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--aq-muted)]">
                    {w.min}-{w.max} business days
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-[var(--aq-muted)]">
                    ${z.rate.toFixed(2)}
                  </td>
                  <td className="py-3 whitespace-nowrap text-[var(--aq-muted)]">
                    ${z.freeOver}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[13px] text-[var(--aq-muted)]">
        All prices are in {CURRENCY}. Stock ships direct from our supplier, which
        is why the windows are measured in weeks rather than days — we would
        rather quote a range we can hold than a fast one we would miss. Outside
        Australia, any import duty or tax is set by your country and payable by
        the recipient.
      </p>
    </div>
  );
}
