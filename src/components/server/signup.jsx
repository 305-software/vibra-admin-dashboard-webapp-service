import axios from "axios";

import config from "../../config";




export async function createAccount(formValues) {
    const response = await axios.post(`${config.dashboardSignup}`, formValues);
    return response.data;
}