import React from 'react'

const insights = [
  {
    icon: '✅',
    iconBg: 'bg-green-100 text-green-600',
    title: 'Crop Selection',
    desc: 'Corn selected due to high market demand and loamy soil compatibility.',
  },
  {
    icon: '💧',
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'Water Efficiency: 92%',
    desc: 'Integrated Soy helps retain nitrogen, reducing overall irrigation needs.',
  },
  {
    icon: '⚠️',
    iconBg: 'bg-yellow-100 text-yellow-600',
    title: 'Moderate Risk Level',
    desc: 'Potential frost in late season might affect Wheat yield by 5-10%.',
  },
]

const RightTop = ({ data }) => {
    const [insights, setInsights] = React.useState([
  {
    icon: '✅',
    iconBg: 'bg-green-100 text-green-600',
    title: 'Crop Selection',
    desc: 'Corn selected due to high market demand and loamy soil compatibility.',
  },
  {
    icon: '💧',
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'Water Efficiency: 92%',
    desc: 'Integrated Soy helps retain nitrogen, reducing overall irrigation needs.',
  },
  {
    icon: '⚠️',
    iconBg: 'bg-yellow-100 text-yellow-600',
    title: 'Moderate Risk Level',
    desc: 'Potential frost in late season might affect Wheat yield by 5-10%.',
  },
])

    React.useEffect(() => {
        if (data && data.insights) {
            setInsights(data.insights);
        }
    }, [data])
  return (
    <div className='w-full min-h-[40%] bg-white rounded-xl border border-gray-200 p-5 flex flex-col'>
      {/* Header */}
      <h3 className='text-base font-bold text-gray-900 flex items-center gap-2 mb-4'>
        <span className='w-3 h-3 rounded-full bg-green-500 inline-block'></span>
        Smart Insights
      </h3>

      {/* Insights List */}
      <div className='flex flex-col gap-4 flex-1'>
        {insights.map((item) => (
          <div key={item.title} className='flex items-start gap-3'>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 ${item.iconBg}`}>
              {item.icon}
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold text-gray-800'>{item.title}</span>
              <span className='text-xs text-gray-500 leading-relaxed'>{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RightTop
