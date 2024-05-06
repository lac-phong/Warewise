import React, { useState } from "react";
import Axios from "axios";
import {Link, Navigate} from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const login = (e) => {
        e.preventDefault();
        Axios.post('http://localhost:8080/login', { username: username, password: password })
            .then((response) => {
                localStorage.setItem("id", JSON.stringify(response.data));
                setRedirect(true);
                console.log(response);
            });
    };

    if (redirect) {
        return <Navigate to="/account" />;
    }

    return (
        <div className="font mt-4 h-screen flex justify-center items-center">
            <div>
                <h1 className="text-5xl text-center mb-8">Login to <span className="text-blue-300">Warewise</span></h1>
                <form className="max-w-md mx-auto" onSubmit={login}>
                    <input
                        type="text"
                        placeholder="UserName"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 mb-4 rounded-full border border-gray-300 focus:outline-none focus:border-pink"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 mb-4 rounded-full border border-gray-300 focus:outline-none focus:border-pink"
                    />
                    <button className="bg-blue-300 rounded-full w-full m-2 p-2 text-white">
                        Login
                    </button>
                    <div className="text-center py-2 text-gray-600">
                        Don't have an account? 
                        <Link to="/register" className='underline text-blue-300'>Sign up here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;