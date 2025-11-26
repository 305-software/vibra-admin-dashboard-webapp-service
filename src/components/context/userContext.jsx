/**
 * UserProvider Component
 * 
 * This component provides user context to its children components. It fetches user data based on a cookie and updates the context accordingly.
 * 
 * @component
 * @param {React.ReactNode} children - The child components that will have access to the user context.
 * @example
 * return (
 *   <UserProvider>
 *     <YourComponent />
 *   </UserProvider>
 * )
 */

import React, { createContext, useEffect, useState } from 'react';
import Cookies from "universal-cookie";

import * as constant from "../../utlis/constant";
import { loginResponse } from "../server/login";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const cookies = new Cookies();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = cookies.get(constant.USER); 
            
            if (userId) {
                try {
                    const userData = await loginResponse(userId);
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        fetchUserData();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;