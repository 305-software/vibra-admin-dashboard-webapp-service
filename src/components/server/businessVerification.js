/**
 * API Functions for Business Verification
 *
 * These functions interact with the backend API to submit business verification details.
 *
 * @module api/businessVerification
 *
 * @imports
 * - axios: A promise-based HTTP client for making requests.
 * - config: Configuration object containing API endpoint URLs.
 */

import axios from "axios";
import config from "../../config";

/**
 * Submits business verification details to the server.
 *
 * @async
 * @function submitBusinessVerification
 * @param {object} formValues - The business verification data
 * @param {string} formValues.businessName - The business name
 * @param {string} formValues.businessDescription - Description of the business
 * @param {string} formValues.businessId - The business ID/Tax ID (optional)
 * @param {string} formValues.phoneNumber - Contact phone number (digits only)
 * @param {string} formValues.address1 - Street address
 * @param {string} formValues.address2 - Apartment/Suite (optional)
 * @param {string} formValues.city - City
 * @param {string} formValues.state - State
 * @param {string} formValues.zipCode - ZIP code
 * @param {string} formValues.socialMediaLinks - Social media links (newline-separated)
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await submitBusinessVerification({
 *   businessName: 'My Business',
 *   businessDescription: 'A great business',
 *   businessId: '12-3456789',
 *   phoneNumber: '7864704126',
 *   address1: '123 Main St',
 *   address2: 'Suite 100',
 *   city: 'Miami',
 *   state: 'Florida',
 *   zipCode: '33101',
 *   socialMediaLinks: 'https://facebook.com/mybusiness\nhttps://instagram.com/mybusiness'
 * });
 */
export async function submitBusinessVerification(formValues) {
    const response = await axios.post(
        `${config.businessVerification}`,
        formValues
    );
    return response.data;
}

/**
 * Retrieves the business verification status for a user.
 *
 * @async
 * @function getBusinessVerificationStatus
 * @param {string} userId - The user ID
 * @returns {Promise<object>} The verification status data.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const status = await getBusinessVerificationStatus('userId123');
 */
export async function getBusinessVerificationStatus(userId) {
    const response = await axios.get(
        `${config.businessVerification || config.apiBaseURL}/verify-business/${userId}`
    );
    return response.data;
}

/**
 * Updates existing business verification details.
 *
 * @async
 * @function updateBusinessVerification
 * @param {string} userId - The user ID
 * @param {object} formValues - The updated business verification data
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await updateBusinessVerification('userId123', updatedData);
 */
export async function updateBusinessVerification(userId, formValues) {
    const response = await axios.put(
        `${config.businessVerification || config.apiBaseURL}/verify-business/${userId}`,
        formValues
    );
    return response.data;
}
