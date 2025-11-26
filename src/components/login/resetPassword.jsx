/**
 * ResetPassword Component
 *
 * This component provides a form for users to reset their password. Users must enter their new password
 * and confirm it. Upon successful reset, the user is redirected to the home page.
 *
 * @component
 * @example
 * return (
 *   <ResetPassword />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useContext: Hook for accessing context values.
 * - useState: Hook for managing component state.
 * - Col, Container, Row: Bootstrap components for layout.
 * - Form: Bootstrap form component.
 * - FaEye, FaEyeSlash: Icons for toggling password visibility.
 * - useNavigate: Hook for programmatic navigation.
 * - toast, ToastContainer: Components from react-toastify for displaying notifications.
 * - Cookies: Library for managing cookies.
 * - logo: Logo image asset for branding.
 * - Button: A custom button component.
 * - UserContext: Context for managing user state.
 * - CustomInput: A custom input component for form fields.
 * - resetPassword: Function for handling password reset requests.
 *
 * @returns {JSX.Element} The rendered ResetPassword component containing the password reset form.
 *
 * @logic
 * - Initializes state to manage form values (password and confirm password) and visibility of password inputs using `useState`.
 * - Uses `useContext` to access the user context for setting user information.
 * - Retrieves the email from cookies to include in the password reset request.
 * - Handles form submission with `handleSubmit`, validating the inputs and sending a reset request.
 * - Displays success or error notifications using `toast`.
 * - Redirects the user to the home page upon successful reset after a short delay.
 *
 * @events
 * - handleSubmit: Validates the password and confirm password inputs and sends a reset request when the form is submitted.
 * - handleChange: Updates the form values as the user types in the password fields.
 * - togglePasswordVisibility: Toggles the visibility of the password input field.
 * - toggleConfirmPasswordVisibility: Toggles the visibility of the confirm password input field.
 */

import React, { useContext, useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "universal-cookie";

import logo from "../../assets/logo.png";
import Button from '../button/button';
import * as constant from "../../utlis/constant";
import { UserContext } from "../context/userContext";
import CustomInput from '../customInput/customInput';
import { resetPassword } from "../server/login";

/**
 * Validates password strength with enhanced security requirements
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with detailed requirements
 */
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const maxLength = 128;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password);
  
  // Check for common weak patterns
  const commonPatterns = [
    /(.)\1{2,}/, // Three or more consecutive identical characters
    /123456|654321|abcdef|qwerty|password|admin|user/i, // Common sequences and words
    /^(.)\1+$/ // All same characters
  ];
  
  const hasWeakPattern = commonPatterns.some(pattern => pattern.test(password));

  const requirements = {
    length: password.length >= minLength && password.length <= maxLength,
    upperCase: hasUpperCase,
    lowerCase: hasLowerCase,
    numbers: hasNumbers,
    specialChar: hasSpecialChar,
    noWeakPattern: !hasWeakPattern
  };

  const allRequirementsMet = Object.values(requirements).every(req => req);

  return {
    isValid: allRequirementsMet,
    requirements,
    message: allRequirementsMet ? 'Password is strong' : 'Password does not meet security requirements'
  };
};

/**
 * Password strength indicator component
 */
const PasswordRequirements = ({ password, t }) => {
  const validation = validatePasswordStrength(password);
  const { requirements } = validation;

  const RequirementItem = ({ met, text }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      color: met ? 'green' : 'red', 
      fontSize: '12px',
      marginBottom: '2px'
    }}>
      {met ? <FaCheck size={10} /> : <FaTimes size={10} />}
      <span style={{ marginLeft: '5px' }}>{text}</span>
    </div>
  );

  if (!password) return null;

  return (
    <div style={{ marginTop: '5px', padding: '10px', backgroundColor: 'rgba(240,242,245,0.1)', borderRadius: '4px' }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>
        {t("PASSWORD_REQUIREMENTS")}:
      </div>
      <RequirementItem met={requirements.length} text={t("8_TO_128_CHARACTERS")} />
      <RequirementItem met={requirements.upperCase} text={t("ONE_UPPERCASE_LETTER")} />
      <RequirementItem met={requirements.lowerCase} text={t("ONE_LOWERCASE_LETTER")} />
      <RequirementItem met={requirements.numbers} text={t("ONE_NUMBER")} />
      <RequirementItem met={requirements.specialChar} text={t("ONE_SPECIAL_CHARACTER")} />
      <RequirementItem met={requirements.noWeakPattern} text={t("NO_COMMON_PATTERNS")} />
    </div>
  );
};

