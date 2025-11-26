/**
 * Otp Component
 *
 * This component provides a form for users to enter the OTP sent to their email address for verification.
 * Upon successful verification, the user is redirected to the password reset page.
 *
 * @component
 * @example
 * return (
 *   <Otp />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useContext: Hook for accessing context values.
 * - useState, useEffect: Hooks for managing component state and lifecycle.
 * - Col, Container, Row: Bootstrap components for layout.
 * - Form: Bootstrap form component.
 * - OtpInput: Component for rendering OTP input fields.
 * - useNavigate: Hook for programmatic navigation.
 * - toast, ToastContainer: Components from react-toastify for displaying notifications.
 * - Cookies: Library for managing cookies.
 * - logo: Logo image asset for branding.
 * - Button: A custom button component.
 * - UserContext: Context for managing user state.
 * - verifyOtp: Function for handling OTP verification requests.
 *
 * @returns {JSX.Element} The rendered Otp component containing the OTP input form.
 *
 * @logic
 * - Initializes state to manage the OTP input using `useState`.
 * - Uses `useContext` to access the user context for setting user information.
 * - Retrieves the email from cookies to include in the OTP verification request.
 * - Implements security features like rate limiting, session validation, and brute force protection.
 * - Handles form submission with `handleSubmit`, validating the OTP input and sending a verification request.
 * - Displays success or error notifications using `toast`.
 * - Redirects the user to the password reset page upon successful verification after a short delay.
 *
 * @events
 * - handleSubmit: Validates the OTP input and sends a verification request when the form is submitted.
 * - handleResendOtp: Allows users to request a new OTP with rate limiting.
 */

