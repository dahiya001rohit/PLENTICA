import React from 'react'
import LeftDashboard from './Dashboard/LeftDashBoard'
import MiddleDashBoard from './Dashboard/MiddleDashBoard'
import RightDashBoard from './Dashboard/RightDashBoard'
import { useState } from 'react'
import api from '../utils/api'

const DashBoard = () => {
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [landSize, setLandSize] = useState('')
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const isValid = city.trim() && state.trim() && country.trim() && landSize.trim()
    
      const handleGeneratePlan = async(e) => {
        e.preventDefault()
        
        if (!isValid || loading) return
        setLoading(true)
        let formData = {
          location: `${city}, ${state}, ${country}`,
          landSize: landSize
        }
        console.log(formData)
        // Logic to generate plan based on inputs
        try{
          const response = await api.post('/farm-plan', formData)
          console.log('Generated Plan:', response.data)
            setData(response.data)
        } catch(error){
          console.error('Error generating plan:', error)
          console.error('Response data:', error.response?.data)
          alert(error.response?.data?.details || error.response?.data?.error || error.message)
        } finally {
          setLoading(false)
        }
      }
  return (
    <div className='w-full h-screen bg-gray-600 mt-20 mb-8 flex gap-6 justify-center px-6'>
        <LeftDashboard city={city} state={state} country={country} landSize={landSize} setCity={setCity} setState={setState} setCountry={setCountry} setLandSize={setLandSize} handleGeneratePlan={handleGeneratePlan} isValid={isValid} loading={loading}/>
        <MiddleDashBoard data={data} landSize={landSize}/>
        <RightDashBoard data={data}/>
    </div>
  )
}

export default DashBoard
