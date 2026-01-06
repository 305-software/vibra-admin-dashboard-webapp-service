/**
 * Business Verification Component
 * 
 * This component displays a form for users to verify their business details.
 * It includes fields for business information, contact details, and social media links.
 */

import React, { useState } from 'react';
import { Form, Button, Input, Select, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import CustomModal from '../modal/Modal';
import CustomButton from '../button/button';
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

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (onSubmit) {
                await onSubmit(values);
            }
            message.success('Business verification submitted successfully');
            form.resetFields();
        } catch (error) {
            message.error('Failed to submit business verification');
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
        <div className="business-verification-container">
            <div className="verification-header">
                <div className="header-top">
                    <div>
                        <h2>Verify Your Business</h2>
                        <p>Please provide your business details to complete the verification process</p>
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
                    <h3>Business Information</h3>
                    
                    <Form.Item
                        name="businessName"
                        label="Business Name"
                        rules={[
                            { required: true, message: 'Please enter your business name' }
                        ]}
                    >
                        <Input 
                            placeholder="Enter your business name"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="businessDescription"
                        label="Business Description"
                        rules={[
                            { required: true, message: 'Please enter your business description' }
                        ]}
                    >
                        <Input.TextArea 
                            placeholder="Describe your business"
                            rows={4}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="businessId"
                        label="Business ID"
                        rules={[
                            { required: true, message: 'Please enter your business ID' }
                        ]}
                    >
                        <Input 
                            placeholder="Enter your business ID"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="roleId"
                        label="Role ID"
                        rules={[
                            { required: true, message: 'Please enter your role ID' }
                        ]}
                    >
                        <Input 
                            placeholder="Enter your role ID"
                            size="large"
                        />
                    </Form.Item>
                </div>

                <div className="form-section">
                    <h3>Contact Information</h3>
                    
                    <Form.Item
                        name="phoneNumber"
                        label="Phone Number"
                        rules={[
                            { required: true, message: 'Please enter your phone number' },
                            {
                                pattern: /^[0-9+\-\s()]+$/,
                                message: 'Please enter a valid phone number'
                            }
                        ]}
                    >
                        <Input 
                            placeholder="Enter your phone number"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="address1"
                        label="Address 1"
                        rules={[
                            { required: true, message: 'Please enter your address' }
                        ]}
                    >
                        <Input 
                            placeholder="Enter street address"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="address2"
                        label="Address 2"
                    >
                        <Input 
                            placeholder="Apartment, suite, etc. (optional)"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="city"
                        label="City"
                        rules={[
                            { required: true, message: 'Please enter your city' }
                        ]}
                    >
                        <Input 
                            placeholder="Enter city"
                            size="large"
                        />
                    </Form.Item>

                    <div className="address-row">
                        <Form.Item
                            name="state"
                            label="State"
                            rules={[
                                { required: true, message: 'Please select a state' }
                            ]}
                        >
                            <Select 
                                placeholder="Select state"
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
                                { required: true, message: 'Please enter your ZIP code' },
                                {
                                    pattern: /^\d{5}(-\d{4})?$/,
                                    message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
                                }
                            ]}
                        >
                            <Input 
                                placeholder="Enter ZIP code"
                                size="large"
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Social Media Links</h3>
                    
                    <Form.Item
                        name="socialMediaLinks"
                        label="Social Media Links"
                        rules={[
                            { required: true, message: 'Please enter at least one social media link' }
                        ]}
                    >
                        <Input.TextArea 
                            placeholder="Enter your social media links (one per line, e.g., https://facebook.com/yourpage)"
                            rows={4}
                            size="large"
                        />
                    </Form.Item>
                </div>

                <Form.Item className="form-actions">
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                        size="large"
                        className="submit-button"
                    >
                        Submit Verification
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BusinessVerification;