function ResetPassword() {
  const [formValues, setFormValues] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const cookies = new Cookies(null, { path: "/" });
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check if email exists in cookies, redirect if not
  useEffect(() => {
    const email = cookies.get(constant.EMAIL) || cookies.get(constant.EMAIL_SMALL);
    if (!email) {
      toast.error(t("SESSION_EXPIRED_PLEASE_START_AGAIN"));
      navigate('/forgotPassword');
    }
  }, [cookies, navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    // Validate form input
    if (!formValues.password || !formValues.confirmPassword) {
      errors.push(t("ALL_THE_FIELDS_ARE_REQUIRED"));
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(formValues.password);
    if (!passwordValidation.isValid) {
      errors.push(t("PASSWORD_DOES_NOT_MEET_SECURITY_REQUIREMENTS"));
    }

    // Validate password and confirm password match
    if (formValues.password !== formValues.confirmPassword) {
      errors.push(t("PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH"));
    }

    // Check for password reuse (you might want to implement this check on backend)
    if (formValues.password.length > 0 && formValues.password.toLowerCase().includes('password')) {
      errors.push(t("PASSWORD_CANNOT_CONTAIN_WORD_PASSWORD"));
    }

    if (errors.length > 0) {
      setPasswordErrors(errors);
      errors.forEach(error => toast.error(error));
      return;
    }

    setLoading(true);
    setPasswordErrors([]);

    const email = cookies.get(constant.EMAIL) || cookies.get(constant.EMAIL_SMALL);
    const details = {
      email: email,
      password: formValues.password
    };

    try {
      const response = await resetPassword(details);
      setUser(response?.data);
      toast.success(t("PASSWORD_RESET_SUCCESSFULLY"));

      // Clear sensitive data from cookies
      cookies.remove(constant.EMAIL);
      cookies.remove(constant.EMAIL_SMALL);

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || t("PASSWORD_RESET_FAILED");
      toast.error(errorMessage);
      setPasswordErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Sanitize input to prevent XSS
    const sanitizedValue = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    setFormValues({ ...formValues, [name]: sanitizedValue });
    
    // Clear errors when user starts typing
    if (passwordErrors.length > 0) {
      setPasswordErrors([]);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            <h4 className="text-center login-account">{t("RESET_PASSWORD")}</h4>
            <p className="text-center details-welcome">{t("CREATE_STRONG_PASSWORD")}</p>
            
            {passwordErrors.length > 0 && (
              <div style={{ 
                backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                border: '1px solid red', 
                borderRadius: '4px', 
                padding: '10px', 
                marginBottom: '15px' 
              }}>
                {passwordErrors.map((error, index) => (
                  <div key={index} style={{ color: 'red', fontSize: '12px' }}>
                    • {error}
                  </div>
                ))}
              </div>
            )}
            
            <Form style={{ marginTop: '30px' }} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formPassword">
                <div style={{ position: 'relative' }}>
                  <CustomInput
                    type={showPassword ? "text" : "password"}
                    label={t("NEW_PASSWORD")}
                    style={{ color: "rgba(240,242,245,1)" }}
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
                      {showPassword ? <FaEyeSlash fill='rgb(157, 157, 157)' /> : <FaEye fill='rgb(157, 157, 157)' />}
                    </div>
                  )}
                </div>
                <PasswordRequirements password={formValues.password} t={t} />
              </Form.Group>

              <Form.Group className="mb-5" controlId="formConfirmPassword">
                <div style={{ position: 'relative' }}>
                  <CustomInput
                    type={showConfirmPassword ? "text" : "password"}
                    label={t("CONFIRM_NEW_PASSWORD")}
                    style={{ color: "rgba(240,242,245,1)" }}
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    name="confirmPassword"
                    maxLength={128}
                    required
                  />
                  {formValues.confirmPassword && (
                    <div
                      onClick={toggleConfirmPasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '70%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                      }}
                    >
                      {showConfirmPassword ? <FaEyeSlash fill='rgb(157, 157, 157)' /> : <FaEye fill='rgb(157, 157, 157)' />}
                    </div>
                  )}
                </div>
                {formValues.confirmPassword && formValues.password && (
                  <div style={{ 
                    color: formValues.password === formValues.confirmPassword ? 'green' : 'red', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {formValues.password === formValues.confirmPassword ? (
                      <>
                        <FaCheck size={10} style={{ marginRight: '5px' }} />
                        {t("PASSWORDS_MATCH")}
                      </>
                    ) : (
                      <>
                        <FaTimes size={10} style={{ marginRight: '5px' }} />
                        {t("PASSWORDS_DO_NOT_MATCH")}
                      </>
                    )}
                  </div>
                )}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  type="submit" 
                  className="sign-in-btn" 
                  name={loading ? t("RESETTING") + "..." : t("RESET_PASSWORD")}
                  disabled={loading || !validatePasswordStrength(formValues.password).isValid || formValues.password !== formValues.confirmPassword}
                />
              </div>
              
              <div style={{ 
                marginTop: '15px', 
                textAlign: 'center', 
                fontSize: '12px', 
                color: 'rgba(157, 157, 157, 1)' 
              }}>
                {t("PASSWORD_SECURITY_NOTICE")}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ResetPassword;