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
 * @param {string} formValues.userId - The user ID
 * @param {string} formValues.businessName - The business name
 * @param {string} formValues.businessDescription - Description of the business
 * @param {string} formValues.businessId - The business ID
 * @param {string} formValues.roleId - The role ID
 * @param {string} formValues.phoneNumber - Contact phone number
 * @param {string} formValues.address - Business address
 * @param {string} formValues.socialMediaLinks - Social media links (comma-separated or newline-separated)
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await submitBusinessVerification({
 *   userId: '123',
 *   businessName: 'My Business',
 *   businessDescription: 'A great business',
 *   businessId: 'BID123',
 *   roleId: 'RID123',
 *   phoneNumber: '+1234567890',
 *   address: '123 Main St',
 *   socialMediaLinks: 'https://facebook.com/mybusiness'
 * });
 */
export async function submitBusinessVerification(formValues) {
    const response = await axios.post(
        `${config.businessVerification || config.apiBaseURL}/verify-business`,
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
