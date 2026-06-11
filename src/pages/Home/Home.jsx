import Seo from '../../components/ui/Seo';
import HomeHero from '../../components/hero/HomeHero';
import BrandStory from '../../components/sections/BrandStory';
import FlavorCollections from '../../components/sections/FlavorCollections';
import BestSellers from '../../components/sections/BestSellers';
import WhyUncommon from '../../components/sections/WhyUncommon';
import Reviews from '../../components/sections/Reviews';
import PodcastPreview from '../../components/sections/PodcastPreview';
import EmailSignup from '../../components/sections/EmailSignup';
import { brand } from '../../data/brand';

export default function Home() {
  return (
    <>
      <Seo
        title="Premium Utah-Made Jerky"
        description={brand.tagline}
        path="/"
      />
      <HomeHero />
      <BrandStory />
      <FlavorCollections />
      <BestSellers />
      <WhyUncommon />
      <Reviews />
      <PodcastPreview />
      <EmailSignup />
    </>
  );
}
