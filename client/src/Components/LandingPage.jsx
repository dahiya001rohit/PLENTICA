import React from 'react';
import HeroLanding from './LandingPage/HeroLanding';
import LandingPage2 from './LandingPage/LandingPage2';

const LandingPage = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <HeroLanding />
      <LandingPage2 />
    </div>
  );
};

export default LandingPage;
