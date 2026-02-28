import React from 'react'

// 0=Field A (green), 1=Field B (yellow), 2=Field C (blue)
const plantingGrid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
]

const fieldColors = ['bg-green-400', 'bg-yellow-300', 'bg-blue-400']
const fieldBorders = ['border-green-500', 'border-yellow-500', 'border-blue-500']

const Bottom = () => {
  return (
    <div className='w-full h-[42%]'>
      <div className='w-full h-full bg-white rounded-xl border border-gray-200 p-5 flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-sm font-bold text-gray-800'>Planting Layout Visualization</h3>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1.5'>
              <span className='w-3 h-3 rounded-sm bg-green-400 border border-green-500'></span>
              <span className='text-[11px] text-gray-500 font-medium'>Field A</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='w-3 h-3 rounded-sm bg-yellow-300 border border-yellow-500'></span>
              <span className='text-[11px] text-gray-500 font-medium'>Field B</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='w-3 h-3 rounded-sm bg-blue-400 border border-blue-500'></span>
              <span className='text-[11px] text-gray-500 font-medium'>Field C</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className='flex-1 flex flex-col gap-1.5'>
          {plantingGrid.map((row, rowIdx) => (
            <div key={rowIdx} className='flex-1 flex gap-1.5'>
              {row.map((cell, colIdx) => (
                <div
                  key={colIdx}
                  className={`flex-1 rounded-md ${fieldColors[cell]} border ${fieldBorders[cell]}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Footer labels */}
        <div className='flex items-center justify-between mt-3 px-1'>
          <span className='text-[10px] text-gray-400'>North Boundary</span>
          <span className='text-[10px] text-gray-400'>Optimal drainage zones highlighted</span>
          <span className='text-[10px] text-gray-400'>South Boundary</span>
        </div>
      </div>
    </div>
  )
}

export default Bottom
