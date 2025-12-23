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




export async function loginResponse(formValues) {
    let deviceIP = 'unknown';
    try {
        const response_ip = await fetch('https://api.ipify.org?format=json');
        const data = await response_ip.json();
        deviceIP = data.ip;
    } catch (error) {
        console.error('Failed to fetch device IP:', error);
    }

    const response = await axios.post(`${config.dashboardlogin}`, formValues, {
        headers: {
            'x-forwarded-for': deviceIP,
            'x-device-fingerprint': '1234567',
        }
    });
    return response.data;
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
    let deviceIP = 'unknown';
    try {
        const response_ip = await fetch('https://api.ipify.org?format=json');
        const data = await response_ip.json();
        deviceIP = data.ip;
    } catch (error) {
        console.error('Failed to fetch device IP:', error);
    }

    const response = await axios.post(`${config.verifyIp}`, formValues, {
        headers: {
            'x-forwarded-for': deviceIP,
            'x-device-fingerprint': '1234567',
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
