/**
 * VerifyIp Component
 *
 * This component provides a form for users to verify their IP address by entering
 * a verification code sent to them during login. This is an additional security layer
 * to ensure the login is from a trusted device/IP.
 *
 * @component
 * @example
 * return (
 *   <VerifyIp />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useContext: Hook for accessing context values.
 * - useState, useEffect: Hooks for managing component state and lifecycle.
 * - Col, Container, Row: Bootstrap components for layout.
 * - Form: Bootstrap form component.
 * - useNavigate: Hook for programmatic navigation.
 * - toast, ToastContainer: Components from react-toastify for displaying notifications.
 * - Cookies: Library for managing cookies.
 * - logo: Logo image asset for branding.
 * - Button: A custom button component.
 * - UserContext: Context for managing user state.
 * - verifyIp: Function for handling IP verification requests.
 *
 * @returns {JSX.Element} The rendered VerifyIp component containing the code input form.
 *
 * @logic
 * - Initializes state to manage the verification code input using `useState`.
 * - Uses `useContext` to access the user context.
 * - Implements security features like rate limiting, session validation, and brute force protection.
 * - Handles form submission with `handleSubmit`, validating the code and sending a verification request.
 * - Displays success or error notifications using `toast`.
 * - Redirects the user to the dashboard upon successful verification after a short delay.
 *
 * @events
 * - handleSubmit: Validates the code and sends a verification request when the form is submitted.
 * - handleResendCode: Allows users to request a new verification code with rate limiting.
 */

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';

import logo from '../../assets/logo.png';
import Button from '../../components/button/button';
import { findFirstAccessibleRoute } from '../../layout/sidebarData';
import * as constant from '../../utlis/constant';
import { UserContext } from '../context/userContext';
import { verifyIp, resendIpCode } from '../server/login';

/**
 * Validates verification code format and security
 * @param {string} code - Code to validate
 * @returns {object} - Validation result
 */
const validateCode = (code) => {
  if (!code || code.trim() === '') {
    return { isValid: false, message: 'Verification code is required' };
  }

  if (code.length !== 5) {
    return { isValid: false, message: 'Code must be exactly 5 characters' };
  }

  if (!/^[A-Z0-9]{5}$/.test(code)) {
    return { isValid: false, message: 'Code must contain only letters and numbers' };
  }

  return { isValid: true, message: 'Valid code' };
};

