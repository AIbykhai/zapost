import React from 'react';
import Link from 'next/link';

const IntroductionScreen: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-playfair mb-6">
        Welcome to <span className="bg-peach-light px-2 py-1 rounded-lg">AI Social Person</span>
      </h1>
      
      <div className="mb-8">
        <p className="text-xl mb-4 font-inter">
          Let&apos;s get you set up with your personalized brand profile so we can create content
          that matches your unique voice and style.
        </p>
        
        <p className="text-lg mb-6 font-inter">
          This quick onboarding process will help us understand your brand better and
          create content that resonates with your audience.
        </p>
      </div>
      
      <div className="flex justify-center">
        <Link 
          href="/onboarding/content-import"
          className="bg-orange-500 text-white px-8 py-3 rounded-lg font-inter font-medium text-lg hover:bg-orange-600 transition-colors"
        >
          Let&apos;s define your brand
        </Link>
      </div>
    </div>
  );
};

export default IntroductionScreen; 