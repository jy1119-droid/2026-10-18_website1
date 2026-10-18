import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Matchmaking from '@/components/sections/Matchmaking';
import Sparring from '@/components/sections/Sparring';
import Assessment from '@/components/sections/Assessment';
import Profile from '@/components/sections/Profile';
import Events from '@/components/sections/Events';
import WhoItsFor from '@/components/sections/WhoItsFor';
import Faq from '@/components/sections/Faq';

export default function Page() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Matchmaking />
        <Sparring />
        <Assessment />
        <Profile />
        <Events />
        <WhoItsFor />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
