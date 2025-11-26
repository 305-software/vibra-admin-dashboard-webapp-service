import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";

import logo from "../../assets/logo.png";
import Button from '../../components/button/button';
import { findFirstAccessibleRoute } from '../../layout/sidebarData';
import * as constant from "../../utlis/constant";
import { UserContext } from "../context/userContext";
import CustomInput from '../customInput/customInput';
import { loginResponse } from "../server/login";
import Signup from '../signup/signup';

/**
 * Login component for user authentication.
 * 
 * @component
 * @example
 * return (
 *   <Login />
 * )
 */
function Login() {
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [showSignup, setShowSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      const response = await loginResponse({
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
        rememberMe: rememberMe,
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

  const handlePassword = () => {
    navigate('/forgotPassword');
  };

  if (showSignup) {
    return <Signup />;
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
            <h4 className="text-center login-account">{t("LOGIN_IN_TO_YOUR_ACCOUNT")}</h4>
            <p className="text-center details-welcome">{t("WELCOME_BACK")}</p>
            <Form style={{ marginTop: '30px' }} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formEmail">
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
              <Form.Group className="mb-3" controlId="formPassword">
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
                <Form.Group className="mb-3" controlId="formCheckbox">
                  <Form.Check
                    type="checkbox"
                    label={t("REMEMBER_FOR_DAYS")}
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>
                <div onClick={handlePassword}>
                  <span className='forgot-password'>{t("FORGOT_PASSWORD")}</span>
                </div>
                <div onClick={() => setShowSignup(true)}>
                  <span className='signup'>{t("SIGNUP")}</span>
                </div>
              </div>
              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  className="sign-in-btn"
                  name={loading ? "Signing in..." : t("SIGN_IN")}
                  disabled={loading}
                />
              </div>
              {/* Google Sign-In Button */}
              <div className="d-grid gap-2" style={{ marginTop: 16 }}>
                <Button
                  type="button"
                  className="google-sign-in-btn"
                  name={t("SIGN_IN_WITH_GOOGLE")}
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

export default Login;