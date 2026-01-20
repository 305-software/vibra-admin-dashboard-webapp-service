import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm, Checkbox } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { setupIntent, addPaymentMethod, listPaymentMethods, deletePaymentMethod } from '../server/services/payment_service';
import { useContext } from 'react';
import { UserContext } from '../context/userContext';
import './PaymentMethods.css';

const stripePromise = loadStripe(import.meta.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51SqJ0QFq1qIVJqBiIZJLrmMtXrGX8feY4f0UWEcTyVpFOTkyJ5R94MhLAElgY8ysIR4ccqargwgEj53gEEnXsLD100SJIEhm8Q');

// Error handler for Stripe loading
stripePromise.then(stripe => {
  if (!stripe) {
    console.error('Stripe failed to load. Check your publishable key.');
  }
}).catch(err => {
  console.error('Error loading Stripe:', err);
});

const PaymentMethodsForm = ({ form, isModalVisible, editingId, paymentMethods, onCancel, onSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (!editingId && stripe && elements) {
        // Get setup intent for this customer
        const setupIntentResponse = await setupIntent(user?.data?.user?._id);
        
        // Confirm setup with card element
        const { setupIntent: confirmedSetupIntent, error } = await stripe.confirmCardSetup(
          setupIntentResponse.data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: values.cardHolder,
              },
            },
          }
        );

        if (error) {
          message.error(error.message);
          setLoading(false);
          return;
        }

        values.paymentMethodId = confirmedSetupIntent.payment_method;
        values.stripeSetupIntentId = confirmedSetupIntent.id;
      }

      await onSubmit(values);
      setLoading(false);
    } catch (error) {
      console.error('Form submission error:', error);
      message.error(error.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingId ? 'Edit Payment Method' : 'Add Payment Method'}
      visible={isModalVisible}
      onCancel={onCancel}
      width={500}
      footer={[
        <Button key='back' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='submit' type='primary' loading={loading} onClick={handleFormSubmit}>
          {editingId ? 'Update' : 'Add'} Payment Method
        </Button>,
      ]}
    >
      <Form form={form} layout='vertical' autoComplete='off'>
        <Form.Item
          name='cardHolder'
          label='Card Holder Name'
          rules={[{ required: true, message: 'Please enter card holder name' }]}
        >
          <Input placeholder='e.g., John Doe' />
        </Form.Item>

        {!editingId && (
          <Form.Item label='Card Details' required>
            <div className='stripe-card-element'>
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
          </Form.Item>
        )}

        {editingId && (
          <>
            <Form.Item
              name='cardNumber'
              label='Card Number'
              rules={[{ required: true, message: 'Please enter card number' }]}
            >
              <Input placeholder='e.g., **** **** **** 4242' disabled />
            </Form.Item>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Form.Item
                name='expiryDate'
                label='Expiry Date'
                rules={[{ required: true, message: 'Please enter expiry date' }]}
              >
                <Input placeholder='MM/YY' disabled />
              </Form.Item>

              <Form.Item
                name='cardType'
                label='Card Type'
                rules={[{ required: true, message: 'Please select card type' }]}
              >
                <Input placeholder='Card type' disabled />
              </Form.Item>
            </div>
          </>
        )}

        <Form.Item
          name='isDefault'
          valuePropName='checked'
        >
          <Checkbox>Set as Default</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PaymentMethodsContent = () => {
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await listPaymentMethods(user?.data?.user?._id);
        
        const defaultPaymentMethodId = response.defaultPaymentMethodId;
        const methods = response.data || response;
        
        const transformedMethods = methods.map((method) => ({
          id: method.id,
          cardType: method?.brand.toUpperCase(),
          cardHolder: method?.cardholderName || 'N/A',
          last4: method?.last4,
          expiryDate: `${method?.expiryDate}`,
          isDefault: method.id === defaultPaymentMethodId,
          createdAt: new Date(method.createdAt)
        }));
        
        setPaymentMethods(transformedMethods);
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
        message.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    if (user?.data?.user?._id) {
      fetchPaymentMethods();
    }
  }, [user]);

  const handleAddClick = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditClick = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      cardHolder: record.cardHolder,
      cardNumber: record.cardNumber,
      expiryDate: record.expiryDate,
      cardType: record.cardType,
      isDefault: record.isDefault
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePaymentMethod(id, user?.data?.user?._id);
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      message.success('Payment method deleted successfully');
    } catch (error) {
      message.error(error.message || 'Failed to delete payment method');
    }
  };

  const handleModalOk = async (values) => {
    if (editingId) {
      // Edit existing
      setPaymentMethods(paymentMethods.map(method =>
        method.id === editingId
          ? { ...method, ...values }
          : method
      ));
      message.success('Payment method updated successfully');
    } else {
      // Add new - call backend API
      try {
        const paymentData = {
          businessId: user?.data?.user?._id,
          paymentMethodId: values.paymentMethodId,
          // setupIntentId: values.stripeSetupIntentId,
          // cardHolder: values.cardHolder,
          isDefault: values.isDefault || false
        };

        const response = await addPaymentMethod(paymentData);
        
        const newId = Math.max(...paymentMethods.map(m => m.id), 0) + 1;
        setPaymentMethods([
          ...paymentMethods,
          {
            id: newId,
            ...values,
            isDefault: values.isDefault || false
          }
        ]);
        message.success('Payment method added successfully');
      } catch (error) {
        message.error(error.message || 'Failed to add payment method');
      }
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Card Holder',
      dataIndex: 'cardHolder',
      key: 'cardHolder',
      width: '20%'
    },
    {
      title: 'Card Number',
      dataIndex: 'last4',
      key: 'last4',
      width: '20%',
      render: (last4) => `**** **** **** ${last4}`
    },
    {
      title: 'Card Type',
      dataIndex: 'cardType',
      key: 'cardType',
      width: '15%',
      render: (text) => (
        <span className='card-type-badge'>{text}</span>
      )
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: '15%'
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: '10%',
      render: (isDefault) => (
        <span className={isDefault ? 'default-badge active' : 'default-badge'}>
          {isDefault ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space size='small'>
          <Button
            type='primary'
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title='Delete Payment Method'
            description='Are you sure you want to delete this payment method?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button
              type='primary'
              danger
              size='small'
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className='payment-methods-container'>
      <div className='payment-methods-header'>
        <h2>Payment Methods</h2>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={handleAddClick}
          size='large'
          disabled={paymentMethods.length >= 2}
        >
          Add Payment Method
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={paymentMethods}
        rowKey='id'
        pagination={false}
        loading={loading}
        className='payment-methods-table'
      />

      <PaymentMethodsForm
        form={form}
        isModalVisible={isModalVisible}
        editingId={editingId}
        paymentMethods={paymentMethods}
        onCancel={handleModalCancel}
        onSubmit={handleModalOk}
      />
    </div>
  );
};

const PaymentMethods = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentMethodsContent />
    </Elements>
  );
};

export default PaymentMethods;
