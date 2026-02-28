import React from 'react'
import Navbar from './Components/navbar'
import DashBoard from './Components/DashBoard'

const App = () => {
  return (
    <div className='w-full h-screen px-8 flex flex-col text-black bg-[#F0ECE3]'>
      <Navbar />
      <DashBoard />
    </div>
  )
}

export default App
