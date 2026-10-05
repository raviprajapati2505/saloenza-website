import { Hero } from '@/components/sections/Hero';
import { ConnectedPlatform } from '@/components/sections/ConnectedPlatform';
import { ConnectedWorkspace } from '@/components/sections/ConnectedWorkspace';
import { WhySaloenza } from '@/components/sections/WhySaloenza';
import { PlatformCapabilities } from '@/components/sections/PlatformCapabilities';
import { ProductProof } from '@/components/sections/ProductProof';
import { CompleteSalonWorkspace } from '@/components/sections/CompleteSalonWorkspace';
import { CallToAction } from '@/components/sections/CallToAction';

/**
 * Saloenza Homepage
 *
 * Sections will be added progressively per instruction.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ConnectedPlatform />
      <ConnectedWorkspace />
      <WhySaloenza />
      <PlatformCapabilities />
      <ProductProof />
      <CompleteSalonWorkspace />
      <CallToAction />
      {/* Additional sections will be added here in future steps */}
    </>
  );
}
