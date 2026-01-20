import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Select, Button, message, Row, Col, Modal } from 'antd';
import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/userContext';
import { getBusinessVerificationStatus, updateBusinessVerification } from '../server/businessVerification';
import { verifyPhone, sendPhoneOtp, verifyEmail, sendEmailLink } from '../server/verifyPhone';
import Card from '../card/tableCard';

const BusinessInformation = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedFields, setVerifiedFields] = useState({});
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [lastOtpTime, setLastOtpTime] = useState(null);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [currentVerifyField, setCurrentVerifyField] = useState(null);
  const [lastEmailOtpTime, setLastEmailOtpTime] = useState(null);
  const [emailOtpCountdown, setEmailOtpCountdown] = useState(0);
  const { t } = useTranslation();
  const { user } = useContext(UserContext);

  // Helper function to create verified field label
  const getVerifiedLabel = (fieldName, label) => {
    const isVerified = verifiedFields[fieldName];
    
    return (
      <span>
        {label}
        {isVerified ? (
          <CheckCircleFilled 
            style={{ 
              color: '#52c41a', 
              marginLeft: '8px',
              fontSize: '16px'
            }} 
            title="Verified"
          />
        ) : (
          <ExclamationCircleOutlined 
            style={{ 
              color: '#faad14', 
              marginLeft: '8px',
              fontSize: '16px'
            }} 
            title="Attention: This field needs verification"
          />
        )}
      </span>
    );
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCountdown]);

  // Countdown timer for email OTP resend
  useEffect(() => {
    let interval;
    if (emailOtpCountdown > 0) {
      interval = setInterval(() => {
        setEmailOtpCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpCountdown]);

  // Fetch user business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setIsLoading(true);
        const userId = user?.data?.user?._id;
        if (userId) {
          const response = await getBusinessVerificationStatus(userId);
          if (response && response.data) {
            // Populate form with fetched data
            const fieldData = {
              businessName: response.data.user.businessInfo.businessNameInfo.name,
              ownerFirstName: response.data.user.businessInfo.ownerInfo?.info?.firstName || '',
              ownerLastName: response.data.user.businessInfo.ownerInfo?.info?.lastName || '',
              businessDescription: response.data.user.businessInfo.businessDescriptionInfo.description,
              email: response.data.user.email || '',
              phoneNumber: response.data.user.businessInfo.phoneNumberInfo.phoneNumber ? formatPhoneNumber(response.data.user.businessInfo.phoneNumberInfo.phoneNumber) : '',
              streetAddress: response.data.user.businessInfo.addressInfo?.address.street,
              address2: response.data.user.businessInfo.addressInfo?.address.address2,
              city: response.data.user.businessInfo.addressInfo?.address.city,
              state: response.data.user.businessInfo.addressInfo?.address.state,
              zipCode: response.data.user.businessInfo.addressInfo?.address.zipCode,
              socialMediaLinks: Array.isArray(response.data.user.businessInfo.socialMediaLinksInfo.links) 
                ? response.data.user.businessInfo.socialMediaLinksInfo.links.join('\n') 
                : response.data.user.businessInfo.socialMediaLinksInfo.links
            };

            const verifyData = {
              businessName: response.data.user.businessInfo.businessNameInfo.isVerified,
              ownerFirstName: response.data.user.businessInfo.ownerInfo?.isVerified,
              ownerLastName: response.data.user.businessInfo.ownerInfo?.isVerified,
              businessDescription: response.data.user.businessInfo.businessDescriptionInfo.isVerified,
              email: response.data.user.emailVerified,
              phoneNumber: response.data.user.businessInfo.phoneNumberInfo.isVerified,
              streetAddress: response.data.user.businessInfo.addressInfo?.isVerified,
              address2: response.data.user.businessInfo.addressInfo?.isVerified,
              city: response.data.user.businessInfo.addressInfo?.isVerified,
              state: response.data.user.businessInfo.addressInfo?.isVerified,
              zipCode: response.data.user.businessInfo.addressInfo?.isVerified,
              socialMediaLinks: response.data.user.businessInfo.socialMediaLinksInfo.isVerified
            };
            
            form.setFieldsValue(fieldData);

            // Mark fields as verified if they have values
            const verified = {};
            Object.keys(verifyData).forEach(key => {
              if (verifyData[key] === true) {
                verified[key] = true;
              }
            });
            setVerifiedFields(verified);
          }
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
        // Silently fail if no existing data
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessData();
  }, [user, form]);

  // Format phone number to (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/\D/g, '');
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Extract only digits from phone number for API calls (Twilio format)
  const cleanPhoneNumber = (phoneNumber) => {
    const digits = phoneNumber.replace(/\D/g, '');
    return `+1${digits}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ phoneNumber: formatted });
  };

  const handleVerifyPhone = async () => {
    const phoneNumber = form.getFieldValue('phoneNumber');
    if (!phoneNumber || phoneNumber.length < 14) {
      message.error('Please enter a valid phone number');
      return;
    }

    // Check if 5 minutes have passed since last OTP send
    const now = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    if (lastOtpTime && now - lastOtpTime < fiveMinutesInMs) {
      const remainingTime = Math.ceil((fiveMinutesInMs - (now - lastOtpTime)) / 1000);
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      message.error(`Please wait ${minutes}m ${seconds}s before requesting another code`);
      return;
    }

    try {
      setVerifyLoading(true);
      await sendPhoneOtp(cleanPhoneNumber(phoneNumber), user.data.user._id);

      setLastOtpTime(now);
      setOtpCountdown(300); // 5 minutes in seconds
      setCurrentVerifyField('phoneNumber');

      setShowVerifyModal(true);
      message.info('Verification code sent to your phone');
    } catch (error) {
      message.error('Failed to send verification code');
      console.error('Error:', error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleVerifyCodeSubmit = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      message.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      setVerifyLoading(true);

      if (currentVerifyField === 'email') {
        const email = form.getFieldValue('email');
        await verifyEmail(verifyCode, email, user.data.user._id);
      } else {
        const phoneNumber = form.getFieldValue('phoneNumber');
        await verifyPhone(verifyCode, cleanPhoneNumber(phoneNumber), user.data.user._id);
      }

      setVerifiedFields(prev => ({
        ...prev,
        [currentVerifyField || 'phoneNumber']: true
      }));

      message.success(`${currentVerifyField === 'email' ? 'Email' : 'Phone number'} verified successfully`);
      setShowVerifyModal(false);
      setVerifyCode('');
      setCurrentVerifyField(null);
    } catch (error) {
      message.error('Verification failed. Please try again.');
      console.error('Error:', error);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleVerifyCancel = () => {
    setShowVerifyModal(false);
    setVerifyCode('');
    setCurrentVerifyField(null);
  };

  const handleVerifyEmail = async () => {
    const email = form.getFieldValue('email');
    if (!email || !email.includes('@')) {
      message.error('Please enter a valid email address');
      return;
    }

    // Check if 5 minutes have passed since last OTP send
    const now = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    if (lastEmailOtpTime && now - lastEmailOtpTime < fiveMinutesInMs) {
      const remainingTime = Math.ceil((fiveMinutesInMs - (now - lastEmailOtpTime)) / 1000);
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      message.error(`Please wait ${minutes}m ${seconds}s before requesting another code`);
      return;
    }

    try {
      setVerifyLoading(true);
      await sendEmailLink(email);

      setLastEmailOtpTime(now);
      setEmailOtpCountdown(300); // 5 minutes in seconds
      setCurrentVerifyField('email');
      message.info('Verification link sent to your email');
    } catch (error) {
      message.error('Failed to send verification code');
      console.error('Error:', error);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <>
      <Card>
      <div className='settings-business-info'>
        <h2 className='mb-4'>{t("BUSINESS_INFORMATION") || 'Business Information'}</h2>
        
        <Form
          form={form}
          layout="vertical"
          className="business-form"
        >
          <div className="form-section">
            <Form.Item
              name="businessName"
              label={getVerifiedLabel('businessName', t("BUSINESS_NAME") || 'Business Name')}
              rules={[
              ]}
            >
              <Input 
                placeholder="e.g., ABC Events Inc."
                size="large"
                disabled={verifiedFields['businessName']}
              />
            </Form.Item>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name="ownerFirstName"
                label={getVerifiedLabel('ownerFirstName', t("OWNER_FIRST_NAME") || 'Owner First Name')}
                rules={[
                  ]}
              >
                <Input 
                  placeholder="e.g., John"
                  size="large"
                  disabled={verifiedFields['ownerFirstName']}
                />
              </Form.Item>

              <Form.Item
                name="ownerLastName"
                label={getVerifiedLabel('ownerLastName', t("OWNER_LAST_NAME") || 'Owner Last Name')}
                rules={[
                  ]}
              >
                <Input 
                  placeholder="e.g., Doe"
                  size="large"
                  disabled={verifiedFields['ownerLastName']}
                />
              </Form.Item>
            </div>

            <Form.Item
              name="businessId"
              label={t("TAX_ID_EIN") || 'Tax ID / EIN'}
            >
              <Input 
                placeholder="e.g., 12-3456789"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="businessDescription"
              label={getVerifiedLabel('businessDescription', t("BUSINESS_DESCRIPTION") || 'Business Description')}
              rules={[
              ]}
            >
              <Input.TextArea 
                placeholder={t("TELL_US_ABOUT_YOUR_BUSINESS") || 'Tell us about your business...'}
                rows={3}
                size="large"
                maxLength={500}
                showCount
                disabled={verifiedFields['businessDescription']}
              />
            </Form.Item>
          </div>

          <div className="form-section">
            <Form.Item
              name="email"
              label={getVerifiedLabel('email', t("EMAIL") || 'Email')}
              rules={[
                {
                  type: 'email',
                  message: t("INVALID_EMAIL") || 'Please enter a valid email address'
                }
              ]}
            >
              <Input 
                placeholder="e.g., business@example.com"
                size="large"
                disabled={true}
              />
            </Form.Item>
            {!verifiedFields['email'] && (
              <Button 
                type="primary"
                onClick={handleVerifyEmail}
                style={{ marginTop: '-8px', marginBottom: '16px' }}
                disabled={emailOtpCountdown > 0}
                loading={verifyLoading && currentVerifyField === 'email'}
              >
                {emailOtpCountdown > 0 
                  ? `Resend in ${Math.floor(emailOtpCountdown / 60)}:${(emailOtpCountdown % 60).toString().padStart(2, '0')}` 
                  : 'Verify Email'
                }
              </Button>
            )}

            <Form.Item
              name="phoneNumber"
              label={getVerifiedLabel('phoneNumber', t("PHONE_NUMBER") || 'Phone Number')}
              rules={[
                {
                  pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
                  message: t("INVALID_PHONE") || 'Please enter a valid phone number'
                }
              ]}
            >
              <Input 
                placeholder="(786) 470-4126"
                size="large"
                onChange={handlePhoneChange}
                maxLength={14}
                disabled={verifiedFields['phoneNumber']}
              />
            </Form.Item>
            {!verifiedFields['phoneNumber'] && (
              <Button 
                type="primary"
                onClick={handleVerifyPhone}
                style={{ marginTop: '-8px', marginBottom: '16px' }}
                disabled={otpCountdown > 0}
                loading={verifyLoading}
              >
                {otpCountdown > 0 
                  ? `Resend in ${Math.floor(otpCountdown / 60)}:${(otpCountdown % 60).toString().padStart(2, '0')}` 
                  : 'Verify Phone Number'
                }
              </Button>
            )}
          </div>

          <div className="form-section">
            <Form.Item
              name="streetAddress"
              label={getVerifiedLabel('streetAddress', t("STREET_ADDRESS") || 'Street Address')}
              rules={[
              ]}
            >
              <Input 
                placeholder="e.g., 123 Main Street"
                size="large"
                disabled={verifiedFields['streetAddress']}
              />
            </Form.Item>

            <Form.Item
              name="address2"
              label={t("APARTMENT_SUITE") || 'Apartment, Suite, etc.'}
            >
              <Input 
                placeholder={t("OPTIONAL") || 'Optional'}
                size="large"
                disabled={verifiedFields['address2']}
              />
            </Form.Item>

            <Form.Item
              name="city"
              label={getVerifiedLabel('city', t("CITY") || 'City')}
              rules={[
              ]}
            >
              <Input 
                placeholder="e.g., New York"
                size="large"
                disabled={verifiedFields['city']}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="state"
                  label={getVerifiedLabel('state', t("STATE") || 'State')}
                  rules={[
                  ]}
                >
                  <Input 
                    placeholder={t("SELECT_YOUR_STATE") || 'e.g., California'}
                    size="large"
                    disabled={verifiedFields['state']}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="zipCode"
                  label={getVerifiedLabel('zipCode', t("ZIP_CODE") || 'ZIP Code')}
                  rules={[

                    {
                      pattern: /^\d{5}(-\d{4})?$/,
                      message: t("INVALID_ZIP") || 'Please enter a valid ZIP code'
                    }
                  ]}
                >
                  <Input 
                    placeholder="12345 or 12345-6789"
                    size="large"
                    disabled={verifiedFields['zipCode']}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className="form-section">
            <Form.Item
              name="socialMediaLinks"
              label={getVerifiedLabel('socialMediaLinks', t("SOCIAL_MEDIA_LINKS") || 'Social Media Links')}
            >
              <Input.TextArea 
                placeholder={t("ONE_LINK_PER_LINE") || 'Enter one link per line (e.g., https://facebook.com/yourpage)'}
                rows={4}
                size="large"
                disabled={verifiedFields['socialMediaLinks']}
              />
            </Form.Item>
          </div>
        </Form>
      </div>
      </Card>

      <Modal
        title="Verify Phone Number"
        visible={showVerifyModal}
        onCancel={handleVerifyCancel}
        footer={[
          <Button key="back" onClick={handleVerifyCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={verifyLoading} 
            onClick={handleVerifyCodeSubmit}
          >
            Verify
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '24px' }}>
            Enter the 6-digit verification code sent to your phone number
          </p>
          <Input
            placeholder="Enter 6-digit code"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
            onPressEnter={handleVerifyCodeSubmit}
            maxLength={6}
            size="large"
            style={{ 
              textAlign: 'center',
              fontSize: '24px',
              letterSpacing: '8px',
              marginBottom: '16px'
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default BusinessInformation;
