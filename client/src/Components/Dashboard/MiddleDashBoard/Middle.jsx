import React from 'react'

const crops = [
  { name: 'Corn', percent: 40, color: '#22c55e' },
  { name: 'Wheat', percent: 30, color: '#facc15' },
  { name: 'Soy', percent: 30, color: '#3b82f6' },
]

const profits = [
  { name: 'Corn', amount: '$18.5k', percent: 88, color: 'bg-green-500' },
  { name: 'Wheat', amount: '$12.2k', percent: 58, color: 'bg-yellow-400' },
  { name: 'Soy', amount: '$11.8k', percent: 56, color: 'bg-blue-500' },
]

const donutGradient = `conic-gradient(#22c55e 0% 40%, #facc15 40% 70%, #3b82f6 70% 100%)`

const Middle = () => {
  return (
    <div className='w-full h-[42%] flex gap-4'>
      {/* Crop Distribution */}
      <div className='flex-1 bg-white rounded-xl border border-gray-200 p-5 flex flex-col'>
        <h3 className='text-sm font-bold text-gray-800 mb-3'>Crop Distribution</h3>
        <div className='flex-1 flex flex-col items-center justify-center'>
          {/* Donut Chart */}
          <div className='relative w-36 h-36'>
            <div
              className='w-full h-full rounded-full'
              style={{ background: donutGradient }}
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-22 h-22 bg-white rounded-full flex flex-col items-center justify-center'>
                <span className='text-[10px] text-gray-400'>Total</span>
                <span className='text-base font-bold text-gray-900'>50 Ac</span>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className='flex gap-4 mt-3'>
            {crops.map((crop) => (
              <div key={crop.name} className='flex items-center gap-1.5'>
                <span
                  className='w-2.5 h-2.5 rounded-full'
                  style={{ backgroundColor: crop.color }}
                />
                <span className='text-[11px] text-gray-500 font-medium'>
                  {crop.name.toUpperCase()} ({crop.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit per Crop */}
      <div className='flex-1 bg-white rounded-xl border border-gray-200 p-5 flex flex-col'>
        <h3 className='text-sm font-bold text-gray-800 mb-3'>Profit per Crop</h3>
        <div className='flex-1 flex flex-col justify-center gap-5'>
          {profits.map((crop) => (
            <div key={crop.name} className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-700 font-medium'>{crop.name}</span>
                <span className='text-sm font-semibold text-gray-800'>{crop.amount}</span>
              </div>
              <div className='w-full h-3 bg-gray-100 rounded-full overflow-hidden'>
                <div
                  className={`h-full ${crop.color} rounded-full`}
                  style={{ width: `${crop.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Middle
