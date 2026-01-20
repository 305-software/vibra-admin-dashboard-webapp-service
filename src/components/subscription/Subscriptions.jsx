import React from 'react';
import { Row, Col, Card, Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './Subscriptions.css';

const Subscriptions = () => {
  const { t } = useTranslation();

  const subscriptionPlans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals and small teams getting started',
      features: [
        'Up to 5 events per month',
        '100 attendees per event',
        'Basic analytics',
        'Email support',
        'Standard event templates'
      ],
      highlighted: false
    },
    {
      name: 'Growth',
      price: '$79',
      period: '/month',
      description: 'Ideal for growing businesses and active organizers',
      features: [
        'Unlimited events',
        '5,000 attendees per event',
        'Advanced analytics',
        'Priority email & chat support',
        'Custom event templates',
        'API access',
        'Automated email reminders'
      ],
      highlighted: true
    },
    {
      name: 'Premium',
      price: '$199',
      period: '/month',
      description: 'For enterprises with advanced needs',
      features: [
        'Unlimited everything',
        'Unlimited attendees',
        'Real-time analytics dashboard',
        '24/7 phone & email support',
        'White-label solutions',
        'Advanced API access',
        'Dedicated account manager',
        'Custom integrations'
      ],
      highlighted: false
    }
  ];

  return (
    <div className='subscriptions-container'>
      <div className='subscriptions-header'>
        <h2>Choose Your Plan</h2>
        <p>Select the perfect plan for your event management needs</p>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {subscriptionPlans.map((plan, index) => (
          <Col key={index} xs={24} sm={24} md={8}>
            <Card
              className={`subscription-card ${plan.highlighted ? 'highlighted' : ''}`}
              hoverable
            >
              <div className='plan-header'>
                <h3 className='plan-name'>{plan.name}</h3>
                <p className='plan-description'>{plan.description}</p>
              </div>

              <div className='plan-price'>
                <span className='price'>{plan.price}</span>
                <span className='period'>{plan.period}</span>
              </div>

              <Button
                type={plan.highlighted ? 'primary' : 'default'}
                size='large'
                block
                className='plan-button'
              >
                Get Started
              </Button>

              <div className='plan-features'>
                <p className='features-title'>Features included:</p>
                <ul>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <CheckOutlined className='feature-icon' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Subscriptions;
