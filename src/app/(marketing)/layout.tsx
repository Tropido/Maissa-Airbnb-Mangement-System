/**
 * Marketing shell. Each page composes its own header (the home hero carries
 * its navigation inside the hero card; listings and detail use the sticky
 * blush bar), so the shell only provides the skip link.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-ink-foreground"
      >
        Skip to content
      </a>
      <div className="min-h-screen overflow-x-clip">{children}</div>
    </>
  );
}
