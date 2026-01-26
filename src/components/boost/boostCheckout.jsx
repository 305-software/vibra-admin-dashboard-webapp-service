/**
 * BoostCheckout Component
 *
 * This component handles the checkout process for boosting events.
 * It allows users to select a boost plan, review details, and complete the payment.
 *
 * @component
 * @example
 * return (
 *   <BoostCheckout eventId="123" />
 * )
 */

import React, { useContext, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserContext } from '../context/userContext';
import Button from '../button/button';
import Card from '../card/tableCard';
import HeadCard from '../card/HeaderCard';
import CustomInput from '../customInput/customInput';

const BoostCheckout = () => {
    const { eventId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [formValues, setFormValues] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        billingAddress: '',
    });
    const [errors, setErrors] = useState({});

    // Boost plans
    const boostPlans = [
        {
            id: 'basic',
            name: t('BOOST_PLAN_BASIC') || 'Basic Boost',
            price: 49.99,
            duration: '7 days',
            features: [
                t('BOOST_FEATURE_HOMEPAGE') || 'Featured on homepage',
                t('BOOST_FEATURE_SEARCH') || 'Priority in search results',
                t('BOOST_FEATURE_EMAIL') || 'Email promotion',
            ]
        },
        {
            id: 'premium',
            name: t('BOOST_PLAN_PREMIUM') || 'Premium Boost',
            price: 99.99,
            duration: '14 days',
            features: [
                t('BOOST_FEATURE_HOMEPAGE') || 'Featured on homepage',
                t('BOOST_FEATURE_SEARCH') || 'Priority in search results',
                t('BOOST_FEATURE_EMAIL') || 'Email promotion',
                t('BOOST_FEATURE_SOCIAL') || 'Social media promotion',
                t('BOOST_FEATURE_BANNER') || 'Banner placement',
            ],
            recommended: true
        },
        {
            id: 'enterprise',
            name: t('BOOST_PLAN_ENTERPRISE') || 'Enterprise Boost',
            price: 199.99,
            duration: '30 days',
            features: [
                t('BOOST_FEATURE_HOMEPAGE') || 'Featured on homepage',
                t('BOOST_FEATURE_SEARCH') || 'Priority in search results',
                t('BOOST_FEATURE_EMAIL') || 'Email promotion',
                t('BOOST_FEATURE_SOCIAL') || 'Social media promotion',
                t('BOOST_FEATURE_BANNER') || 'Banner placement',
                t('BOOST_FEATURE_DEDICATED') || 'Dedicated support',
                t('BOOST_FEATURE_ANALYTICS') || 'Advanced analytics',
            ]
        }
    ];

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // Format card number
        if (name === 'cardNumber') {
            processedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            if (processedValue.length > 19) return;
        }

        // Format expiry date
        if (name === 'expiryDate') {
            processedValue = value.replace(/\D/g, '');
            if (processedValue.length >= 2) {
                processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2, 4);
            }
            if (processedValue.length > 5) return;
        }

        // Limit CVV to 3-4 digits
        if (name === 'cvv') {
            processedValue = value.replace(/\D/g, '').slice(0, 4);
        }

        setFormValues({
            ...formValues,
            [name]: processedValue
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;

        if (!selectedPlan) {
            toast.error(t('PLEASE_SELECT_BOOST_PLAN') || 'Please select a boost plan', {
                autoClose: 3000,
            });
            return false;
        }

        if (!formValues.cardNumber || formValues.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = t('INVALID_CARD_NUMBER') || 'Invalid card number';
            isValid = false;
        }

        if (!formValues.cardHolder || formValues.cardHolder.trim() === '') {
            newErrors.cardHolder = t('CARD_HOLDER_REQUIRED') || 'Card holder name is required';
            isValid = false;
        }

        if (!formValues.expiryDate || formValues.expiryDate.length !== 5) {
            newErrors.expiryDate = t('INVALID_EXPIRY_DATE') || 'Invalid expiry date';
            isValid = false;
        }

        if (!formValues.cvv || formValues.cvv.length < 3) {
            newErrors.cvv = t('INVALID_CVV') || 'Invalid CVV';
            isValid = false;
        }

        if (!formValues.billingAddress || formValues.billingAddress.trim() === '') {
            newErrors.billingAddress = t('BILLING_ADDRESS_REQUIRED') || 'Billing address is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            // Simulate API call for payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const selectedPlanData = boostPlans.find(plan => plan.id === selectedPlan);

            // Here you would make an actual API call to process the boost payment
            // const response = await dispatch(boostEventCheckout({
            //     eventId,
            //     userId: user?.data.user?._id,
            //     planId: selectedPlan,
            //     amount: selectedPlanData.price,
            //     paymentDetails: formValues
            // })).unwrap();

            toast.success(t('BOOST_PURCHASE_SUCCESS') || 'Event boosted successfully!', {
                autoClose: 2000,
            });

            setTimeout(() => {
                navigate('/eventList');
            }, 2000);

        } catch (error) {
            toast.error(error?.message || t('BOOST_PURCHASE_FAILED') || 'Failed to process boost payment', {
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/eventList');
    };

    const selectedPlanData = boostPlans.find(plan => plan.id === selectedPlan);

    return (
        <Container fluid>
            <div className="mb-4">
                <HeadCard>
                    <div className='Header-div'>
                        <h3>{t('BOOST_EVENT_CHECKOUT') || 'Boost Event Checkout'}</h3>
                        <div className='event-button' style={{ display: 'flex', gap: '12px' }}>
                            <Button 
                                onClick={handleCancel}
                                style={{ backgroundColor: '#6c757d', color: '#fff', padding: '10px 18px', width: '150px' }}
                                name={t('CANCEL') || 'Cancel'}
                            />
                            <Button 
                                loading={loading}
                                onClick={handleSubmit}
                                style={{ backgroundColor: '#56D436', color: '#fff', padding: '10px 18px', width: '200px' }}
                                name={t('COMPLETE_PURCHASE') || 'Complete Purchase'}
                            />
                        </div>
                    </div>
                </HeadCard>
            </div>

            <Form onSubmit={handleSubmit}>
                <Row>
                    {/* Boost Plans Section */}
                    <Col lg={8} md={12} className='mb-4'>
                        <Card>
                            <div className='booking-main-head'>
                                <h3 className='mb-4'>{t('SELECT_BOOST_PLAN') || 'Select Boost Plan'}</h3>
                                
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {boostPlans.map((plan) => (
                                        <div
                                            key={plan.id}
                                            onClick={() => handlePlanSelect(plan.id)}
                                            style={{
                                                border: selectedPlan === plan.id ? '2px solid #56D436' : '2px solid #e0e0e0',
                                                borderRadius: '12px',
                                                padding: '24px',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                backgroundColor: selectedPlan === plan.id ? '#f0fff4' : '#fff',
                                            }}
                                        >
                                            {plan.recommended && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-12px',
                                                    right: '20px',
                                                    backgroundColor: '#56D436',
                                                    color: '#fff',
                                                    padding: '4px 16px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}>
                                                    {t('RECOMMENDED') || 'Recommended'}
                                                </div>
                                            )}
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <div>
                                                    <h4 style={{ marginBottom: '8px', fontWeight: '600' }}>{plan.name}</h4>
                                                    <p style={{ color: '#666', marginBottom: '0' }}>{plan.duration}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <h3 style={{ marginBottom: '0', color: '#56D436', fontWeight: '700' }}>
                                                        ${plan.price}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '16px' }}>
                                                <p style={{ fontWeight: '600', marginBottom: '12px' }}>{t('FEATURES') || 'Features'}:</p>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {plan.features.map((feature, index) => (
                                                        <li key={index} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginRight: '8px' }}>
                                                                <circle cx="10" cy="10" r="10" fill="#56D436"/>
                                                                <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        {/* Payment Details Section */}
                        <Card>
                            <div className='booking-main-head'>
                                <h3 className='mb-4'>{t('PAYMENT_DETAILS') || 'Payment Details'}</h3>

                                <Form.Group className="mb-3">
                                    <CustomInput
                                        type="text"
                                        label={t('CARD_NUMBER') || 'Card Number'}
                                        value={formValues.cardNumber}
                                        onChange={handleChange}
                                        name="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                    />
                                    {errors.cardNumber && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.cardNumber}</p>}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <CustomInput
                                        type="text"
                                        label={t('CARD_HOLDER_NAME') || 'Card Holder Name'}
                                        value={formValues.cardHolder}
                                        onChange={handleChange}
                                        name="cardHolder"
                                        placeholder="John Doe"
                                    />
                                    {errors.cardHolder && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.cardHolder}</p>}
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <CustomInput
                                                type="text"
                                                label={t('EXPIRY_DATE') || 'Expiry Date'}
                                                value={formValues.expiryDate}
                                                onChange={handleChange}
                                                name="expiryDate"
                                                placeholder="MM/YY"
                                            />
                                            {errors.expiryDate && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.expiryDate}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <CustomInput
                                                type="text"
                                                label={t('CVV') || 'CVV'}
                                                value={formValues.cvv}
                                                onChange={handleChange}
                                                name="cvv"
                                                placeholder="123"
                                            />
                                            {errors.cvv && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.cvv}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <CustomInput
                                        type="text"
                                        label={t('BILLING_ADDRESS') || 'Billing Address'}
                                        value={formValues.billingAddress}
                                        onChange={handleChange}
                                        name="billingAddress"
                                        placeholder="123 Main St, City, State, ZIP"
                                    />
                                    {errors.billingAddress && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.billingAddress}</p>}
                                </Form.Group>
                            </div>
                        </Card>
                    </Col>

                    {/* Order Summary Section */}
                    <Col lg={4} md={12} className='mb-4'>
                        <Card>
                            <div className='booking-main-head'>
                                <h3 className='mb-4'>{t('ORDER_SUMMARY') || 'Order Summary'}</h3>

                                {selectedPlanData ? (
                                    <div>
                                        <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                            <h5 style={{ marginBottom: '8px', fontWeight: '600' }}>{selectedPlanData.name}</h5>
                                            <p style={{ color: '#666', marginBottom: '8px', fontSize: '14px' }}>
                                                {t('DURATION') || 'Duration'}: {selectedPlanData.duration}
                                            </p>
                                        </div>

                                        <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <span>{t('SUBTOTAL') || 'Subtotal'}:</span>
                                                <span style={{ fontWeight: '600' }}>${selectedPlanData.price}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                <span>{t('TAX') || 'Tax'}:</span>
                                                <span style={{ fontWeight: '600' }}>${(selectedPlanData.price * 0.1).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '2px solid #e0e0e0', paddingTop: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '18px', fontWeight: '700' }}>{t('TOTAL') || 'Total'}:</span>
                                                <span style={{ fontSize: '24px', fontWeight: '700', color: '#56D436' }}>
                                                    ${(selectedPlanData.price * 1.1).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#e7f6fd', borderRadius: '8px', fontSize: '12px', color: '#0c5460' }}>
                                            <strong>{t('NOTE') || 'Note'}:</strong> {t('BOOST_PAYMENT_NOTE') || 'Your event will be boosted immediately after payment confirmation.'}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                        <p>{t('SELECT_PLAN_TO_CONTINUE') || 'Please select a boost plan to continue'}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default BoostCheckout;
