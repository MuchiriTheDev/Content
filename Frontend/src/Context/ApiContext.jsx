import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

// Create the context
export const ApiContext = createContext();

// Create the provider component
export const ApiProvider = ({ children }) => {
    const [data, setData] = useState(null);

    const signUp = async (email, password) => {
        try {
            const response = await axios.post('https://api.example.com/signup', {
                email,
                password,
            });
            const result = await response.data; // axios automatically parses JSON
            setData(result);
        } catch (error) {
            console.error('Error signing up:', error);
        }
    };

    return (
        <ApiContext.Provider value={{ data, setData }}>
            {children}
        </ApiContext.Provider>
    );
};