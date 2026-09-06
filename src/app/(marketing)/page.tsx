import { AmbientGlow } from '@/components/marketing/ambient-glow';
import { ClosingCta } from '@/components/marketing/closing-cta';
import { ContactSection } from '@/components/marketing/contact-section';
import { FaqAccordion } from '@/components/marketing/faq-accordion';
import { HostProfile } from '@/components/marketing/host-profile';
import { ListingMarquee } from '@/components/marketing/listing-marquee';
import { ListingShowcase } from '@/components/marketing/listing-showcase';
import { MapSection } from '@/components/marketing/map-section';
import { ScrollExpandHero } from '@/components/marketing/scroll-expand-hero';
import { SectionDivider } from '@/components/marketing/section-divider';
import { SpinSection } from '@/components/marketing/spin-section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { getHost, getPublicListings } from '@/lib/data/queries';

const PROMISES = [
  {
    title: 'Photographed honestly',
    body: 'Every room, at the hour it actually looks like that. No wide-angle tricks, no borrowed sunsets.',
  },
  {
    title: 'One team on the ground',
    body: 'The same people prepare, clean and check each house. Nothing is subcontracted out to a rota of strangers.',
  },
  {
    title: 'Answered within the hour',
    body: 'Before you book and while you are there. Hosting since 2022, and that has not slipped.',
  },
];

export default async function HomePage() {
  const [host, listings] = await Promise.all([getHost(), getPublicListings()]);
  const flagship = listings.find((l) => l.status === 'active') ?? listings[0];

  return (
    <>
      <ScrollExpandHero
        listing={flagship}
        eyebrow="Djerba / Hammamet / Sidi Bou Said / Tabarka"
        title={['Design-forward', 'stays', 'in Tunisia']}
        subtitle="Four homes in Tunisia, renovated and hosted by Maissa. See exactly what you're booking."
      />

      <SectionDivider />

      <section aria-labelledby="promises-heading" className="shell py-section">
        <Reveal>
          <h2 id="promises-heading" className="max-w-3xl font-display text-display-md font-normal">
            What you see is what you walk into.
          </h2>
        </Reveal>
        <RevealGroup as="ul" className="mt-14 grid gap-10 divide-y divide-muted/40 md:grid-cols-3 md:gap-8 md:divide-y-0">
          {PROMISES.map((promise, i) => (
            <RevealItem as="li" key={promise.title} className="pt-8 first:pt-0 md:pt-0">
              <p className="font-mono text-xs text-primary">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 font-display text-xl font-normal leading-tight">
                {promise.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-fg">{promise.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <ListingShowcase listings={listings} />

      <ListingMarquee listings={listings} />

      <SpinSection listing={flagship} />

      <div className="relative bg-bg-raised">
        <AmbientGlow />
        <HostProfile host={host} listings={listings} />
      </div>

      <MapSection listings={listings} />

      <FaqAccordion />

      <ClosingCta
        listing={listings[listings.length - 1] ?? flagship}
        line="Come and see it before you decide anything from a photo."
        href="#contact"
        cta="Get in touch"
      />

      <ContactSection listings={listings} />
    </>
  );
}
