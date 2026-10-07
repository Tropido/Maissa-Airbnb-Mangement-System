/**
 * The loading screen. Rendered as the first child of the marketing shell so it
 * covers the page from the first paint; GsapProvider lifts it on `expo.inOut`
 * once the intro timeline is ready, then sets it to display:none.
 *
 * It is deliberately server-rendered and CSS-positioned rather than mounted by
 * JS: if the JS never arrives, the visitor should never see a curtain they
 * cannot get past. Should GSAP fail to load, the `<noscript>`-equivalent path is
 * GsapProvider's `finally` block, which removes it.
 */
export function PageLoader({
  mark = 'Maissa',
  note = 'Two homes · Tunisia',
}: {
  mark?: string;
  note?: string;
}) {
  return (
    <div
      data-loader
      aria-hidden
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-ink"
    >
      <p data-loader-mark className="text-display-lg m-0 text-ink-foreground">
        {mark}
      </p>
      <svg width="220" height="2" viewBox="0 0 220 2" className="block overflow-visible">
        <line data-loader-line x1="0" y1="1" x2="220" y2="1" stroke="currentColor" strokeWidth="2" className="text-accent" />
      </svg>
      <p data-loader-note className="m-0 text-[10.5px] uppercase tracking-[0.28em] text-ink-foreground/50">
        {note}
      </p>
    </div>
  );
}
