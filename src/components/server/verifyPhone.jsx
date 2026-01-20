/**
 * API Functions for Phone Verification
 *
 * These functions interact with the backend API to verify phone numbers.
 * The function sends a POST request with the provided parameters and returns 
 * the response data.
 *
 * @module api/phone
 *
 * @imports
 * - axios: A promise-based HTTP client for making requests.
 * - config: Configuration object containing API endpoint URLs.
 */

import axios from "axios";
import config from "../../config";

/**
 * Sends a request to send an OTP code to the user's phone number.
 *
 * @async
 * @function sendPhoneOtp
 * @param {string} phoneNumber - The phone number to send OTP to.
 * @param {string} userId - The user ID associated with the phone number.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await sendPhoneOtp('+1234567890', 'user123');
 */
export async function sendPhoneOtp(phoneNumber, userId) {
    const response = await axios.post(`${config.sendPhoneOtp}` + `/${userId}`, {
        phoneNumber
    });
    return response.data;
}

/**
 * Sends a request to send an email verification link to the user's email address.
 *
 * @async
 * @function sendEmailLink
 * @param {string} email - The email address to send the verification link to.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await sendEmailLink('user@example.com');
 */
export async function sendEmailLink(email) {
    const response = await axios.post(`${config.sendEmailLink}`, {
        email
    });
    return response.data;
}

/**
 * Sends a request to verify the user's phone number.
 *
 * @async
 * @function verifyPhone
 * @param {string} code - The verification code sent to the phone number.
 * @param {string} phoneNumber - The phone number to verify.
 * @param {string} userId - The user ID associated with the phone number.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await verifyPhone('123456', '+1234567890', 'user123');
 */
export async function verifyPhone(code, phoneNumber, userId) {
    const response = await axios.post(`${config.verifyPhone}` + `/${userId}`, {
        code,
        phoneNumber
    });
    return response.data;
}

/**
 * Sends a request to verify the user's email address.
 *
 * @async
 * @function verifyEmail
 * @param {string} code - The verification code sent to the email.
 * @param {string} email - The email address to verify.
 * @param {string} userId - The user ID associated with the email.
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await verifyEmail('123456', 'user@example.com', 'user123');
 */
export async function verifyEmail(code, email, userId) {
    const response = await axios.post(`${config.verifyEmail}` + `/${userId}`, {
        code,
        email
    });
    return response.data;
}
