import React from 'react'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const RightMiddle = ({ data }) => {
    const [waterData, setWaterData] = React.useState([]);
    
    React.useEffect(() => {
        if (data && data.irrigation) {
            setWaterData(data.irrigation.active);
        }
    }, [data]);
  return (
    <div className='w-full h-[20%] bg-white rounded-xl border border-gray-200 p-5 flex flex-col'>
      {/* Header */}
      <h3 className='text-base font-bold text-gray-900 mb-4'>Weekly Irrigation Schedule</h3>

      {/* Days Row */}
      <div className='flex items-center justify-between flex-1'>
        {days.map((day, idx) => (
          <div key={idx} className='flex flex-col items-center gap-2'>
            <span className='text-xs font-semibold text-gray-500'>{day}</span>
            <div className={`w-8 h-8 rounded-full border-2 ${waterData[idx] === 1 ? ' bg-blue-400' : 'border-gray-200'}`}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RightMiddle
