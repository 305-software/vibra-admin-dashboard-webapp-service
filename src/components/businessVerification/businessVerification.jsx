/**
 * Business Verification Component
 * 
 * This component displays a form for users to verify their business details.
 * It includes fields for business information, contact details, and social media links.
 */

import React, { useState, useContext } from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CustomModal from '../modal/Modal';
import CustomButton from '../button/button';
import { UserContext } from '../context/userContext';
import { submitBusinessVerification } from '../server/businessVerification';
import './businessVerification.css';

// US States list
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

const BusinessVerification = ({ onSubmit, onLogout }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Format phone number to (XXX) XXX-XXXX
    const formatPhoneNumber = (value) => {
        if (!value) return value;
        
        // Remove all non-digits
        const phoneNumber = value.replace(/\D/g, '');
        
        // Format as (XXX) XXX-XXXX
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

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            
            // Get email from user context
            const userEmail = user?.user?.email || '';
            const userId = user?.user?._id || '';
            
            // Clean up phone number - remove formatting for API submission
            // Convert socialMediaLinks string to array by splitting on newlines
            const cleanedValues = {
                businessName: values.businessName,
                businessDescription: values.businessDescription,
                businessId: userId,
                ownerFirstName: values.ownerFirstName,
                ownerLastName: values.ownerLastName,
                phoneNumber: values.phoneNumber.replace(/\D/g, ''),
                email: userEmail,
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
            
            // Submit to backend via API function
            const response = await submitBusinessVerification(cleanedValues);

            if (response && response.status === 200) {
                form.resetFields();
            }
            
            // Call onSubmit callback if provided
            if (onSubmit) {
                await onSubmit(response);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit business verification';
            message.error(errorMessage);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        if (onLogout) {
            onLogout();
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <div className="login-background">
            <div className="business-verification-container">
            <div className="verification-header">
                <div className="header-top">
                    <div className="header-content">
                        <h2>Business Verification</h2>
                        <p>Let's verify your business and unlock full access</p>
                    </div>
                    <button 
                        className="logout-button"
                        onClick={handleLogoutClick}
                        title="Logout"
                    >
                        <LogoutOutlined style={{ fontSize: '18px' }} />
                        Logout
                    </button>
                </div>
            </div>

            <CustomModal
                show={showLogoutModal}
                handleClose={handleLogoutCancel}
                body={
                    <div>
                        <h3 className='mb-3'>Logout</h3>
                        <h5>Are you sure you want to logout?</h5>
                        <div className='d-flex justify-content-end gap-2 mt-3'>
                            <CustomButton 
                                name="Cancel" 
                                style={{ backgroundColor: "#6c757d", color: "white" }} 
                                onClick={handleLogoutCancel} 
                            />
                            <CustomButton 
                                name="Logout" 
                                style={{ backgroundColor: "rgb(231, 28, 28)", color: "white" }} 
                                onClick={handleLogoutConfirm} 
                            />
                        </div>
                    </div>
                }
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="business-verification-form"
            >
                <div className="form-section">
                    <h3 className="section-title">Basic Information</h3>
                    
                    <Form.Item
                        name="businessName"
                        label="Business Name"
                        rules={[
                            { required: true, message: 'Business name is required' }
                        ]}
                    >
                        <Input 
                            placeholder="e.g., ABC Events Inc."
                            size="large"
                        />
                    </Form.Item>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="ownerFirstName"
                            label="Owner First Name"
                            rules={[
                                { required: true, message: 'Owner first name is required' }
                            ]}
                        >
                            <Input 
                                placeholder="e.g., John"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="ownerLastName"
                            label="Owner Last Name"
                            rules={[
                                { required: true, message: 'Owner last name is required' }
                            ]}
                        >
                            <Input 
                                placeholder="e.g., Doe"
                                size="large"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="businessId"
                        label="Tax ID / EIN"
                        rules={[]}
                    >
                        <Input 
                            placeholder="e.g., 12-3456789"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="businessDescription"
                        label="Business Description"
                        rules={[
                            { required: true, message: 'Business description is required' }
                        ]}
                    >
                        <Input.TextArea 
                            placeholder="Tell us about your business..."
                            rows={3}
                            size="large"
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Contact Information</h3>
                    
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[
                            { required: true, message: 'Phone number is required' },
                            {
                                pattern: /^\(\d{3}\) \d{3}-\d{4}$/,
                                message: 'Please enter a valid phone number'
                            }
                        ]}
                    >
                        <Input 
                            placeholder="(786) 470-4126"
                            size="large"
                            onChange={handlePhoneChange}
                            maxLength={14}
                        />
                    </Form.Item>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Business Address</h3>
                    
                    <Form.Item
                        name="streetAddress"
                        label="Street Address"
                        rules={[
                            { required: true, message: 'Street address is required' }
                        ]}
                    >
                        <Input 
                            placeholder="e.g., 123 Main Street"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="address2"
                        label="Apartment, Suite, etc."
                    >
                        <Input 
                            placeholder="Optional"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label="City"
                        rules={[
                            { required: true, message: 'City is required' }
                        ]}
                    >
                        <Input 
                            placeholder="e.g., New York"
                            size="large"
                        />
                    </Form.Item>

                    <div className="address-row">
                        <Form.Item
                            name="state"
                            label="State"
                            rules={[
                                { required: true, message: 'State is required' }
                            ]}
                        >
                            <Select 
                                placeholder="Select your state"
                                size="large"
                                options={US_STATES.map(state => ({
                                    label: state,
                                    value: state
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            name="zipCode"
                            label="ZIP Code"
                            rules={[
                                { required: true, message: 'ZIP code is required' },
                                {
                                    pattern: /^\d{5}(-\d{4})?$/,
                                    message: 'Invalid ZIP code format'
                                }
                            ]}
                        >
                            <Input 
                                placeholder="e.g., 10001"
                                size="large"
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Social Media Presence</h3>
                    
                    <Form.Item
                        name="socialMediaLinks"
                        label="Social Media Links"
                        rules={[
                            { required: true, message: 'At least one social media link is required' }
                        ]}
                    >
                        <Input.TextArea 
                            placeholder="Enter your social media profiles (one per line)&#10;e.g.,&#10;https://facebook.com/yourpage&#10;https://instagram.com/yourprofile"
                            rows={3}
                            size="large"
                        />
                    </Form.Item>
                </div>

                <div className="form-actions">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        size="large"
                        className="submit-button"
                    >
                        {loading ? 'Submitting...' : 'Submit Verification'}
                    </Button>
                </div>
            </Form>
            </div>
        </div>
    );
};

export default BusinessVerification;
