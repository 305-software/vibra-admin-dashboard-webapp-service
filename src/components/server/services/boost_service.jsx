import axios from 'axios';
import config from '../../../config';

const API_BASE_URL = config.apiUrl;

/**
 * Fetch all available boost plans
 * @returns {Promise<Object>} Response with boost plans array
 */
export const fetchBoostPlans = async () => {
  try {
    const response = await axios.get(
      config.boost_plans,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching boost plans:', error);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch boost plans'
    );
  }
};
