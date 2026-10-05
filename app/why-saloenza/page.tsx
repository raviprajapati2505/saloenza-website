import type { Metadata } from 'next';
import { WhySaloenzaAccordion } from './WhySaloenzaAccordion';
import { SaloenzaCTA } from '@/components/sections/SaloenzaCTA';

export const metadata: Metadata = {
  title: 'Why Saloenza | Salon Management Software Built for Modern Salons',
  description: 'Discover how Saloenza connects appointments, clients, staff, billing, inventory, reporting, and multi-location operations in one modern salon management platform.',
  alternates: {
    canonical: 'https://saloenza.com/why-saloenza',
  },
};

export default function WhySaloenzaPage() {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Why Saloenza | Salon Management Software Built for Modern Salons',
    description: 'Discover how Saloenza connects appointments, clients, staff, billing, inventory, reporting, and multi-location operations in one modern salon management platform.',
    url: 'https://saloenza.com/why-saloenza',
    publisher: {
      '@type': 'Organization',
      name: 'Saloenza',
      logo: {
        '@type': 'ImageObject',
        url: 'https://saloenza.com/brand/saloenza-logo.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      
      <main>
        <WhySaloenzaAccordion />
        
        <SaloenzaCTA 
          eyebrow="READY TO GROW YOUR SALON?"
          title={<>Everything you need to run your salon.<br className="hidden md:block" /> All in one place.</>}
          subtitle="Bring appointments, clients, payments, staff, inventory, and reporting together with Saloenza."
        />
      </main>
    </>
  );
}
