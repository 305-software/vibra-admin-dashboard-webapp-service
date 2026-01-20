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

import React, { createContext, useEffect, useState, useCallback } from 'react';
import Cookies from "universal-cookie";

import * as constant from "../../utlis/constant";
import { getDashboardUserById } from "../server/userContext";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const cookies = new Cookies();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = cookies.get(constant.USER); 
            
            if (userId) {
                try {
                    const userData = await getDashboardUserById(userId);
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

    // Check if user is admin
    const isAdmin = useCallback(() => {
        const cookies = new Cookies();
        const roles = cookies.get(constant.ROLES);

        // Primary check: use roles from cookies (available immediately)
        if (roles && Array.isArray(roles) && roles.length > 0) {
            return roles[0]?.roleName === 'Admin' || roles[0]?.roleName === 'SuperAdmin';
        }

        // Secondary check: try user context data (loaded asynchronously)
        if (user) {
            let rolePermission = null;
            
            // Try different possible paths to rolePermission
            if (user?.user?.rolePermission || user?.data?.user?.rolePermission) {
                rolePermission = user.user.rolePermission || user.data.user.rolePermission;
            } else if (user?.data?.user?.rolePermission) {
                rolePermission = user.data.user.rolePermission;
            }
            
            if (rolePermission) {
                // Support both array and object formats
                if (Array.isArray(rolePermission)) {
                    return rolePermission.some(role => role.roleName === 'SuperAdmin' || role.roleName === 'Admin');
                }
                return rolePermission.roleName === 'SuperAdmin' || rolePermission.roleName === 'Admin';
            }
        }
        
        return false;
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, isAdmin }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;