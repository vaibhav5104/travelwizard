import React, { useEffect, useRef } from 'react';

const TestimonialsSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "50px",
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="py-20 px-4 observe-section opacity-0 bg-gradient-to-b from-yellow-200 to-purple-400">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            What <span className="text-pink-500">Travelers Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">AK</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Akash</h4>
                  <p className="text-sm text-gray-500">Adventure Seeker</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"Travel Wizard made planning my Europe trip so easy! The personalized itinerary was perfect, and I discovered places I never would have found on my own."</p>
              <div className="mt-4 text-pink-500" aria-label="5 star rating">★★★★★</div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">HN</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Heena</h4>
                  <p className="text-sm text-gray-500">Family Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"As a mom of three, planning vacations used to be stressful. This app helped me find family-friendly activities and accommodations that everyone loved!"</p>
              <div className="mt-4 text-pink-500" aria-label="5 star rating">★★★★★</div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold text-white mr-4">RJ</div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Rajesh</h4>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 italic">"I travel for work constantly, and this app has been a game-changer. It helps me balance work meetings with exploring new cities in my free time."</p>
              <div className="mt-4 text-pink-500" aria-label="5 star rating">★★★★★</div>
            </div>
          </div>
        </div>
      </section>

      {/* Add the CSS animation styles */}
      <style jsx>{`
        .animate-reveal {
          animation: reveal 0.8s ease forwards;
        }
        
        @keyframes reveal {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default TestimonialsSection;