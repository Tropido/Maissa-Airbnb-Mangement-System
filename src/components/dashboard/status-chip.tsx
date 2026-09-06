import { AlertTriangle, Ban, CheckCircle2, Clock, CreditCard, HelpCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS_LABEL, type BookingStatus } from '@/lib/data/types';

/**
 * Booking status chip.
 *
 * Every status ships an icon alongside its label, so state is never carried by
 * colour alone — a colour-blind operator and a greyscale print read the same
 * thing. Variants map to the AA-clearing foreground pairs in tailwind.config.
 */
const STATUS = {
  confirmed: { variant: 'success', icon: CheckCircle2 },
  awaiting_payment: { variant: 'danger', icon: CreditCard },
  not_confirmed: { variant: 'warning', icon: HelpCircle },
  early_check_in: { variant: 'accent', icon: Clock },
  cancelled: { variant: 'outline', icon: AlertTriangle },
  blocked: { variant: 'ink', icon: Ban },
} as const satisfies Record<
  BookingStatus,
  { variant: React.ComponentProps<typeof Badge>['variant']; icon: typeof CheckCircle2 }
>;

export function StatusChip({ status, className }: { status: BookingStatus; className?: string }) {
  const { variant, icon: Icon } = STATUS[status];
  return (
    <Badge variant={variant} className={className}>
      <Icon aria-hidden />
      {BOOKING_STATUS_LABEL[status]}
    </Badge>
  );
}
