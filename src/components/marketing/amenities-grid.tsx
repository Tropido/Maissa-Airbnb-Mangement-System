import {
  AirVent,
  Briefcase,
  Car,
  Flame,
  Leaf,
  Trees,
  UtensilsCrossed,
  Waves,
  Wifi,
  WashingMachine,
  Sun,
  Beef,
  type LucideIcon,
} from 'lucide-react';

import type { Amenity, AmenityIcon } from '@/lib/data/types';

const ICONS: Record<AmenityIcon, LucideIcon> = {
  wifi: Wifi,
  pool: Waves,
  ac: AirVent,
  kitchen: UtensilsCrossed,
  parking: Car,
  sea: Waves,
  terrace: Sun,
  workspace: Briefcase,
  washer: WashingMachine,
  fireplace: Flame,
  garden: Trees,
  bbq: Beef,
};

export function AmenitiesGrid({ amenities }: { amenities: Amenity[] }) {
  return (
    <ul className="grid divide-x divide-y divide-muted/30 border border-muted/30 sm:grid-cols-2">
      {amenities.map((amenity) => {
        const Icon = ICONS[amenity.icon] ?? Leaf;
        return (
          <li key={amenity.label} className="flex items-center gap-3 p-4">
            <Icon className="size-4 shrink-0 text-muted-fg" aria-hidden />
            <span className="text-sm">{amenity.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
