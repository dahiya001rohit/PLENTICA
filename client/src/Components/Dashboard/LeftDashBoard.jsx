import React, { useState } from 'react'

const LeftDashboard = () => {
  const [formData, setFormData] = useState({
    landSize: '',
    waterAvailability: 75,
    soilType: 'Loamy (Optimal)',
    climateZone: 'Temperate',
    annualRainfall: '800',
    marketDemand: 80,
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setFormData({
      landSize: '',
      waterAvailability: 75,
      soilType: 'Loamy (Optimal)',
      climateZone: 'Temperate',
      annualRainfall: '800',
      marketDemand: 80,
    })
  }

  const getDemandLabel = (val) => {
    if (val >= 70) return 'High'
    if (val >= 40) return 'Medium'
    return 'Low'
  }

  return (
    <div className='w-[25%] h-[80%] bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5 overflow-y-auto'>
      {/* Title */}
      <h2 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
        <span className='text-2xl'>🌾</span> Farm Inputs
      </h2>

      {/* Land Size */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          Land Size (Acres)
        </label>
        <input
          type='number'
          placeholder='e.g. 50'
          value={formData.landSize}
          onChange={(e) => handleChange('landSize', e.target.value)}
          className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'
        />
      </div>

      {/* Water Availability */}
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between'>
          <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
            Water Availability
          </label>
          <span className='text-xs font-semibold text-green-600'>
            {formData.waterAvailability}%
          </span>
        </div>
        <input
          type='range'
          min='0'
          max='100'
          value={formData.waterAvailability}
          onChange={(e) => handleChange('waterAvailability', Number(e.target.value))}
          className='w-full h-2 rounded-full appearance-none cursor-pointer accent-green-500'
          style={{
            background: `linear-gradient(to right, #22c55e ${formData.waterAvailability}%, #e5e7eb ${formData.waterAvailability}%)`
          }}
        />
      </div>

      {/* Soil Type */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          Soil Type
        </label>
        <div className='relative'>
          <select
            value={formData.soilType}
            onChange={(e) => handleChange('soilType', e.target.value)}
            className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition appearance-none bg-white cursor-pointer'
          >
            <option value='Loamy (Optimal)'>Loamy (Optimal)</option>
            <option value='Sandy'>Sandy</option>
            <option value='Clay'>Clay</option>
            <option value='Silty'>Silty</option>
            <option value='Peaty'>Peaty</option>
            <option value='Chalky'>Chalky</option>
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
            <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>
      </div>

      {/* Climate Zone */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          Climate Zone
        </label>
        <div className='relative'>
          <select
            value={formData.climateZone}
            onChange={(e) => handleChange('climateZone', e.target.value)}
            className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition appearance-none bg-white cursor-pointer'
          >
            <option value='Temperate'>Temperate</option>
            <option value='Tropical'>Tropical</option>
            <option value='Arid'>Arid</option>
            <option value='Continental'>Continental</option>
            <option value='Mediterranean'>Mediterranean</option>
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
            <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>
      </div>

      {/* Annual Rainfall */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
          Annual Rainfall (MM)
        </label>
        <input
          type='number'
          placeholder='e.g. 800'
          value={formData.annualRainfall}
          onChange={(e) => handleChange('annualRainfall', e.target.value)}
          className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'
        />
      </div>

      {/* Market Demand Focus */}
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between'>
          <label className='text-xs font-semibold text-gray-500 tracking-wide uppercase'>
            Market Demand Focus
          </label>
          <span className='text-xs font-semibold text-green-600'>
            {getDemandLabel(formData.marketDemand)}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='range'
            min='0'
            max='100'
            value={formData.marketDemand}
            onChange={(e) => handleChange('marketDemand', Number(e.target.value))}
            className='w-full h-2 rounded-full appearance-none cursor-pointer accent-green-500'
            style={{
              background: `linear-gradient(to right, #22c55e ${formData.marketDemand}%, #e5e7eb ${formData.marketDemand}%)`
            }}
          />
          <span className='w-3 h-3 rounded-full bg-green-500 flex-shrink-0'></span>
        </div>
      </div>

      {/* Buttons */}
      <div className='flex flex-col gap-3 mt-auto pt-4'>
        <button className='w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer'>
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
