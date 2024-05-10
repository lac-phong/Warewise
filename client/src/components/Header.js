import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div>
      <header className='flex justify-between items-center bg-blue-300 -mx-4 -mt-4 p-4'>
        <Link to={'/account'}>
          <span className='logo text-4xl text-white'>Warewise</span>
        </Link>
        <div className='text-xl'>
            <Link to={'/addsupplier'} className='rounded-full mx-8 text-white'>Add Supplier</Link>
            <Link to={'/inventory'} className='rounded-full mx-8 text-white'>Inventory</Link>
            <Link to={'/order'} className='rounded-full mx-8 text-white'>Order</Link>
            <Link to={'/employee'} className='rounded-full mx-8 text-white'>Employees</Link>
            <Link to={'/transaction'} className='rounded-full mx-8 text-white'>Transaction</Link>

        </div>
        <Link to={'/account'}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        </Link>
    
      </header>
   </div>
  )
}

export default Header