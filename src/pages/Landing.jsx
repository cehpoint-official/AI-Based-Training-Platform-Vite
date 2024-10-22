import React from "react";
import Header from "../components/Header";
import Footers from "../components/Footers";
import SlideOne from "../components/landing/SlideOne";
import SlideTwo from "../components/landing/SlideTwo";
import SlideThree from "../components/landing/SlideThree";
// import SlideFour from '../components/landing/slideFour';
import SlideFive from "../components/landing/SlideFive";
import SlideSix from "../components/landing/SlideSix";
// import axios from 'axios';

const Landing = () => {
  return (
    <>
      <Header isHome={false} />
      <SlideOne />
      <SlideTwo />
      <SlideThree />

      <SlideFive />
      <SlideSix />
      <Footers />
    </>
  );
};

export default Landing;
