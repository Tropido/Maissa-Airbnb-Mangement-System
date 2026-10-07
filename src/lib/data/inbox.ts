import type { Channel } from './types';

export interface MessageThread {
  id: string;
  guest_name: string;
  listing_id: string;
  channel: Channel;
  preview: string;
  received_minutes_ago: number;
  unread: boolean;
}

/**
 * Guest inbox. Messaging is read-only in this build — replies still go out on
 * the channel the guest wrote from — so this feeds the inbox page, the unread
 * badge and the messages stat card. When that changes, this file is what
 * Supabase replaces.
 */
export const MESSAGE_THREADS: MessageThread[] = [
  {
    id: 'm_001',
    guest_name: 'Lukas Weber',
    listing_id: 'l_djerba_villa',
    channel: 'booking_com',
    preview: 'The payment link expired before I could use it. Could you resend it?',
    received_minutes_ago: 14,
    unread: true,
  },
  {
    id: 'm_002',
    guest_name: 'Nadia Cherif',
    listing_id: 'l_ezzahra_apartment_loft',
    channel: 'direct',
    preview: 'We land at 11:20 — is an early check-in still possible?',
    received_minutes_ago: 42,
    unread: true,
  },
  {
    id: 'm_003',
    guest_name: 'Claire Dubois',
    listing_id: 'l_ezzahra_apartment_loft',
    channel: 'booking_com',
    preview: 'Does the terrace get the sun in the morning or the evening?',
    received_minutes_ago: 60,
    unread: true,
  },
  {
    id: 'm_004',
    guest_name: 'Rami Haddad',
    listing_id: 'l_djerba_villa',
    channel: 'booking_com',
    preview: 'Can we bring a dog? He is small and well behaved.',
    received_minutes_ago: 180,
    unread: true,
  },
  {
    id: 'm_005',
    guest_name: 'Yuki Tanaka',
    listing_id: 'l_ezzahra_apartment_loft',
    channel: 'airbnb',
    preview: 'Thank you for the terrace photos, they settled it. Booking now.',
    received_minutes_ago: 240,
    unread: true,
  },
  {
    id: 'm_006',
    guest_name: 'Amira Ben Salah',
    listing_id: 'l_djerba_villa',
    channel: 'airbnb',
    preview: 'Arrived safely, the courtyard is even better in person.',
    received_minutes_ago: 420,
    unread: false,
  },
  {
    id: 'm_007',
    guest_name: 'Mehdi Gharbi',
    listing_id: 'l_djerba_villa',
    channel: 'airbnb',
    preview: 'Where do we collect the keys if we arrive after dark?',
    received_minutes_ago: 720,
    unread: false,
  },
];

export const unreadCount = () => MESSAGE_THREADS.filter((m) => m.unread).length;
