import React from 'react';
import { Sparkles, Globe, Target, Heart, MapPin, Shield, DollarSign, Compass, Users, Mail } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                About Travel Wizard
              </h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Welcome to Travel Wizard — your smart travel companion for unforgettable adventures
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-blue-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-red-500" />
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
              At Travel Wizard, we believe that planning your dream trip shouldn't be a hassle. Our mission is to make travel 
              <span className="font-semibold text-blue-600"> simpler, smarter, and more personal</span> — whether you're 
              escaping to snow-covered mountains in winter or basking under the summer sun.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed text-center max-w-4xl mx-auto mt-6">
              We help travelers discover destinations, plan itineraries, and find hotels or local experiences — all tailored 
              to your budget, preferences, and travel season. Powered by intelligent recommendations and user-friendly design, 
              Travel Wizard takes the stress out of planning and lets you focus on what matters: 
              <span className="font-semibold text-purple-600"> the joy of travel</span>.
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-blue-500" />
              <h2 className="text-3xl font-bold text-gray-800">What We Do</h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Recommendations</h3>
              <p className="text-gray-600">Get personalized travel suggestions based on your interests and season of travel.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Dynamic Itineraries</h3>
              <p className="text-gray-600">Create and customize travel plans that adapt to your timeline and budget.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Trusted Listings</h3>
              <p className="text-gray-600">Browse curated hotels, places to visit, and local attractions.</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Seamless Experience</h3>
              <p className="text-gray-600">Enjoy a clean, responsive interface that's easy to use on the go.</p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-yellow-300" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
                To become the go-to digital travel planner for anyone looking to explore the world with ease, 
                confidence, and excitement — no matter the budget or destination.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Travel Wizard?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget-Friendly</h3>
              <p className="text-gray-600">Smart suggestions that fit your wallet</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Seasonal Insights</h3>
              <p className="text-gray-600">Perfect timing for every destination</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Maps</h3>
              <p className="text-gray-600">Visual planning with location tools</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Privacy Focused</h3>
              <p className="text-gray-600">No spam, just great travel plans</p>
            </div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="inline-flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-blue-500" />
              <h2 className="text-3xl font-bold text-gray-800">Let's Connect</h2>
            </div>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Travel Wizard is built by passionate explorers and developers who believe that good travel starts with smart planning. 
              We're constantly evolving and love hearing from our users.
            </p>
            <p className="text-gray-600 mb-6">
              Got feedback, feature requests, or just want to say hello?
            </p>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => navigate('/contact')}>
              <Mail className="w-5 h-5" />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About