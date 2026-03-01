import React, { useState } from 'react'


const LeftDashboard = ({ city, state, country, landSize, setCity, setState, setCountry, setLandSize, handleGeneratePlan, isValid }) => {
  const handleReset = () => {
    setCity('')
    setState('')
    setCountry('')
    setLandSize('')
  }
 

  return (
    <div className='w-[25%] h-[80%] bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5 overflow-y-auto'>
      {/* Title */}
      <h2 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
        <span className='text-2xl'>🌾</span> Farm Inputs
      </h2>

      {/* City */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          City
        </label>
        <input
          type='text'
          placeholder='e.g. Sonipat'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'
        />
      </div>

      {/* State */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          State
        </label>
        <input
          type='text'
          placeholder='e.g. Haryana'
          value={state}
          onChange={(e) => setState(e.target.value)}
          className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'
        />
      </div>

      {/* Country */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          Country
        </label>
        <input
          type='text'
          placeholder='e.g. India'
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'
        />
      </div>

      {/* Land Size */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          Land Area (Acres)
        </label>
        <input
          type='number'
          placeholder='e.g. 50'
          value={landSize}
          onChange={(e) => setLandSize(e.target.value)}
          className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'
        />
      </div>

      {/* Buttons */}
      <div className='flex flex-col gap-3 mt-auto pt-4'>
        <button
          disabled={!isValid}
          className={`w-full py-3 font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer
            ${isValid
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          onClick={handleGeneratePlan}
        >
          <span>✦</span> Generate Plan
        </button>
        <button
          onClick={handleReset}
          className='w-full py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition cursor-pointer'
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default LeftDashboard
