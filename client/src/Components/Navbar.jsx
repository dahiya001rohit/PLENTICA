import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLogged, logout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-6 py-3 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>P</span>
          </div>
          <span className='font-bold text-xl text-gray-900 tracking-tight'>PLENTICA</span>
        </Link>

        {/* Navigation Links */}
        <div className='hidden md:flex items-center gap-8'>
          <Link to='/' className='text-sm font-medium text-gray-600 hover:text-gray-900 transition duration-200'>Home</Link>
          <Link to='/about' className='text-sm font-medium text-gray-600 hover:text-gray-900 transition duration-200'>About</Link>
        </div>

        {/* CTA Buttons */}
        <div className='hidden md:flex items-center gap-3'>
          <Link
            to={isLogged ? '/dashboard' : '/login'}
            className='bg-[#2E7D32] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm shadow-green-500/20 hover:bg-green-700 hover:shadow-green-500/30 transition-all duration-300'
          >
            Start Planning
          </Link>
          {isLogged && (
            <button
              onClick={() => { logout(); window.location.href = '/'; }}
              className='text-sm font-medium text-gray-600 hover:text-red-600 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-red-200 transition-all duration-200'
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className='md:hidden text-gray-700 focus:outline-none'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-6 h-6'
          >
            {mobileOpen ? (
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            ) : (
              <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16m-7 6h7' />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className='md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3'>
          <Link to='/' onClick={() => setMobileOpen(false)} className='block text-sm font-medium text-gray-600 hover:text-gray-900'>Home</Link>
          <Link to='/about' onClick={() => setMobileOpen(false)} className='block text-sm font-medium text-gray-600 hover:text-gray-900'>About</Link>
          <Link
            to={isLogged ? '/dashboard' : '/login'}
            onClick={() => setMobileOpen(false)}
            className='block text-center bg-[#2E7D32] text-white px-5 py-2.5 rounded-lg text-sm font-semibold mt-2'
          >
            Start Planning
          </Link>
          {isLogged && (
            <button
              onClick={() => { setMobileOpen(false); logout(); window.location.href = '/'; }}
              className='block w-full text-center text-sm font-medium text-red-600 border border-red-200 px-5 py-2.5 rounded-lg mt-2'
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
