import { getBusinessVerificationStatus } from "./components/server/businessVerification";
import { verifyPhone } from "./components/server/verifyPhone";


const base = {
  headers: {
    "Content-Type": "application/json",
      
  },
};

function jsonConcat(o1, o2) {
  return { ...o1, ...o2 };
}

const server = {
  //baseURL: "https://dreamevent-be-a7crgwdzeufuase9.canadacentral-01.azurewebsites.net/",
   baseURL:"http://localhost:3800"
};




// const localUrl = {
//   baseURL: "http://localhost:3800",

// };

const config = jsonConcat(base, server)
const combine = {
  createEvent: config.baseURL + "/upcoming-events",
  eventCategory: config.baseURL + "/category",
  eventList: config.baseURL + "/events",
  eventById: config.baseURL + "/events",
  bookingList: config.baseURL + "/booking-list",
  customerList: config.baseURL + "/customer-list",
  transactionList: config.baseURL + "/transaction-list",
  recentEvents: config.baseURL + "/recent-events",
  categoryRevenue: config.baseURL + "/category-revenue",
  totalEventDashboard: config.baseURL + "/total-events",
  salesRevenue: config.baseURL + "/sales-revenue",
  upcomingList: config.baseURL + "/upcoming-list",
  dashboardlogin: config.baseURL + "/dashboard-login",
  dashboardSignup: config.baseURL + "/dashboard-signup",
  dashboardGmailAuth: config.baseURL + "/dashboard-gmail-auth",
  refreshTokenUrl: config.baseURL + "/refresh-token",
  rolePermission: config.baseURL + "/role-permission",
  roleList: config.baseURL + "/role",
  roleCreate: config.baseURL + "/role",
  features: config.baseURL + "/feature",
  userList: config.baseURL + "/user-list",
  permission: config.baseURL + "/permission",
  createUser: config.baseURL + "/create-user",
  eventStatus: config.baseURL + "/event-status",
  location: config.baseURL + "/location",
  forgotPassword: config.baseURL + "/forgot-password",
  verifyOtp: config.baseURL + "/verify-otp",
  resetPassword: config.baseURL + "/reset-password",
  eventListById: config.baseURL + "/event-list",
  notifications:config.baseURL + "/notifications",
  validateToken:config.baseURL + "/validate-token",
  logout:config.baseURL + "/logout",
  stats: config.baseURL + "/stats",
  trendingEvents: config.baseURL + "/trending-events",
  latestSales: config.baseURL + "/latest-sales",
  verifyIp: config.baseURL + "/verify-otp-new-ip",
  resendIpCode: config.baseURL + "/resend-ip-code",
  imageUrl: config.baseURL,
  businessVerification: config.baseURL + "/verify-business",
  getDashboardUserById: config.baseURL + "/get-dashboard-user-by-id",
  getBusinessVerificationStatus: config.baseURL + "/verify-business",
  verifyPhone: config.baseURL + "/verify-phone-number",
  sendPhoneOtp: config.baseURL + "/send-verification-code-phone-number",
  sendEmailLink: config.baseURL + "/get-verify-email-link",
  stripe_setup_intent: config.baseURL + "/stripe/setup-intent",
  stripe_add_payment_method: config.baseURL + "/stripe/payment-method",
  stripe_list_payment_methods: config.baseURL + "/stripe/payment-methods-list",
  stripe_delete_payment_method: config.baseURL + "/stripe/payment-method",
};

export default jsonConcat(config, combine);


