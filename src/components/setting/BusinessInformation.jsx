import React, { useState, useContext, useEffect } from 'react';
import { Form, Input, Select, Button, message, Row, Col, Modal } from 'antd';
import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/userContext';
import { getBusinessVerificationStatus, updateBusinessVerification } from '../server/businessVerification';
import Card from '../card/tableCard';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const BusinessInformation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedFields, setVerifiedFields] = useState({});
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
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

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ phoneNumber: formatted });
  };

  const handleVerifyPhone = () => {
    const phoneNumber = form.getFieldValue('phoneNumber');
    if (!phoneNumber || phoneNumber.length < 14) {
      message.error('Please enter a valid phone number');
      return;
    }
    // Show verification modal
    setShowVerifyModal(true);
    message.info('Verification code sent to your phone');
  };

  const handleVerifyCodeSubmit = async () => {
    if (!verifyCode || verifyCode.length !== 5) {
      message.error('Please enter a valid 5-digit code');
      return;
    }

    try {
      setVerifyLoading(true);
      // TODO: Add actual phone verification API call here
      // For now, just simulate verification
      
      // Mark phone as verified
      setVerifiedFields(prev => ({
        ...prev,
        phoneNumber: true
      }));

      message.success('Phone number verified successfully');
      setShowVerifyModal(false);
      setVerifyCode('');
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
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const userId = user?.user?._id;
      
      // Clean up phone number - remove formatting for API submission
      const cleanedValues = {
        businessName: values.businessName,
        ownerFirstName: values.ownerFirstName,
        ownerLastName: values.ownerLastName,
        businessId: values.businessId,
        businessDescription: values.businessDescription,
        phoneNumber: values.phoneNumber.replace(/\D/g, ''),
        address: {
          streetAddress: values.streetAddress,
          address2: values.address2,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode
        },
        socialMediaLinks: values.socialMediaLinks
          .split('\n')
          .map(link => link.trim())
          .filter(link => link.length > 0)
      };

      if (userId) {
        await updateBusinessVerification(userId, cleanedValues);
      }
      
      message.success(t("SAVED_SUCCESSFULLY") || 'Saved successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save';
      message.error(errorMessage);
      console.error('Error:', error);
    } finally {
      setLoading(false);
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
          onFinish={handleSubmit}
          className="business-form"
        >
          <div className="form-section">
            <Form.Item
              name="businessName"
              label={getVerifiedLabel('businessName', t("BUSINESS_NAME") || 'Business Name')}
              rules={[
                { required: true, message: t("BUSINESS_NAME_REQUIRED") || 'Business name is required' }
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
                  { required: true, message: t("OWNER_FIRST_NAME_REQUIRED") || 'Owner first name is required' }
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
                  { required: true, message: t("OWNER_LAST_NAME_REQUIRED") || 'Owner last name is required' }
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
                { required: true, message: t("BUSINESS_DESCRIPTION_REQUIRED") || 'Business description is required' }
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
              name="phoneNumber"
              label={getVerifiedLabel('phoneNumber', t("PHONE_NUMBER") || 'Phone Number')}
              rules={[
                { required: true, message: t("PHONE_NUMBER_REQUIRED") || 'Phone number is required' },
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
              >
                Verify Phone Number
              </Button>
            )}
          </div>

          <div className="form-section">
            <Form.Item
              name="streetAddress"
              label={getVerifiedLabel('streetAddress', t("STREET_ADDRESS") || 'Street Address')}
              rules={[
                { required: true, message: t("STREET_ADDRESS_REQUIRED") || 'Street address is required' }
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
                { required: true, message: t("CITY_REQUIRED") || 'City is required' }
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
                    { required: true, message: t("STATE_REQUIRED") || 'State is required' }
                  ]}
                >
                  <Select 
                    placeholder={t("SELECT_YOUR_STATE") || 'Select your state'}
                    size="large"
                    options={US_STATES.map(state => ({
                      label: state,
                      value: state
                    }))}
                    disabled={verifiedFields['state']}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="zipCode"
                  label={getVerifiedLabel('zipCode', t("ZIP_CODE") || 'ZIP Code')}
                  rules={[
                    { required: true, message: t("ZIP_CODE_REQUIRED") || 'ZIP code is required' },
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

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              className="submit-button"
            >
              {t("SAVE_CHANGES") || 'Save Changes'}
            </Button>
          </Form.Item>
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
            Enter the 5-digit verification code sent to your phone number
          </p>
          <Input
            placeholder="Enter 5-digit code"
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
            onPressEnter={handleVerifyCodeSubmit}
            maxLength={5}
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
