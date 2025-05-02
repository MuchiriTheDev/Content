import React, { createContext, useState } from 'react';

// Create the context
export const GeneralContext = createContext();

// Create the provider component
export const GeneralProvider = ({ children }) => {
    const [claimId, setClaimId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null));
    const [token, setToken] = useState(null || localStorage.getItem('token'));
    const [profile, setProfile] = useState(null);
   
    return (
        <GeneralContext.Provider value={{ 
            loading, setLoading, 
            token, user, setToken, setUser, 
            setProfile, profile, claimId, setClaimId
            }}>
            {children}
        </GeneralContext.Provider>
    );
};