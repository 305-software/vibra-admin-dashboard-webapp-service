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

import React, { useContext, useState, useEffect } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';

import { UserContext } from '../context/userContext';
import Button from '../button/button';
import Card from '../card/tableCard';
import HeadCard from '../card/HeaderCard';
import CustomInput from '../customInput/customInput';
import { fetchBoostPlans } from '../server/services/boost_service';
import { listPaymentMethods, createPaymentIntent } from '../server/services/payment_service';
import '../payment/PaymentMethods.css';

const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SqJ0Fq1qIVJqBiIZJLrmMtXrGX8feY4f0UWEcTyVpFOTkyJ5R94MhLAElgY8ysIR4ccqargwgEj53gEEnXsLD100SJIEhm8Q');

const BoostCheckoutForm = () => {
    const { eventId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [boostPlans, setBoostPlans] = useState([]);
    const [saveCard, setSaveCard] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('new');
    const [formValues, setFormValues] = useState({
        cardHolder: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
    });
    const [errors, setErrors] = useState({});

    // Fetch boost plans from API
    useEffect(() => {
        const loadBoostPlans = async () => {
            try {
                setPlansLoading(true);
                const response = await fetchBoostPlans();
                
                // Transform API response to component format
                const plans = response.data || response;
                const transformedPlans = plans.map(plan => ({
                    id: plan._id || plan.id,
                    name: plan.title,
                    price: plan.price,
                    duration: plan.durationInDays,
                    features: plan.description || [],
                    recommended: plan.isRecommended || false
                }));
                
                setBoostPlans(transformedPlans);
            } catch (error) {
                console.error('Error loading boost plans:', error);
                toast.error(t('FAILED_TO_LOAD_PLANS') || 'Failed to load boost plans', {
                    autoClose: 3000,
                });
            } finally {
                setPlansLoading(false);
            }
        };

        loadBoostPlans();
    }, [t]);

    // Fetch saved payment methods
    useEffect(() => {
        const loadPaymentMethods = async () => {
            try {
                const response = await listPaymentMethods(user?.data?.user?._id);
                const methods = response.data || response;
                
                const transformedMethods = methods.map((method) => ({
                    id: method.id,
                    cardType: method?.brand?.toUpperCase(),
                    last4: method?.last4,
                    expiryDate: method?.expiryDate,
                    isDefault: method.isDefault || false
                }));
                
                setPaymentMethods(transformedMethods);
            } catch (error) {
                console.error('Error loading payment methods:', error);
                // Silently fail - user can still add a new card
            }
        };

        if (user?.data?.user?._id) {
            loadPaymentMethods();
        }
    }, [user]);

    const handlePlanSelect = (planId) => {
        setSelectedPlan(planId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormValues({
            ...formValues,
            [name]: value
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

        if (!formValues.cardHolder || formValues.cardHolder.trim() === '') {
            newErrors.cardHolder = t('CARD_HOLDER_REQUIRED') || 'Card holder name is required';
            isValid = false;
        }

        if (!formValues.address || formValues.address.trim() === '') {
            newErrors.address = t('ADDRESS_REQUIRED') || 'Address is required';
            isValid = false;
        }

        if (!formValues.city || formValues.city.trim() === '') {
            newErrors.city = t('CITY_REQUIRED') || 'City is required';
            isValid = false;
        }

        if (!formValues.state || formValues.state.trim() === '') {
            newErrors.state = t('STATE_REQUIRED') || 'State is required';
            isValid = false;
        }

        if (!formValues.zipcode || formValues.zipcode.trim() === '') {
            newErrors.zipcode = t('ZIPCODE_REQUIRED') || 'Zipcode is required';
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

        if (!stripe || !elements) {
            toast.error(t('STRIPE_NOT_LOADED') || 'Payment system not loaded. Please refresh the page.', {
                autoClose: 3000,
            });
            return;
        }

        setLoading(true);

        try {
            const selectedPlanData = boostPlans.find(plan => plan.id === selectedPlan);
            let paymentMethodId;

            // Check if using saved payment method or creating new one
            if (selectedPaymentMethod === 'new') {
                // Create new payment method with Stripe
                const cardElement = elements.getElement(CardElement);

                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                    billing_details: {
                        name: formValues.cardHolder,
                        address: {
                            line1: formValues.address,
                            city: formValues.city,
                            state: formValues.state,
                            postal_code: formValues.zipcode,
                        },
                    },
                });

                if (error) {
                    toast.error(error.message, {
                        autoClose: 3000,
                    });
                    setLoading(false);
                    return;
                }

                paymentMethodId = paymentMethod.id;
            } else {
                // Use existing saved payment method
                paymentMethodId = selectedPaymentMethod;
            }

            // Combine billing address fields
            const fullBillingAddress = `${formValues.address}, ${formValues.city}, ${formValues.state}, ${formValues.zipcode}`;

            // Calculate total amount in cents (Stripe requires amount in smallest currency unit)
            const amountInCents = Math.round(selectedPlanData.price * 1.1 * 100);

            // Create payment intent
            const paymentIntentData = {
                businessId: user?.data.user?._id,
                amount: amountInCents,
                currency: 'usd',
                paymentMethodId: paymentMethodId,
                metadata: {
                    eventId: eventId,
                    planId: selectedPlan,
                    planName: selectedPlanData.name,
                    savePaymentMethod: selectedPaymentMethod === 'new' ? saveCard : false
                }
            };

            const paymentIntentResponse = await createPaymentIntent(paymentIntentData);
            const { clientSecret } = paymentIntentResponse;

            // Confirm the payment with Stripe
            let confirmResult;
            
            if (selectedPaymentMethod === 'new') {
                // For new payment methods, confirm with card element
                const cardElement = elements.getElement(CardElement);
                confirmResult = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethodId,
                });
            } else {
                // For saved payment methods, confirm with payment method ID
                confirmResult = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethodId,
                });
            }

            if (confirmResult.error) {
                toast.error(confirmResult.error.message, {
                    autoClose: 3000,
                });
                setLoading(false);
                return;
            }

            // Payment successful, now complete the boost process
            const boostData = {
                eventId,
                userId: user?.data.user?._id,
                planId: selectedPlan,
                amount: selectedPlanData.price * 1.1,
                paymentIntentId: confirmResult.paymentIntent.id,
                paymentMethodId: paymentMethodId,
                billingAddress: fullBillingAddress,
                address: formValues.address,
                city: formValues.city,
                state: formValues.state,
                zipcode: formValues.zipcode,
                savePaymentMethod: selectedPaymentMethod === 'new' ? saveCard : false
            };

            await boostEventCheckout(boostData);

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
                        <div className='event-button'>
                            <Button 
                                onClick={handleCancel}
                                style={{ backgroundColor: '#6c757d', color: '#fff', padding: '10px 18px', width: '150px' }}
                                name={t('CANCEL') || 'Cancel'}
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
                                                border: selectedPlan === plan.id ? '3px solid #FF9900' : '2px solid #e0e0e0',
                                                borderRadius: '16px',
                                                padding: '28px',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                backgroundColor: selectedPlan === plan.id ? '#FFF8F0' : '#fff',
                                                boxShadow: selectedPlan === plan.id ? '0 8px 24px rgba(255, 153, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                transform: selectedPlan === plan.id ? 'translateY(-4px)' : 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedPlan !== plan.id) {
                                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedPlan !== plan.id) {
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                                                    e.currentTarget.style.transform = 'none';
                                                }
                                            }}
                                        >
                                            {plan.recommended && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '-14px',
                                                    right: '24px',
                                                    background: 'linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)',
                                                    color: '#fff',
                                                    padding: '6px 20px',
                                                    borderRadius: '20px',
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)',
                                                    letterSpacing: '0.5px',
                                                }}>
                                                    ⭐ {t('RECOMMENDED') || 'Recommended'}
                                                </div>
                                            )}
                                            
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ marginBottom: '8px', fontWeight: '700', fontSize: '22px', color: '#1a1a1a' }}>{plan.name}</h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10"/>
                                                            <polyline points="12 6 12 12 16 14"/>
                                                        </svg>
                                                        <p style={{ color: '#666', marginBottom: '0', fontSize: '15px', fontWeight: '500' }}>{plan.duration + ' days'}</p>
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: 'right', padding: '12px 20px', backgroundColor: selectedPlan === plan.id ? '#FFE5CC' : '#f8f9fa', borderRadius: '12px' }}>
                                                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px', fontWeight: '600' }}>Starting at</div>
                                                    <h3 style={{ marginBottom: '0', color: '#FF9900', fontWeight: '800', fontSize: '28px' }}>
                                                        ${plan.price}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e8e8e8' }}>
                                                <p style={{ fontWeight: '700', marginBottom: '16px', color: '#1a1a1a', fontSize: '16px' }}>{t('FEATURES') || 'Features'}:</p>
                                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                    {plan.features.map((feature, index) => (
                                                        <li key={index} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: '12px', flexShrink: 0 }}>
                                                                <circle cx="12" cy="12" r="11" fill="#56D436" opacity="0.15"/>
                                                                <circle cx="12" cy="12" r="10" fill="#56D436"/>
                                                                <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                            <span style={{ fontSize: '15px', color: '#444', lineHeight: '1.5' }}>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                                        <div style={{ 
                                            marginBottom: '24px', 
                                            padding: '20px', 
                                            background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE5CC 100%)',
                                            borderRadius: '12px',
                                            border: '1px solid #FFE5CC'
                                        }}>
                                            <h5 style={{ marginBottom: '12px', fontWeight: '700', fontSize: '18px', color: '#1a1a1a' }}>{selectedPlanData.name}</h5>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <polyline points="12 6 12 12 16 14"/>
                                                </svg>
                                                <p style={{ color: '#666', marginBottom: '0', fontSize: '15px', fontWeight: '500' }}>
                                                    {t('DURATION') || 'Duration'}: {selectedPlanData.duration + ' days'}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '20px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                                                <span style={{ color: '#666', fontSize: '15px' }}>{t('SUBTOTAL') || 'Subtotal'}:</span>
                                                <span style={{ fontWeight: '600', fontSize: '16px', color: '#1a1a1a' }}>${selectedPlanData.price}</span>
                                            </div>
                                            {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                                                <span style={{ color: '#666', fontSize: '15px' }}>{t('TAX') || 'Tax'} (10%):</span>
                                                <span style={{ fontWeight: '600', fontSize: '16px', color: '#1a1a1a' }}>${(selectedPlanData.price * 0.1).toFixed(2)}</span>
                                            </div> */}
                                        </div>

                                        <div style={{ 
                                            borderTop: '2px solid #FF9900', 
                                            paddingTop: '20px',
                                            background: 'linear-gradient(135deg, #FFF8F0 0%, #FFE5CC 100%)',
                                            padding: '24px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 16px rgba(255, 153, 0, 0.1)',
                                            marginBottom: '24px'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>{t('TOTAL') || 'Total'}:</span>
                                                <span style={{ fontSize: '28px', fontWeight: '800', color: '#FF9900' }}>
                                                    ${(selectedPlanData.price)}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ 
                                            padding: '16px', 
                                            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', 
                                            borderRadius: '12px', 
                                            fontSize: '13px', 
                                            color: '#0d47a1',
                                            border: '1px solid #90CAF9',
                                            lineHeight: '1.6'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginTop: '2px', flexShrink: 0 }}>
                                                    <circle cx="12" cy="12" r="10" stroke="#0d47a1" strokeWidth="2"/>
                                                    <path d="M12 8v4M12 16h.01" stroke="#0d47a1" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                                <div>
                                                    <strong style={{ display: 'block', marginBottom: '4px' }}>{t('NOTE') || 'Note'}:</strong>
                                                    {t('BOOST_PAYMENT_NOTE') || 'Your event will be boosted immediately after payment confirmation.'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                                        <p>{t('SELECT_PLAN_TO_CONTINUE') || 'Please select a boost plan to continue'}</p>
                                    </div>
                                )}
                            </div>
                        </Card>


                        {/* Payment Details Section */}
                        <Card>
                            <div className='booking-main-head'>
                                <h3 className='mb-4'>{t('PAYMENT_DETAILS') || 'Payment Details'}</h3>

                                {paymentMethods.length > 0 && (
                                    <Form.Group className="mb-4">
                                        <label style={{ 
                                            display: 'block', 
                                            marginBottom: '8px', 
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            color: '#1a1a1a'
                                        }}>
                                            {t('SELECT_PAYMENT_METHOD') || 'Select Payment Method'}
                                        </label>
                                        <select
                                            value={selectedPaymentMethod}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '8px',
                                                fontSize: '15px',
                                                backgroundColor: '#fff',
                                                cursor: 'pointer',
                                                color: '#1a1a1a'
                                            }}
                                        >
                                            <option value="new">💳 {t('USE_NEW_PAYMENT_METHOD') || 'Use a new payment method'}</option>
                                            {paymentMethods.map((method) => (
                                                <option key={method.id} value={method.id}>
                                                    {method.cardType} •••• {method.last4} {method.isDefault ? '(Default)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </Form.Group>
                                )}

                                {selectedPaymentMethod === 'new' && (
                                    <>
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

                                        <Form.Group className="mb-3">
                                            <label style={{ 
                                                display: 'block', 
                                                marginBottom: '8px', 
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                color: '#1a1a1a'
                                            }}>
                                                {t('CARD_DETAILS') || 'Card Details'} <span style={{ color: 'red' }}>*</span>
                                            </label>
                                            <div className='stripe-card-element' style={{
                                                padding: '12px',
                                                border: '1px solid #d9d9d9',
                                                borderRadius: '8px',
                                                backgroundColor: '#fff',
                                                transition: 'all 0.3s ease',
                                            }}>
                                                <CardElement
                                                    options={{
                                                        style: {
                                                            base: {
                                                                fontSize: '16px',
                                                                color: '#424770',
                                                                '::placeholder': {
                                                                    color: '#aab7c4',
                                                                },
                                                            },
                                                            invalid: {
                                                                color: '#9e2146',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </Form.Group>
                                    </>
                                )}

                                {selectedPaymentMethod === 'new' && (
                                    <>
                                        <Form.Group className="mb-3">
                                    <CustomInput
                                        type="text"
                                        label={t('ADDRESS') || 'Address'}
                                        value={formValues.address}
                                        onChange={handleChange}
                                        name="address"
                                        placeholder="123 Main St"
                                    />
                                    {errors.address && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.address}</p>}
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <CustomInput
                                                type="text"
                                                label={t('CITY') || 'City'}
                                                value={formValues.city}
                                                onChange={handleChange}
                                                name="city"
                                                placeholder="New York"
                                            />
                                            {errors.city && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.city}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <CustomInput
                                                type="text"
                                                label={t('STATE') || 'State'}
                                                value={formValues.state}
                                                onChange={handleChange}
                                                name="state"
                                                placeholder="NY"
                                            />
                                            {errors.state && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.state}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <CustomInput
                                        type="text"
                                        label={t('ZIP_CODE') || 'Zipcode'}
                                        value={formValues.zipcode}
                                        onChange={handleChange}
                                        name="zipcode"
                                        placeholder="10001"
                                    />
                                    {errors.zipcode && <p style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{errors.zipcode}</p>}
                                </Form.Group>
                                    </>
                                )}

                                {selectedPaymentMethod === 'new' && paymentMethods.length < 2 && (
                                <div style={{ 
                                    marginTop: '24px', 
                                    marginBottom: '16px',
                                    padding: '16px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <label style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        cursor: 'pointer',
                                        margin: 0
                                    }}>
                                        <input 
                                            type="checkbox"
                                            checked={saveCard}
                                            onChange={(e) => setSaveCard(e.target.checked)}
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                marginRight: '12px',
                                                cursor: 'pointer',
                                                accentColor: '#FF9900'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <span style={{ 
                                                fontWeight: '600', 
                                                fontSize: '15px',
                                                color: '#1a1a1a',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#56D436" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                                    <line x1="1" y1="10" x2="23" y2="10"/>
                                                </svg>
                                                {t('SAVE_CARD_FOR_FUTURE') || 'Save this card for future payments'}
                                            </span>
                                            <p style={{ 
                                                margin: '4px 0 0 0', 
                                                fontSize: '13px', 
                                                color: '#666',
                                                lineHeight: '1.4'
                                            }}>
                                                {t('SAVE_CARD_DESC') || 'Your card will be securely saved for faster checkout next time'}
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                )}

                                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleSubmit}
                                        style={{ 
                                            backgroundColor: loading ? '#FFBB66' : '#FF9900',
                                            color: '#fff', 
                                            padding: '12px 32px', 
                                            width: '100%',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 12px rgba(255, 153, 0, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.backgroundColor = '#FFB84D';
                                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 153, 0, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!loading) {
                                                e.currentTarget.style.backgroundColor = '#FF9900';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 153, 0, 0.3)';
                                            }
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                                                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round"/>
                                                </svg>
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                                </svg>
                                                <span>{t('COMPLETE_PURCHASE') || 'Complete Purchase'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <style>
                                    {`
                                        @keyframes spin {
                                            from { transform: rotate(0deg); }
                                            to { transform: rotate(360deg); }
                                        }
                                    `}
                                </style>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

const BoostCheckout = () => {
    return (
        <Elements stripe={stripePromise}>
            <BoostCheckoutForm />
        </Elements>
    );
};

export default BoostCheckout;
