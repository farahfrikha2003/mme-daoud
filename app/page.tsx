import HeroSlider from '@/components/home/HeroSlider';
import WelcomeSection from '@/components/home/WelcomeSection';
import ProductSelection from '@/components/home/ProductSelection';
import GiftSection from '@/components/home/GiftSection';
import TraditionalSection from '@/components/home/TraditionalSection';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <WelcomeSection />
      <ProductSelection />
      <GiftSection />
      <TraditionalSection />
    </>
  );
}
