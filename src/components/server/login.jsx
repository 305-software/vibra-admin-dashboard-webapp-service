/**
 * API Functions for User Authentication and Password Management
 *
 * These functions interact with the backend API to perform user login, 
 * password reset, and OTP verification. Each function sends a POST request 
 * with the provided form values and returns the response data.
 *
 * @module api/auth
 *
 * @imports
 * - axios: A promise-based HTTP client for making requests.
 * - config: Configuration object containing API endpoint URLs.
 */

/**
 * Sends a login request to the server.
 *
 * @async
 * @function loginResponse
 * @param {object} formValues - The login credentials (username, password).
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await loginResponse({ username, password });
 */

/**
 * Sends a request to initiate the password recovery process.
 *
 * @async
 * @function forgotPassword
 * @param {object} formValues - The email or username for password recovery.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await forgotPassword({ email });
 */

/**
 * Sends a request to verify the OTP received by the user.
 *
 * @async
 * @function verifyOtp
 * @param {object} formValues - The OTP and associated user identifier.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await verifyOtp({ otp, userId });
 */

/**
 * Sends a request to reset the user's password.
 *
 * @async
 * @function resetPassword
 * @param {object} formValues - The new password and associated user identifier.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await resetPassword({ newPassword, userId });
 */


import axios from "axios";

import config from "../../config";

/**
 * Generates a unique device fingerprint based on browser and device characteristics
 * @function generateDeviceFingerprint
 * @returns {string} A unique device fingerprint hash
 */
function generateDeviceFingerprint() {
    const fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
        maxTouchPoints: navigator.maxTouchPoints || 0,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.userAgentData?.platform || navigator.platform || 'unknown',
        plugins: (() => {
            try {
                return navigator.plugins ? Array.from(navigator.plugins).map(plugin => plugin.name).join(',') : 'unknown';
            } catch (e) {
                return 'unknown';
            }
        })()
    };

    // Create a hash from the fingerprint object
    const fingerprintString = JSON.stringify(fingerprint);
    let hash = 0;
    
    for (let i = 0; i < fingerprintString.length; i++) {
        const char = fingerprintString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash).toString(16).padStart(16, '0');
}

export async function loginResponse(formValues) {
    let deviceIP = await getDeviceIp();    

    const response = await axios.post(`${config.dashboardlogin}`, formValues, {
        headers: {
            'x-forwarded-for': deviceIP,
            'x-device-fingerprint': generateDeviceFingerprint(),
        }
    });
    return response.data;
}

export async function handleGmailAuth(formValues) {
    let deviceIP = await getDeviceIp();    

    const response = await axios.post(`${config.dashboardGmailAuth}`, formValues, {
        headers: {
            'x-forwarded-for': deviceIP,
            'x-device-fingerprint': generateDeviceFingerprint(),
        }
    });
    return response.data;
}

async function getDeviceIp() {
    try {
        const response_ip = await fetch('https://api.ipify.org?format=json');
        const data = await response_ip.json();
        return data.ip;
    } catch (error) {
        console.error('Failed to fetch device IP:', error);
    }
}

export async function forgotPassword(formValues) {
    const response = await axios.post(`${config.forgotPassword}`, formValues);
    return response.data;
}

export async function verifyOtp(formValues) {
    const response = await axios.post(`${config.verifyOtp}`, formValues);
    return response.data;
}

export async function resetPassword(formValues) {
    const response = await axios.post(`${config.resetPassword}`, formValues);
    return response.data;
}

/**
 * Sends a request to verify the user's IP address.
 *
 * @async
 * @function verifyIp
 * @param {object} formValues - The verification code sent to the user.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await verifyIp({ code });
 */
export async function verifyIp(formValues) {

    const response = await axios.post(`${config.verifyIp}`, {
      otp: formValues.otp,
      email: formValues.email || ''
    }, {
        headers: {
            'x-forwarded-for': formValues.ip,
            'x-device-fingerprint': formValues.deviceFingerprint
        }
    });
    return response.data;
}

/**
 * Sends a request to resend the IP verification code.
 *
 * @async
 * @function resendIpCode
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await resendIpCode();
 */
export async function resendIpCode() {
    const response = await axios.post(`${config.resendIpCode}`);
    return response.data;
}
