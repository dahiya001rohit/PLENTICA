import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
    
    return (
        <div className='navbar w-full bg-[#2E7D32] flex items-center justify-between px-4 py-2 text-black fixed top-0 left-0 z-50'>
            <h1 className='font-bold'>PLENTICA</h1>
            <div className='flex items-center justify-between'>
                <Link to='/' className='mx-2'>Home</Link>
                <Link to='/about' className='mx-2'>About</Link>
            </div>
            <Link to='/' className='bg-black text-white px-4 py-2 rounded-md'>Start Planing</Link>
        </div>
  )
}

export default Navbar
