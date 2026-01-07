/**
 * Business Verification Container
 * 
 * This container manages the business verification flow after login/signup.
 * It handles form submission and navigation based on the result.
 */
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";

import config from '../config';
import { AuthContext } from '../components/context/authProvider';
import { findFirstAccessibleRoute } from '../layout/sidebarData';
import * as constant from "../utlis/constant";
import { UserContext } from "../components/context/userContext";
import BusinessVerification from '../components/businessVerification/businessVerification';
import { submitBusinessVerification } from '../components/server/businessVerification';

/**
 * Business Verification Container Component
 * Manages the complete business verification flow
 */
const BusinessVerificationContainer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const { setUser } = useContext(UserContext);
    const [pendingUserData, setPendingUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const cookiesRef = React.useRef(new Cookies(null, { path: "/" }));

    useEffect(() => {
        // Fetch pending user data from cookies every time the component is accessed
        const userData = cookiesRef.current.get('pending_user_data');
        
        if (userData) {
            try {
                // Handle both cases: already parsed object or JSON string
                const parsedData = typeof userData === 'string' ? JSON.parse(userData) : userData;
                setPendingUserData(parsedData);
            } catch (error) {
                console.error('Error parsing pending user data:', error);
                toast.error('Session expired. Please login again.');
                navigate('/login');
            }
        } else {
            // No pending user data, redirect to login
            navigate('/login');
        }
    }, [navigate, location]);

    const handleBusinessVerificationSubmit = async (formValues) => {
        if (!pendingUserData) {
            toast.error('Session expired. Please login again.');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            const verificationData = {
                userId: pendingUserData.data.user._id,
                businessName: formValues.businessName,
                businessDescription: formValues.businessDescription,
                businessId: formValues.businessId,
                roleId: formValues.roleId,
                phoneNumber: formValues.phoneNumber,
                address: formValues.address,
                socialMediaLinks: formValues.socialMediaLinks,
            };

            const response = await submitBusinessVerification(verificationData);

            if (response && response.data) {
                // Update user context with verification complete
                setUser(pendingUserData);

                // Clear pending user data cookie
                cookiesRef.current.remove('pending_user_data', { path: "/" });

                // Redirect to dashboard or first accessible route
                const firstAccessibleRoute = findFirstAccessibleRoute(
                    pendingUserData.data.user.rolePermission
                );

                toast.success(response.message || 'Business verification submitted successfully!');
                navigate(firstAccessibleRoute);
            } else {
                toast.error('Failed to submit business verification');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to submit business verification';
            toast.error(errorMessage);
            console.error('Business verification error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // Call logout API endpoint
            await axios.get(config.logout, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout API error:', error);
            // Continue with logout even if API fails
        }

        // Use the AuthContext logout function
        logout();
    };

    if (!pendingUserData) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f3f4f6'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '24px',
                        color: '#6b7280',
                        marginBottom: '16px'
                    }}>Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6'
        }}>
            <BusinessVerification 
                onSubmit={handleBusinessVerificationSubmit}
                onLogout={handleLogout}
            />
        </div>
    );
};

export default BusinessVerificationContainer;
