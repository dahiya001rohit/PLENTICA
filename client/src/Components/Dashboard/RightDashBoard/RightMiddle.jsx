import React from 'react'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const RightMiddle = () => {
  return (
    <div className='w-full h-[30%] bg-white rounded-xl border border-gray-200 p-5 flex flex-col'>
      {/* Header */}
      <h3 className='text-base font-bold text-gray-900 mb-4'>Weekly Irrigation Schedule</h3>

      {/* Days Row */}
      <div className='flex items-center justify-between flex-1'>
        {days.map((day, idx) => (
          <div key={idx} className='flex flex-col items-center gap-2'>
            <span className='text-xs font-semibold text-gray-500'>{day}</span>
            <div className='w-8 h-8 rounded-full border-2 border-gray-200'></div>
          </div>
        ))}
      </div>

      {/* Download Link */}
      <div className='mt-3 flex justify-center'>
        <button className='text-sm text-green-600 font-semibold border border-green-500 rounded-lg px-4 py-2 hover:bg-green-50 transition cursor-pointer'>
          Download Full Schedule
        </button>
      </div>
    </div>
  )
}

export default RightMiddle
