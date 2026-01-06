import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";

import logo from "../../assets/logo.png";
import { findFirstAccessibleRoute } from '../../layout/sidebarData';
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import { UserContext } from "../context/userContext";
import CustomInput from '../customInput/customInput';
import Login from '../login/login';
import { createAccount } from '../server/signup';

/**
 * Check if user is admin based on role permissions
 * Supports both array and object formats for rolePermission
 * @param {object|array} rolePermission - User's role permission object or array
 * @returns {boolean} True if user has admin role
 */
const isAdmin = (rolePermission) => {
  if (!rolePermission) return false;
  
  // Check if rolePermission is an array
  if (Array.isArray(rolePermission)) {
    return rolePermission.some(role => 
      role?.roleName?.toLowerCase() === 'SuperAdmin'.toLowerCase() ||
      role?.role?.toLowerCase() === 'SuperAdmin'.toLowerCase() ||
      role?.name?.toLowerCase() === 'SuperAdmin'.toLowerCase()
    );
  }
  
  // Fallback for object format
  return rolePermission.role?.toLowerCase() === 'SuperAdmin'.toLowerCase() || 
         rolePermission.name?.toLowerCase() === 'SuperAdmin'.toLowerCase() ||
         rolePermission.roleName?.toLowerCase() === 'SuperAdmin'.toLowerCase();
};

/**
 * Signup component for user authentication.
 * 
 * @component
 * @example
 * return (
 *   <Signup />
 * )
 */
function Signup() {
  const [showSignup, setShowSignup] = useState(false);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe] = useState(false);
  const { t } = useTranslation();
  const { setUser } = useContext(UserContext);
  const cookies = new Cookies(null, { path: "/" });
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.email || !formValues.password) {
      toast.error(t('PLEASE_ENTER_VALID_EMAIL_AND_PASSWORD'));
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValues.email)) {
      toast.error(t('PLEASE_ENTER_VALID_EMAIL'));
      return;
    }

    // Basic password length check (minimum 1 character)
    if (formValues.password.trim().length === 0) {
      toast.error(t('PASSWORD_REQUIRED'));
      return;
    }

    setLoading(true);

    try {
      const response = await createAccount({
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
        signinMethod: 'email'
      });

      if (response && response.data) {
        const { user } = response.data;
        setUser(response.data);
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const expireDate = new Date(Date.now() + thirtyDays);

        // Store user data in cookies
        cookies.set(constant.USER, user._id, {
          path: "/",
          expires: expireDate,
          secure: true,
          sameSite: "Strict"
        });

        cookies.set(constant.ROLES, JSON.stringify(user.rolePermission), {
          path: "/",
          secure: true,
          expires: expireDate,
          sameSite: "Strict"
        });

        cookies.set(constant.NAME_SMALL, user.name, {
          path: "/",
          expires: expireDate,
          secure: true,
          sameSite: "Strict"
        });

        // Check if user is admin
        if (!isAdmin(user.rolePermission)) {
          // Redirect non-admin users to business verification
          cookies.set('pending_user_data', JSON.stringify(response.data), {
            path: "/",
            expires: expireDate,
            secure: true,
            sameSite: "Strict"
          });
          toast.info(t("PLEASE_VERIFY_BUSINESS") || "Please verify your business details to continue.");
          navigate('/businessVerification');
          return;
        }

        // Determine the first accessible route based on permissions
        const firstAccessibleRoute = findFirstAccessibleRoute(user.rolePermission);

        toast.success(t("LOGGED_IN_SUCCESSFULLY"));
        navigate(firstAccessibleRoute);
      } else {
        toast.error(t("LOGIN_FAILED"));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || t("LOGIN_FAILED");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Sanitize input to prevent XSS
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    setFormValues(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  if (showSignup) {
    return <Login />;
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
            <h4 className="text-center login-account">{t("CREATE_AN_ACCOUNT")}</h4>
            <Form style={{ marginTop: '30px' }} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="signupEmail">
                <CustomInput
                  type="email"
                  label={t("EMAIL")}
                  style={{ color: "rgba(240,242,245,1" }}
                  value={formValues.email}
                  onChange={handleChange}
                  name="email"
                  maxLength={255}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="signupPassword">
                <div className="password-input-container" style={{ position: 'relative' }}>
                  <CustomInput
                    type={showPassword ? "text" : "password"}
                    label={t("PASSWORD")}
                    style={{ color: "rgba(240,242,245,1" }}
                    value={formValues.password}
                    onChange={handleChange}
                    name="password"
                    maxLength={128}
                    required
                  />
                  {formValues.password && (
                    <div
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '70%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <FaEye fill='rgb(157, 157, 157)' /> : <FaEyeSlash fill='rgb(157, 157, 157)' />}
                    </div>
                  )}
                </div>
              </Form.Group>
              <div className='d-flex justify-content-between'>
                <div onClick={() => setShowSignup(true)}>
                  <span className='signup'>{t("SIGN_IN")}</span>
                </div>
              </div>
              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  className="sign-in-btn"
                  name={loading ? "Creating account..." : t("SIGN_UP")}
                  disabled={loading}
                />
              </div>
              {/* Google Sign-Up Button */}
              <div className="d-grid gap-2" style={{ marginTop: 16 }}>
                <Button
                  type="button"
                  className="google-sign-in-btn"
                  name={t("SIGN_UP_WITH_GOOGLE")}
                  onClick={() => toast.info(t("GOOGLE_SIGN_IN_NOT_IMPLEMENTED"))}
                  disabled={loading}
                />
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;