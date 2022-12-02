import React from 'react';
import Button from './Button';

function Landing() {
  return (
    <section className="openning">
      <div className="space-y-8">
        <h1 className="space-y-3 text-5xl font-semibold tracking-wide lg:text-6xl xl:text-7xl">
          <span className="block bg-gradient-to-r from-red-500 to-black bg-clip-text text-transparent">
            Go Solar
          </span>
          <span className="block">For The Generations</span>
          <span className="block">To Come </span>
        </h1>

        <div className="space-x-8">
          <Button title="Buy Now" href='/checkout' />
          <a className="link">Learn More</a>
        </div>
      </div>

      
    </section>
  );
}

export default Landing;
