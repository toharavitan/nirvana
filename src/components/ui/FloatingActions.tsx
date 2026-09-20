import { AvailabilityButton } from "./AvailabilityButton";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * The persistent corner: WhatsApp above, the calendar below it.
 *
 * One fixed anchor owning both, rather than each button carrying its own
 * `fixed` offset. The alternative would have the upper button hardcode a
 * bottom offset derived from the lower one's height — which reads fine until
 * either circle changes size and they silently overlap. Here the gap is a
 * flex gap and the stack takes care of itself.
 */
export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      <WhatsAppButton />
      <AvailabilityButton />
    </div>
  );
}
