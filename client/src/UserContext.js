import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [businessId, setBusinessId] = useState(null);

    useEffect(() => {
        if (!user) {
            axios.get('http://localhost:8080/business', {withCredentials: true}).then(({data}) => {
                setUser(data);
                setBusinessId(data.BUSINESS_ID);
            });
        }
    },[]);
    return (
        <UserContext.Provider value={{ user, setUser, ready, businessId}}>
            {children}
        </UserContext.Provider>
    );  
}