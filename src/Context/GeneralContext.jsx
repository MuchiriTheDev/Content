import React, { createContext, useState } from 'react';

// Create the context
export const GeneralContext = createContext();

// Create the provider component
export const GeneralProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        theme: 'light',
        isAuthenticated: false,
    });
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null));
    const [token, setToken] = useState(null || localStorage.getItem('token'));

    const toggleTheme = () => {
        setState((prevState) => ({
            ...prevState,
            theme: prevState.theme === 'light' ? 'dark' : 'light',
        }));
    };

    const login = (user) => {
        setState((prevState) => ({
            ...prevState,
            user,
            isAuthenticated: true,
        }));
    };

    const logout = () => {
        setState((prevState) => ({
            ...prevState,
            user: null,
            isAuthenticated: false,
        }));
    };

    return (
        <GeneralContext.Provider value={{ 
            state, toggleTheme, login, logout,
            loading, setLoading, token, user
            }}>
            {children}
        </GeneralContext.Provider>
    );
};