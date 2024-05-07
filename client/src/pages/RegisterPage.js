import React from 'react'
import { useState } from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'

function RegisterPage() {
    const [businessNameReg, setBusinessNameReg] = useState('')
    const [usernameReg, setUsernameReg] = useState('')
    const [passwordReg, setPasswordReg] = useState('')

    const register = () => {
        Axios.post('http://localhost:8080/register', {
          username: usernameReg, password: passwordReg, business_name: businessNameReg
        }).then((response) => {
          console.log(response);
        })
      }

  return (
    <div className="font mt-4 h-screen flex justify-center items-center">
      <div className="-mt-8">
        <h1 className="text-5xl text-center mb-8">Sign up for <span className="text-blue-300">Warewise</span></h1>
        <form className="max-w-md mx-auto" onSubmit={register}>
          <input 
          type="text"
            placeholder={'Name'}
            value={businessNameReg}
            onChange={(e) => setBusinessNameReg(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-full border border-gray-300"
          />
          <input 
          type="text"
            placeholder={'Username'}
            value={usernameReg}
            onChange={(e) => setUsernameReg(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-full border border-gray-300"
          />
          <input 
          type="password"
            placeholder={'password'}
            value={passwordReg}
            onChange={(e) => setPasswordReg(e.target.value)} 
            className="w-full px-4 py-2 mb-4 rounded-full border border-gray-300"
          />
          <button className='bg-blue-300 rounded-full w-full m-2 p-2 text-white'>Register</button>
          <div className="text-center py-2 text-gray-600">
            Already have an account? <Link className='underline text-pink' to={"/"}>Log in here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage;
