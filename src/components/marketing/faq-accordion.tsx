import { Plus } from 'lucide-react';

import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';

const FAQS = [
  {
    question: 'How does booking actually work?',
    answer:
      'Enquire here with your dates and the home you want. I confirm availability within the hour, then send an Airbnb booking link — the stay is paid and protected through Airbnb, not directly to me.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Each listing follows Airbnb’s standard moderate policy: a full refund up to five days before check-in. Exact terms are shown at checkout on Airbnb before you pay.',
  },
  {
    question: 'Can I contact you before booking?',
    answer:
      'Yes — that is what the enquiry form is for. Ask about the house, the neighbourhood, or exact check-in times before you commit to anything.',
  },
  {
    question: 'Do you offer airport transfers or extras?',
    answer:
      'Some homes can arrange a transfer or early check-in on request. Mention it in your enquiry and I will confirm what is possible for that property.',
  },
];

/** Native <details>/<summary> — no JS, no dependency, accessible by default. */
export function FaqAccordion() {
  return (
    <section aria-labelledby="faq-heading" className="shell py-section">
      <Reveal className="max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-fg">Questions</p>
        <h2 id="faq-heading" className="mt-4 font-display text-display-md font-normal">
          Before you ask.
        </h2>
      </Reveal>

      <RevealGroup as="ul" className="mt-10 max-w-2xl divide-y divide-muted/30 border-t border-muted/30">
        {FAQS.map((faq) => (
          <RevealItem as="li" key={faq.question}>
            <details className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base text-ink marker:content-none">
                {faq.question}
                <Plus className="size-4 shrink-0 text-muted-fg transition-transform duration-200 group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-fg">{faq.answer}</p>
            </details>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
