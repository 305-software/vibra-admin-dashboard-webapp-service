import axios from 'axios';
import config from '../../../config';

const API_BASE_URL = config.apiUrl;

/**
 * Create a Stripe SetupIntent for collecting payment method details
 * @param {string} customerId - The customer ID for the setup intent
 * @returns {Promise<Object>} SetupIntent response with clientSecret
 */
export const setupIntent = async (customerId) => {
  try {
    const response = await axios.post(
      config.stripe_setup_intent,
      { businessId: customerId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to create setup intent'
    );
  }
};

/**
 * Create a Stripe PaymentIntent for processing a payment
 * @param {Object} paymentData - Payment intent details
 * @param {string} paymentData.businessId - The customer ID
 * @param {number} paymentData.amount - The amount to charge (in smallest currency unit, e.g., cents)
 * @param {string} paymentData.currency - The currency code (e.g., 'usd')
 * @param {string} [paymentData.paymentMethodId] - Optional payment method ID to attach
 * @param {string} [paymentData.description] - Optional description of the payment
 * @param {Object} [paymentData.metadata] - Optional metadata object
 * @returns {Promise<Object>} PaymentIntent response with clientSecret
 */
export const createPaymentIntent = async (paymentData) => {
  try {
    const response = await axios.post(
      config.stripe_payment_intent,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to create payment intent'
    );
  }
};

/**
 * Add a new payment method for a customer
 * @param {Object} paymentData - Payment method details
 * @param {string} paymentData.customerId - The customer ID
 * @param {string} paymentData.paymentMethodId - Stripe payment method ID
 * @param {boolean} paymentData.isDefault - Whether to set as default payment method
 * @returns {Promise<Object>} Response with added payment method details
 */
export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await axios.post(
      config.stripe_add_payment_method,
      paymentData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to add payment method'
    );
  }
};

/**
 * List all payment methods for a customer
 * @param {string} customerId - The customer ID
 * @param {number} [limit=2] - The maximum number of payment methods to retrieve
 * @returns {Promise<Array>} Array of payment methods
 */
export const listPaymentMethods = async (customerId, limit = 2) => {
  try {
    const response = await axios.get(
      `${config.stripe_list_payment_methods}/${customerId}?limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error listing payment methods:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to list payment methods'
    );
  }
};

/**
 * Delete a payment method for a customer
 * @param {string} paymentMethodId - The payment method ID to delete
 * @returns {Promise<Object>} Response confirming deletion
 */
export const deletePaymentMethod = async (paymentMethodId, businessId) => {
  try {
    const response = await axios.delete(
      `${config.stripe_delete_payment_method}`,
      {
        data: {
          businessId: businessId,
          paymentMethodId: paymentMethodId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to delete payment method'
    );
  }
};

