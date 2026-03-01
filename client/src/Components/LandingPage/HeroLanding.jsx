import React from 'react';
import { Link } from 'react-router-dom';

const HeroLanding = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-100 rounded-full opacity-10 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Precision Agriculture Platform
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Smart Farm
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            Resource Optimization
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
          Optimize crop allocation, water usage, and profitability using advanced
          constraint-based optimization — built for modern farmers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="bg-[#2E7D32] text-white px-8 py-3.5 rounded-lg font-semibold text-lg shadow-lg shadow-green-500/25 hover:bg-green-700 hover:shadow-green-500/40 transition-all duration-300"
          >
            Start Planning Now
          </Link>
          <Link
            to="/about"
            className="bg-white text-gray-700 px-8 py-3.5 rounded-lg font-semibold text-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">95%</p>
            <p className="text-sm text-gray-400 mt-1">Optimization Accuracy</p>
          </div>
          <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">30%</p>
            <p className="text-sm text-gray-400 mt-1">Water Savings</p>
          </div>
          <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">2x</p>
            <p className="text-sm text-gray-400 mt-1">Profit Increase</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
