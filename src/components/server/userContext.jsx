/**
 * API Functions for User Management
 *
 * These functions interact with the backend API to submit and retrieve user details.
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
 * Sends a request to get the dashboard user by ID.
 *
 * @async
 * @function getDashboardUserById
 * @returns {Promise<object>} The response data from the server.
 * @throws {Error} Throws an error if the request fails.
 *
 * @example
 * const response = await getDashboardUserById(userId);
 */
export async function getDashboardUserById(userId) {
    const response = await axios.get(`${config.getDashboardUserById}/${userId}`);
    return response.data;
}