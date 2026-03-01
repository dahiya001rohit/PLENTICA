import React from 'react'
import { useEffect, useState } from 'react'


const Top = ( {data} ) => {
    const [stat, setStat] = useState([
        { icon: '📊', label: 'Exp. Profit', value: '$42,500', bg: 'bg-green-50', text: 'text-green-600' },
        { icon: '💧', label: 'Water Used', value: '12.4k L', bg: 'bg-blue-50', text: 'text-blue-600' },
        { icon: '📐', label: 'Allocated', value: '48.2 Ac', bg: 'bg-emerald-50', text: 'text-emerald-600' },
        { icon: '✅', label: 'Risk Level', value: 'Low', bg: 'bg-green-50', text: 'text-green-600' },
    ])
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            const updatedStats = [
                { icon: '📊', label: 'Exp. Profit', value: data.stats?.expectedProfit || '$42,500', bg: 'bg-green-50', text: 'text-green-600' },
                { icon: '💧', label: 'Water Used', value: data.stats?.waterUsed || '12.4k L', bg: 'bg-blue-50', text: 'text-blue-600' },
                { icon: '📐', label: 'Allocated', value: data.stats?.allocatedArea || '48.2 Ac', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                { icon: data.stats?.riskLevel === 'Low' ? '✅' : data.stats?.riskLevel === 'Moderate' ? '⚠️' : '❌', label: 'Risk Level', value: data.stats?.riskLevel || 'Low', bg: data.stats?.riskLevel === 'Low' ? 'bg-green-50' : data.stats?.riskLevel === 'Moderate' ? 'bg-yellow-50' : 'bg-red-50', text: data.stats?.riskLevel === 'Low' ? 'text-green-600' : data.stats?.riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-red-600' },
            ];
            setStat(updatedStats);
        }
    }, [data]);
  return (
    <div className='w-full h-[16%] flex items-start gap-4'>
      {stat.map((s) => (
        <div
          key={s.label}
          className='flex-1 h-full bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1'
        >
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${s.bg} ${s.text}`}>
            {s.icon}
          </div>
          <span className='text-[10px] font-semibold text-gray-400 uppercase tracking-wide'>
            {s.label}
          </span>
          <span className='text-lg font-bold text-gray-900'>{s.value}</span>
        </div>
      ))}
    </div>
  )
}

export default Top