function VerifyIp() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codeError, setCodeError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cookies = new Cookies(null, { path: '/' });

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
    const sessionToken = cookies.get(constant.AUTH_TOKEN);
    if (!sessionToken || sessionToken === 'undefined' || sessionToken === undefined) {
      setSessionExpired(true);
      toast.error(t('SESSION_EXPIRED_PLEASE_START_AGAIN') || 'Session expired. Please login again.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      return;
    }

    // Check if user is currently blocked
    const blockInfo = localStorage.getItem('ip_verify_block');
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
        localStorage.removeItem('ip_verify_block');
      }
    }

    // Set session timeout
    const sessionTimer = setTimeout(() => {
      setSessionExpired(true);
      toast.error(t('SESSION_EXPIRED_PLEASE_START_AGAIN') || 'Session expired. Please login again.');
      navigate('/login');
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
      setBlockTimeLeft((prev) => {
        if (prev <= 1) {
          setIsBlocked(false);
          setAttempts(0);
          localStorage.removeItem('ip_verify_block');
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
      setResendCooldown((prev) => {
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
      toast.error(t('SESSION_EXPIRED_PLEASE_START_AGAIN') || 'Session expired. Please login again.');
      navigate('/login');
      return;
    }

    if (isBlocked) {
      toast.error(t('TOO_MANY_FAILED_ATTEMPTS_PLEASE_WAIT') || 'Too many attempts. Please wait.');
      return;
    }

    // Validate code format
    const codeValidation = validateCode(code);
    if (!codeValidation.isValid) {
      toast.error(codeValidation.message);
      setCodeError(codeValidation.message);
      return;
    }

    setLoading(true);
    setCodeError('');

    // Get temporary user data stored during login
    const tempUserDataStr = cookies.get('temp_user_data');
    let userData = null;
    
    if (tempUserDataStr) {
      try {
        userData = JSON.parse(JSON.stringify(tempUserDataStr));
      } catch (e) {
        console.error('Failed to parse temp user data:', e);
      }
    }

    const details = {
      otp: code.trim().toUpperCase(),
      email: userData?.email || '',
      ip : userData?.ip || '',
      deviceFingerprint: userData?.deviceFingerprint || ''
    };

    try {
      const response = await verifyIp(details);

      // Store success token if provided by backend
      if (response?.token) {
        cookies.set('ip_verified', true, {
          path: '/',
          secure: true,
          sameSite: 'Strict',
        });
      }

      // Set user data in context
      if (userData) {
        setUser(userData);
      }

      // Store final user authentication data in cookies
      if (userData && userData.user) {
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const expireDate = new Date(Date.now() + thirtyDays);

        cookies.set(constant.USER, userData.user._id, {
          path: '/',
          expires: expireDate,
          secure: true,
          sameSite: 'Strict',
        });

        cookies.set(constant.ROLES, JSON.stringify(userData.user.rolePermission), {
          path: '/',
          secure: true,
          expires: expireDate,
          sameSite: 'Strict',
        });

        cookies.set(constant.NAME_SMALL, userData.user.name, {
          path: '/',
          expires: expireDate,
          secure: true,
          sameSite: 'Strict',
        });

        // Clear temporary data
        cookies.remove('temp_user_data', { path: '/' });
        cookies.remove(constant.AUTH_TOKEN, { path: '/' });

        // Determine the first accessible route based on permissions
        const firstAccessibleRoute = findFirstAccessibleRoute(userData.user.rolePermission);

        // Clear any existing blocks on successful verification
        localStorage.removeItem('ip_verify_block');

        toast.success(t('IP_VERIFIED_SUCCESSFULLY') || 'IP verified successfully');

        // Redirect to dashboard/first accessible route
        setTimeout(() => {
          navigate(firstAccessibleRoute);
        }, 2000);
      } else {
        // Fallback if no user data
        localStorage.removeItem('ip_verify_block');
        toast.success(t('IP_VERIFIED_SUCCESSFULLY') || 'IP verified successfully');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Store attempt info
      const blockUntil = Date.now() + BLOCK_DURATION;
      localStorage.setItem(
        'ip_verify_block',
        JSON.stringify({
          attemptCount: newAttempts,
          blockUntil: newAttempts >= MAX_ATTEMPTS ? blockUntil : 0,
        })
      );

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        startBlockTimer(BLOCK_DURATION);
        toast.error(t('TOO_MANY_FAILED_ATTEMPTS_BLOCKED') || 'Too many failed attempts. Account blocked.');
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        toast.error(
          `${t('INVALID_CODE') || 'Invalid code'}. ${remainingAttempts} ${t('ATTEMPTS_REMAINING') || 'attempts remaining'}.`
        );
      }

      const errorMessage = error.response?.data?.message || t('IP_VERIFICATION_FAILED') || 'Verification failed';
      setCodeError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      toast.warning(
        `${t('PLEASE_WAIT') || 'Please wait'} ${resendCooldown} ${t('SECONDS_BEFORE_RESEND') || 'seconds before resend'}`
      );
      return;
    }

    if (isBlocked) {
      toast.error(t('CANNOT_RESEND_WHILE_BLOCKED') || 'Cannot resend while blocked');
      return;
    }

    try {
      await resendIpCode();
      toast.success(t('NEW_CODE_SENT_SUCCESSFULLY') || 'New code sent successfully');
      startResendTimer();
      setCode(''); // Clear current code
      setCodeError('');
    } catch (error) {
      toast.error(t('FAILED_TO_RESEND_CODE') || 'Failed to resend code');
    }
  };

  const handleCodeChange = (value) => {
    // Allow alphanumeric input only, convert to uppercase
    const alphanumericValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    setCode(alphanumericValue);

    // Clear error when user starts typing
    if (codeError) {
      setCodeError('');
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
                <h4 style={{ color: 'red' }}>
                  {t('SESSION_EXPIRED') || 'Session Expired'}
                </h4>
                <p>{t('REDIRECTING_TO_LOGIN') || 'Redirecting to login...'}</p>
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
              <h2 className="logo-login">{t('DREAM_EVENT') || 'Dream Event'}</h2>
            </div>
            <h4 className="text-center login-account">
              {t('IP_VERIFICATION') || 'IP Verification'}
            </h4>
            <p className="text-center details-welcome mt-2">
              {t('ENTER_THE_CODE_SENT_TO_VERIFY_IP') ||
                'Enter the verification code sent to your device to verify this login from your location'}
            </p>

            {/* Security Status Messages */}
            {isBlocked && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid red',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '15px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: 'red',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {t('ACCOUNT_TEMPORARILY_BLOCKED') ||
                    'Account Temporarily Blocked'}
                </div>
                <div style={{ color: 'red', fontSize: '12px' }}>
                  {t('TIME_REMAINING') || 'Time remaining'}: {formatTime(blockTimeLeft)}
                </div>
              </div>
            )}

            {attempts > 0 && !isBlocked && (
              <div
                style={{
                  backgroundColor: 'rgba(255, 165, 0, 0.1)',
                  border: '1px solid orange',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '15px',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: 'orange', fontSize: '12px' }}>
                  {t('FAILED_ATTEMPTS') || 'Failed attempts'}: {attempts}/
                  {MAX_ATTEMPTS}
                </div>
              </div>
            )}

            <Form
              style={{ marginTop: '30px', textAlign: 'center' }}
              onSubmit={handleSubmit}
            >
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder={t('ENTER_6_DIGIT_CODE') || 'Enter 6-character code'}
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  disabled={isBlocked || loading}
                  maxLength="6"
                  style={{
                    textAlign: 'center',
                    fontSize: '24px',
                    letterSpacing: '8px',
                    border: `1px solid ${codeError ? 'red' : 'rgba(255,255,255,0.1)'}`,
                    background: 'transparent',
                    borderRadius: '4px',
                    color: 'white',
                    padding: '15px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#007bff';
                    e.target.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = codeError
                      ? 'red'
                      : 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Form.Group>

              {codeError && (
                <div style={{ color: 'red', fontSize: '12px', marginBottom: '15px' }}>
                  {codeError}
                </div>
              )}

              <div className="d-grid gap-2" style={{ marginTop: '20px' }}>
                <Button
                  type="submit"
                  className="sign-in-btn"
                  name={
                    loading
                      ? `${t('VERIFYING') || 'Verifying'}...`
                      : t('VERIFY_IP') || 'Verify IP'
                  }
                  disabled={isBlocked || loading || code.length !== 6}
                />
              </div>

              {/* Resend Code Section */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(157, 157, 157, 1)',
                  }}
                >
                  {t('DIDNT_RECEIVE_CODE') || "Didn't receive the code?"}
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || isBlocked}
                  style={{
                    background: 'none',
                    border: 'none',
                    color:
                      resendCooldown > 0 || isBlocked ? 'gray' : '#007bff',
                    textDecoration: 'underline',
                    cursor:
                      resendCooldown > 0 || isBlocked
                        ? 'not-allowed'
                        : 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {resendCooldown > 0
                    ? `${t('RESEND_CODE') || 'Resend code'} (${resendCooldown}s)`
                    : t('RESEND_CODE') || 'Resend code'}
                </button>
              </div>

              <div
                style={{
                  marginTop: '15px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: 'rgba(157, 157, 157, 1)',
                }}
              >
                {t('IP_VERIFICATION_SECURITY_NOTICE') ||
                  'This is an additional security measure to protect your account.'}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default VerifyIp;
