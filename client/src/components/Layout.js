import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation instead of useNavigate
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/' && location.pathname !== '/register';
    return (
      <div className='p-4 flex flex-col min-h-screen'>
        {showHeader && <Header />}
        <div className='mt-4'>
            <Outlet/>
        </div>
        
      </div>
    );
  };

export default Layout