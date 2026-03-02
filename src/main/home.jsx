import React from "react";
import HeroSection from "./herosection"
import SocialProofSection from "./socialproof"
import FeatureGrid from "./featuregrid.jsx";
import OurBestFeature from "./ourbestfeature.jsx";
import VoiceShowcase from "./voiceshowcase.jsx";
import CtaBanner from "./ctabanner.jsx";
import FQASection from "./fqasection.jsx";
import Footer from "./footer.jsx";

 function Main() {
  return (
    
      <main className="w-full relative">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 bg-soft-gradient opacity-60 pointer-events-none" />

        {/* Hero Section */}
        <HeroSection />

        {/* Social Proof */}
        <SocialProofSection />

        {/* feature grid */}
        <FeatureGrid />

        {/* Our Best Feature Section */}
        <OurBestFeature />

        {/* Voice Showcase Carousel */}
        <VoiceShowcase />

        {/* CTA Banner */}
        <CtaBanner />

        {/* FAQ Section */}
        <FQASection />

        {/* Footer */}
        <Footer />
      </main>
    
  );
}

export default Main;
