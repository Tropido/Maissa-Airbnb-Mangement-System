import { PageMotion } from '@/components/motion/page-motion';

/**
 * Page motion for each dashboard route. A template (not the layout) so it
 * hydrates together with the page it animates and remounts on navigation —
 * motion never touches markup React has not hydrated yet.
 */
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <PageMotion>{children}</PageMotion>;
}
