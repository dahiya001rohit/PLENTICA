import React from 'react'

const stats = [
  { icon: '📊', label: 'Exp. Profit', value: '$42,500', bg: 'bg-green-50', text: 'text-green-600' },
  { icon: '💧', label: 'Water Used', value: '12.4k L', bg: 'bg-blue-50', text: 'text-blue-600' },
  { icon: '📐', label: 'Allocated', value: '48.2 Ac', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { icon: '✅', label: 'Risk Level', value: 'Low', bg: 'bg-green-50', text: 'text-green-600' },
]

const Top = () => {
  return (
    <div className='w-full h-[16%] flex items-start gap-4'>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className='flex-1 h-full bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1'
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${stat.bg} ${stat.text}`}>
            {stat.icon}
          </div>
          <span className='text-[10px] font-semibold text-gray-400 uppercase tracking-wide'>
            {stat.label}
          </span>
          <span className='text-lg font-bold text-gray-900'>{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

export default Top
