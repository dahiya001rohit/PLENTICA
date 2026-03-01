import React from 'react'
import { Link } from 'react-router-dom'

const steps = [
  {
    step: '01',
    icon: '📍',
    title: 'Enter Your Location',
    desc: 'Provide your city, state, and country. Our AI analyzes your region\'s climate zone, soil type, rainfall patterns, and temperature profile.',
  },
  {
    step: '02',
    icon: '📐',
    title: 'Specify Land Size',
    desc: 'Tell us how many acres you have. The optimizer calculates the ideal crop allocation to maximize every square foot of your farm.',
  },
  {
    step: '03',
    icon: '🤖',
    title: 'AI Generates Your Plan',
    desc: 'Our Gemini-powered engine builds a custom farm plan with crop distribution, profit estimates, irrigation schedules, and risk assessment.',
  },
  {
    step: '04',
    icon: '📊',
    title: 'Visualize & Execute',
    desc: 'View interactive planting grids, profit breakdowns, and actionable insights on your personalized dashboard. Start farming smarter.',
  },
]

const team = [
  { name: 'Rohit Dahiya', role: 'Full Stack Developer', avatar: '🧑‍💻' },
]

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50 pt-24">

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 text-center py-16">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          About Plentica
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Farming, powered by
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500"> Intelligence</span>
        </h1>
        <p className="text-gray-500 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
          Plentica is a precision agriculture platform that uses AI to help farmers optimize crop allocation,
          conserve water, and maximize profitability — all from a single dashboard.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Agriculture feeds the world, yet most farmers still rely on outdated methods and guesswork.
              We believe every farmer — from smallholders to large enterprises — deserves access to data-driven insights.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Plentica bridges the gap between cutting-edge AI and practical farming, delivering actionable
              plans that respect regional soil, climate, and market conditions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '95%', label: 'Plan Accuracy' },
              { value: '30%', label: 'Water Savings' },
              { value: '2x', label: 'Profit Potential' },
              { value: '50+', label: 'Regions Supported' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-extrabold text-green-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            How It Works
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Four steps to a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500"> smarter farm</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-4xl mb-4">{s.icon}</div>
              <div className="absolute top-4 right-4 text-xs font-bold text-green-200 group-hover:text-green-400 transition-colors">
                STEP {s.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'JWT Auth', 'Vite'].map((tech, i) => (
              <span key={i} className="bg-gray-50 text-gray-700 px-5 py-2.5 rounded-full text-sm font-semibold border border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors cursor-default">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          Ready to optimize your farm?
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Join Plentica and get your AI-powered farm plan in minutes — completely free.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="bg-[#2E7D32] text-white px-8 py-3.5 rounded-lg font-semibold text-lg shadow-lg shadow-green-500/25 hover:bg-green-700 hover:shadow-green-500/40 transition-all duration-300"
          >
            Get Started Free
          </Link>
          <Link
            to="/"
            className="bg-white text-gray-700 px-8 py-3.5 rounded-lg font-semibold text-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </section>

    </div>
  )
}

export default HowItWorks