import React, { useContext, useEffect, useRef,useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";

import logo from "../../assets/logo.png";
import Button from '../../components/button/button';
import * as constant from "../../utlis/constant";
import { UserContext } from "../context/userContext";
import { forgotPassword,verifyOtp } from "../server/login";

/**
 * Validates OTP format and security
 * @param {string} otp - OTP to validate
 * @returns {object} - Validation result
 */
const validateOtp = (otp) => {
  // Check if OTP contains only numbers
  const isNumeric = /^\d+$/.test(otp);
  
  // Check for obvious patterns
  const hasSequentialPattern = /012|123|234|345|456|567|678|789|987|876|765|654|543|432|321|210/.test(otp);
  const hasRepeatingPattern = /(\d)\1{2,}/.test(otp);
  const isAllSameDigit = /^(\d)\1*$/.test(otp);
  
  if (!otp || otp.trim() === '') {
    return { isValid: false, message: 'OTP is required' };
  }
  
  if (otp.length !== 5) {
    return { isValid: false, message: 'OTP must be exactly 5 digits' };
  }
  
  if (!isNumeric) {
    return { isValid: false, message: 'OTP must contain only numbers' };
  }
  
  if (hasSequentialPattern || hasRepeatingPattern || isAllSameDigit) {
    return { isValid: false, message: 'Invalid OTP format' };
  }
  
  return { isValid: true, message: 'Valid OTP' };
};

function Otp() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimeLeft, setBlockTimeLeft] = useState(0);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otpError, setOtpError] = useState('');
    const [sessionExpired, setSessionExpired] = useState(false);
    
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const cookies = new Cookies(null, { path: "/" });
    
    // Refs for cleanup
    const blockTimerRef = useRef(null);
    const resendTimerRef = useRef(null);
    
    // Security constants
    const MAX_ATTEMPTS = 3;
    const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
    const RESEND_COOLDOWN = 60 * 1000; // 60 seconds
    const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

    // Check session validity on mount
    useEffect(() => {
        const email = cookies.get(constant.EMAIL_SMALL);
        if (!email) {
            setSessionExpired(true);
            toast.error(t("SESSION_EXPIRED_PLEASE_START_AGAIN"));
            setTimeout(() => {
                navigate('/forgotPassword');
            }, 3000);
            return;
        }

        // Check if user is currently blocked
        const blockInfo = localStorage.getItem(`otp_block_${email}`);
        if (blockInfo) {
            const { blockUntil, attemptCount } = JSON.parse(blockInfo);
            const now = Date.now();
            
            if (now < blockUntil) {
                setIsBlocked(true);
                setAttempts(attemptCount);
                setBlockTimeLeft(Math.ceil((blockUntil - now) / 1000));
                startBlockTimer(blockUntil - now);
            } else {
                // Block period expired, clean up
                localStorage.removeItem(`otp_block_${email}`);
            }
        }

        // Set session timeout
        const sessionTimer = setTimeout(() => {
            setSessionExpired(true);
            toast.error(t("SESSION_EXPIRED_PLEASE_START_AGAIN"));
            navigate('/forgotPassword');
        }, SESSION_TIMEOUT);

        return () => {
            clearTimeout(sessionTimer);
            if (blockTimerRef.current) clearInterval(blockTimerRef.current);
            if (resendTimerRef.current) clearInterval(resendTimerRef.current);
        };
    }, [navigate, t, cookies]);

    const startBlockTimer = (duration) => {
        setBlockTimeLeft(Math.ceil(duration / 1000));
        blockTimerRef.current = setInterval(() => {
            setBlockTimeLeft(prev => {
                if (prev <= 1) {
                    setIsBlocked(false);
                    setAttempts(0);
                    const email = cookies.get(constant.EMAIL_SMALL);
                    if (email) {
                        localStorage.removeItem(`otp_block_${email}`);
                    }
                    clearInterval(blockTimerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const startResendTimer = () => {
        setResendCooldown(60);
        resendTimerRef.current = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(resendTimerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (sessionExpired) {
            toast.error(t("SESSION_EXPIRED_PLEASE_START_AGAIN"));
            navigate('/forgotPassword');
            return;
        }

        if (isBlocked) {
            toast.error(t("TOO_MANY_FAILED_ATTEMPTS_PLEASE_WAIT"));
            return;
        }

        // Validate OTP format
        const otpValidation = validateOtp(otp);
        if (!otpValidation.isValid) {
            toast.error(otpValidation.message);
            setOtpError(otpValidation.message);
            return;
        }

        setLoading(true);
        setOtpError('');

        const email = cookies.get(constant.EMAIL_SMALL);
        const details = {
            email: email,
            otp: otp.trim()
        };

        try {
            const response = await verifyOtp(details);
            setUser(response?.data);
            
            // Set email for password reset with shorter expiration
            const fifteenMinutes = 15 * 60 * 1000;
            const expireDate = new Date(Date.now() + fifteenMinutes);
            
            cookies.set(constant.EMAIL, details.email, {
                path: "/",
                expires: expireDate,
                secure: true,
                sameSite: "Strict"
            });

            // Clear any existing blocks on successful verification
            localStorage.removeItem(`otp_block_${email}`);
            
            toast.success(t("OTP_VERIFIED_SUCCESSFULLY"));

            // Redirect to password reset page
            setTimeout(() => {
                navigate("/resetPassword");
            }, 2000);

        } catch (error) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            // Store attempt info
            const blockUntil = Date.now() + BLOCK_DURATION;
            localStorage.setItem(`otp_block_${email}`, JSON.stringify({
                attemptCount: newAttempts,
                blockUntil: newAttempts >= MAX_ATTEMPTS ? blockUntil : 0
            }));

            if (newAttempts >= MAX_ATTEMPTS) {
                setIsBlocked(true);
                startBlockTimer(BLOCK_DURATION);
                toast.error(t("TOO_MANY_FAILED_ATTEMPTS_BLOCKED"));
            } else {
                const remainingAttempts = MAX_ATTEMPTS - newAttempts;
                toast.error(`${t("INVALID_OTP")}. ${remainingAttempts} ${t("ATTEMPTS_REMAINING")}.`);
            }

            const errorMessage = error.response?.data?.message || t("OTP_VERIFICATION_FAILED");
            setOtpError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) {
            toast.warning(`${t("PLEASE_WAIT")} ${resendCooldown} ${t("SECONDS_BEFORE_RESEND")}`);
            return;
        }

        if (isBlocked) {
            toast.error(t("CANNOT_RESEND_WHILE_BLOCKED"));
            return;
        }

        const email = cookies.get(constant.EMAIL_SMALL);
        if (!email) {
            toast.error(t("SESSION_EXPIRED_PLEASE_START_AGAIN"));
            navigate('/forgotPassword');
            return;
        }

        try {
            await forgotPassword({ email });
            toast.success(t("NEW_OTP_SENT_SUCCESSFULLY"));
            startResendTimer();
            setOtp(''); // Clear current OTP
            setOtpError('');
        } catch (error) {
            toast.error(t("FAILED_TO_RESEND_OTP"));
        }
    };

    const handleOtpChange = (value) => {
        // Only allow numeric input
        const numericValue = value.replace(/[^0-9]/g, '');
        setOtp(numericValue);
        
        // Clear error when user starts typing
        if (otpError) {
            setOtpError('');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (sessionExpired) {
        return (
            <div className="login-background">
                <Container className="login-container">
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} className="login-box">
                            <div className="text-center">
                                <h4 style={{ color: 'red' }}>{t("SESSION_EXPIRED")}</h4>
                                <p>{t("REDIRECTING_TO_FORGOT_PASSWORD")}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    return (
        <div className="login-background">
            <Container className="login-container">
                <Row className="justify-content-center">
                    <Col md={8} lg={6} className="login-box">
                        <div className="d-flex justify-content-center event-logo mb-4">
                            <img src={logo} alt="logo" width="40" height="40" />
                            <h2 className="logo-login">{t("DREAM_EVENT")}</h2>
                        </div>
                        <h4 className="text-center login-account">{t("OTP_VERIFICATION")}</h4>
                        <p className="text-center details-welcome mt-2">
                            {t("ENTER_THE_OTP_SEND_TO_THE_MAIL")}
                        </p>

                        {/* Security Status Messages */}
                        {isBlocked && (
                            <div style={{ 
                                backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                                border: '1px solid red', 
                                borderRadius: '4px', 
                                padding: '10px', 
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}>
                                <div style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>
                                    {t("ACCOUNT_TEMPORARILY_BLOCKED")}
                                </div>
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {t("TIME_REMAINING")}: {formatTime(blockTimeLeft)}
                                </div>
                            </div>
                        )}

                        {attempts > 0 && !isBlocked && (
                            <div style={{ 
                                backgroundColor: 'rgba(255, 165, 0, 0.1)', 
                                border: '1px solid orange', 
                                borderRadius: '4px', 
                                padding: '10px', 
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}>
                                <div style={{ color: 'orange', fontSize: '12px' }}>
                                    {t("FAILED_ATTEMPTS")}: {attempts}/{MAX_ATTEMPTS}
                                </div>
                            </div>
                        )}

                        <Form style={{ marginTop: '30px', textAlign: "center" }} onSubmit={handleSubmit}>
                            <div className='otp-login'>
                                <OtpInput
                                    value={otp}
                                    onChange={handleOtpChange}
                                    inputStyle={{
                                        width: "50px",
                                        height: "50px",
                                        fontSize: "24px",
                                        marginRight: '10px',
                                        border: `1px solid ${otpError ? 'red' : 'rgba(255,255,255,0.1)'}`,
                                        background: "transparent",
                                        borderRadius: "4px",
                                        color: 'white'
                                    }}
                                    numInputs={5}
                                    renderSeparator={<span> </span>}
                                    renderInput={(props) => (
                                        <input 
                                            {...props} 
                                            disabled={isBlocked || loading}
                                            maxLength={1}
                                            pattern="[0-9]"
                                            inputMode="numeric"
                                        />
                                    )}
                                />
                            </div>

                            {otpError && (
                                <div style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>
                                    {otpError}
                                </div>
                            )}

                            <div className="d-grid gap-2" style={{ marginTop: '20px' }}>
                                <Button 
                                    type="submit" 
                                    className="sign-in-btn" 
                                    name={loading ? t("VERIFYING") + "..." : t("VERIFY_OTP")}
                                    disabled={isBlocked || loading || otp.length !== 5}
                                />
                            </div>

                            {/* Resend OTP Section */}
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <p style={{ fontSize: '14px', color: 'rgba(157, 157, 157, 1)' }}>
                                    {t("DIDNT_RECEIVE_OTP")}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendCooldown > 0 || isBlocked}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: resendCooldown > 0 || isBlocked ? 'gray' : '#007bff',
                                        textDecoration: 'underline',
                                        cursor: resendCooldown > 0 || isBlocked ? 'not-allowed' : 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {resendCooldown > 0 
                                        ? `${t("RESEND_OTP")} (${resendCooldown}s)` 
                                        : t("RESEND_OTP")
                                    }
                                </button>
                            </div>

                            <div style={{ 
                                marginTop: '15px', 
                                textAlign: 'center', 
                                fontSize: '12px', 
                                color: 'rgba(157, 157, 157, 1)' 
                            }}>
                                {t("OTP_SECURITY_NOTICE")}
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Otp;