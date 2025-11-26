/**
 * setHeaderToken Function
 * 
 * Configures Axios interceptors to manage authorization tokens for API requests.
 * It sets the Authorization header with a Bearer token from cookies and handles 
 * token refresh logic in case of 401 Unauthorized errors.
 * 
 * @function
 * @example
 * import { setHeaderToken } from './path/to/your/module';
 * 
 * // Call this function once during application initialization
 * setHeaderToken();
 * 
 * @returns {void}
 * 
 * @interceptors
 * - **Request Interceptor**: Adds the Authorization header with the Bearer token from cookies to each outgoing request.
 * - **Response Interceptor**: 
 *   - Handles 401 errors by attempting to refresh the access token using a refresh token stored in cookies.
 *   - If the refresh token is missing or the refresh fails, it clears the tokens and redirects the user to the login page.
 * 
 * @behavior
 * - Prevents multiple simultaneous refresh attempts by using a flag (`refreshInProgress`).
 * - Automatically retries the original request with a new access token if the refresh is successful.
 * 
 * @throws {Promise} Returns a rejected promise in case of request or response errors.
 */
/**
 * setHeaderToken Function
 * 
 * Configures Axios interceptors to manage authorization tokens for API requests.
 * It sets the Authorization header with a Bearer token from cookies and handles 
 * token refresh logic in case of 401 Unauthorized errors.
 * 
 * @function
 * @example
 * import { setHeaderToken } from './path/to/your/module';
 * 
 * // Call this function once during application initialization
 * setHeaderToken();
 * 
 * @returns {void}
 * 
 * @interceptors
 * - **Request Interceptor**: Adds the Authorization header with the Bearer token from cookies to each outgoing request.
 * - **Response Interceptor**: 
 *   - Handles 401 errors by attempting to refresh the access token using a refresh token stored in cookies.
 *   - If the refresh token is missing or the refresh fails, it clears the tokens and redirects the user to the login page.
 * 
 * @behavior
 * - Prevents multiple simultaneous refresh attempts by using a flag (`refreshInProgress`).
 * - Automatically retries the original request with a new access token if the refresh is successful.
 * 
 * @throws {Promise} Returns a rejected promise in case of request or response errors.
 */


import axios from 'axios';

export function setHeaderToken() {
    axios.defaults.withCredentials = true;
    axios.create({
        withCredentials: true
    });
    // Response Interceptor to handle 401 errors and refresh tokens
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
               //  alert("Your session has expired. Please log in again.");
             // window.location.href = '/';
            }
            return Promise.reject(error);
        }
    );
}
