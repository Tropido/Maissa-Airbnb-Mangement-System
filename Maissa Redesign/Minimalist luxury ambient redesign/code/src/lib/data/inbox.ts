import type { Channel } from './types';

export interface MessageThread {
  id: string;
  guest_name: string;
  listing_id: string;
  channel: Channel;
  preview: string;
  received_at: string;
  unread: boolean;
}

/**
 * Static guest-inbox fixtures. Messaging is read-only in this build: replies go
 * out on the channel the guest wrote from, so there is no second inbox to keep
 * in sync. When that changes, this file is what Supabase replaces.
 *
 * v5: both listing_ids point at the two-home portfolio.
 */
export const MESSAGE_THREADS: MessageThread[] = [
  {
    id: 't_lukas_weber',
    guest_name: 'Lukas Weber',
    listing_id: 'l_djerba_villa',
    channel: 'booking_com',
    preview: 'The payment link expired before I could use it. Could you resend it?',
    received_at: '14 min',
    unread: true,
  },
  {
    id: 't_nadia_cherif',
    guest_name: 'Nadia Cherif',
    listing_id: 'l_ezzahra_apartment_loft',
    channel: 'direct',
    preview: 'We land at 11:20 — is an early check-in still possible?',
    received_at: '42 min',
    unread: true,
  },
  {
    id: 't_claire_dubois',
    guest_name: 'Claire Dubois',
    listing_id: 'l_ezzahra_apartment_loft',
    channel: 'booking_com',
    preview: 'Does the terrace get the sun in the morning or the evening?',
    received_at: '1 h',
    unread: true,
  },
  {
    id: 't_rami_haddad',
    guest_name: 'Rami Haddad',
    listing_id: 'l_djerba_villa',
    channel: 'booking_com',
    preview: 'Can we bring a dog? He is small and well behaved.',
    received_at: '3 h',
    unread: true,
  },
  {
    id: 't_yuki_tanaka',
    guest_name: 'Yuki Tanaka',
    listing_id: 'l_ezzahra_apartment_loft',
    channel: 'airbnb',
    preview: 'Thank you for the terrace photos, they settled it. Booking now.',
    received_at: '4 h',
    unread: true,
  },
  {
    id: 't_amira_ben_salah',
    guest_name: 'Amira Ben Salah',
    listing_id: 'l_djerba_villa',
    channel: 'airbnb',
    preview: 'Arrived safely, the courtyard is even better in person.',
    received_at: '7 h',
    unread: false,
  },
  {
    id: 't_mehdi_gharbi',
    guest_name: 'Mehdi Gharbi',
    listing_id: 'l_djerba_villa',
    channel: 'airbnb',
    preview: 'Where do we collect the keys if we arrive after dark?',
    received_at: '12 h',
    unread: false,
  },
];

export const unreadCount = () => MESSAGE_THREADS.filter((m) => m.unread).length;
