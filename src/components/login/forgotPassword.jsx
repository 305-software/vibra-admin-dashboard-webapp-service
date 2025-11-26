/**
 * ForgotPassword Component
 *
 * This component provides a form for users to request a password reset. Users can enter their email address,
 * and upon submission, an OTP will be sent to that email. This component utilizes context for user state management
 * and cookies for storing the email temporarily.
 *
 * @component
 * @example
 * return (
 *   <ForgotPassword />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useContext: Hook for accessing context values.
 * - useState: Hook for managing component state.
 * - Col, Container, Row: Bootstrap components for layout.
 * - Form: Bootstrap form component.
 * - useNavigate: Hook for programmatic navigation.
 * - toast, ToastContainer: Components from react-toastify for displaying notifications.
 * - Cookies: Library for managing cookies.
 * - logo: Logo image asset for branding.
 * - Button: A custom button component.
 * - UserContext: Context for managing user state.
 * - CustomInput: A custom input component for form fields.
 * - forgotPassword: Function for handling password reset requests.
 *
 * @returns {JSX.Element} The rendered ForgotPassword component containing the email input form.
 *
 * @logic
 * - Initializes state to manage form values using `useState`.
 * - Uses `useContext` to access the user context for setting user information.
 * - Handles form submission with `handleSubmit`, validating the email input and sending a password reset request.
 * - Displays success or error notifications using `toast`.
 * - Stores the email in cookies for later use.
 * - Navigates to the OTP verification page after a successful request.
 *
 * @events
 * - handleChange: Updates the form state as the user types in the email field.
 * - handleSubmit: Validates the email and sends a password reset request when the form is submitted.
 */

import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";

import logo from "../../assets/logo.png";
import Button from '../../components/button/button'
import * as constant from "../../utlis/constant";
import { UserContext } from "../context/userContext";
import CustomInput from '../customInput/customInput';
import { forgotPassword } from "../server/login";

/**
 * Validates email format with enhanced security
 * @param {string} email - Email to validate
 * @returns {object} - Validation result with isValid boolean and message string
 */
const validateEmail = (email) => {
  // Enhanced email validation regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!email || email.trim() === '') {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: 'Email address is too long' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  // Check for common suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    return { isValid: false, message: 'Invalid email format' };
  }
  
  return { isValid: true, message: 'Valid email' };
};

function ForgotPassword() {
    const [formValues, setFormValues] = useState({ email: '' });
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rateLimitCounter, setRateLimitCounter] = useState(0);
    const [lastSubmitTime, setLastSubmitTime] = useState(0);

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const cookies = new Cookies(null, { path: "/" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Rate limiting: Allow only 3 attempts per 5 minutes
        const currentTime = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (currentTime - lastSubmitTime < 30000 && rateLimitCounter >= 3) { // 30 seconds between attempts after 3 tries
            toast.error(t("TOO_MANY_ATTEMPTS_PLEASE_WAIT"));
            return;
        }

        // Validate email input
        const emailValidation = validateEmail(formValues.email);
        if (!emailValidation.isValid) {
            toast.error(emailValidation.message);
            setEmailError(emailValidation.message);
            return;
        }

        setLoading(true);
        setEmailError('');

        const details = {
            email: formValues.email.trim().toLowerCase(),
        };

        try {
            const response = await forgotPassword(details);
            setUser(response?.data);

            // Store email in secure cookie with shorter expiration
            const thirtyMinutes = 30 * 60 * 1000;
            const expireDate = new Date(Date.now() + thirtyMinutes);
            
            cookies.set(constant.EMAIL_SMALL, details.email, {
                path: "/",
                expires: expireDate,
                secure: true,
                sameSite: "Strict",
                httpOnly: false // Note: httpOnly can't be set from client-side JavaScript
            });

            toast.success(t("OTP_SEND_TO_MAIL"));

            // Reset rate limiting on successful request
            setRateLimitCounter(0);
            setLastSubmitTime(0);

            // Redirect to OTP page after a short delay
            setTimeout(() => {
                navigate("/otp");
            }, 2000);

        } catch (error) {
            // Increment rate limit counter
            setRateLimitCounter(prev => prev + 1);
            setLastSubmitTime(currentTime);
            
            const errorMessage = error.response?.data?.message || t("FORGOT_PASSWORD_FAILED");
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Sanitize input to prevent XSS
        const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        
        setFormValues({ ...formValues, [name]: sanitizedValue });
        
        // Clear email error when user starts typing
        if (emailError) {
            setEmailError('');
        }
    };

    return (
        <div className="login-background">
            <Container className="login-container">
                <Row className="justify-content-center">
                    <Col md={8} lg={6} className="login-box">
                        <div className="d-flex justify-content-center event-logo mb-4">
                            <img src={logo} alt="logo" width="40" height="40" />
                            <h2 className="logo-login">{t("DREAM_EVENT")}</h2>
                        </div>
                        <h4 className="text-center login-account">{t("FORGOT_PASSWORD")}</h4>
                        <p className="text-center details-welcome mt-2">{t("FORGOT_PASSWORD_CONTENT")}</p>
                        <Form style={{ marginTop: '30px' }} onSubmit={handleSubmit}>
                            <Form.Group className="mb-5" controlId="formEmail">
                                <CustomInput
                                    type="email"
                                    label={t("EMAIL")}
                                    style={{ color: "rgba(240,242,245,1" }}
                                    value={formValues.email}
                                    onChange={handleChange}
                                    name="email"
                                    maxLength={254}
                                    required
                                />
                                {emailError && (
                                    <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
                                        {emailError}
                                    </div>
                                )}
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button 
                                    type="submit" 
                                    className="sign-in-btn" 
                                    name={loading ? t("SUBMITTING") + "..." : t("SUBMIT")}
                                    disabled={loading}
                                />
                            </div>

                            {rateLimitCounter > 0 && (
                                <div style={{ 
                                    color: 'orange', 
                                    fontSize: '12px', 
                                    marginTop: '10px', 
                                    textAlign: 'center' 
                                }}>
                                    {t("ATTEMPTS_REMAINING")}: {3 - rateLimitCounter}
                                </div>
                            )}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ForgotPassword;