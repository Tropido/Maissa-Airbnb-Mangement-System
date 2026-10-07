import { Badge, type BadgeProps } from '@/components/ui/badge';
import { BOOKING_STATUS_LABEL, type BookingStatus } from '@/lib/data/types';

/**
 * Booking status chip, as on the dashboard and calendar references. Every
 * status leads with its own glyph as well as its label, so state is never
 * carried by colour alone.
 */
const STATUS: Record<BookingStatus, { variant: BadgeProps['variant']; glyph: string; label?: string }> = {
  confirmed: { variant: 'confirmed', glyph: '✓' },
  awaiting_payment: { variant: 'awaiting', glyph: '▲' },
  not_confirmed: { variant: 'unconfirmed', glyph: '!' },
  early_check_in: { variant: 'early', glyph: '→' },
  cancelled: { variant: 'outline', glyph: '✕' },
  blocked: { variant: 'blocked', glyph: '⊘', label: 'Owner block' },
};

export function StatusChip({ status, className }: { status: BookingStatus; className?: string }) {
  const { variant, glyph, label } = STATUS[status];
  return (
    <Badge variant={variant} className={className}>
      <span aria-hidden>{glyph}</span>
      {label ?? BOOKING_STATUS_LABEL[status]}
    </Badge>
  );
}
