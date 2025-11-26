/**
 * EventList Component
 *
 * This component displays a list of transactions for events, showing details such as event name,
 * customer name, booking date, payment status, and refund information. It fetches transaction data
 * from the Redux store based on the selected category and date.
 *
 * @component
 * @example
 * return (
 *   <EventList selectedCategory="Concert" date="2024-12-28" />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - { useEffect } from 'react': React hook for managing side effects.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with Redux store.
 * - { fetchTransactionList } from '../../redux/transactionSlice': Action to fetch transaction data.
 * - Card: A component for displaying a card layout.
 *
 * @functions
 * - getPaymentStatusIcon: Returns an icon based on the payment status and refund status.
 * - getPaymentStatusColor: Returns a color based on the payment status and refund status.
 *
 * @props
 * - selectedCategory (string): The category selected by the user to filter transactions.
 * - date (string): The date used to filter transactions.
 *
 * @effects
 * - useEffect: Fetches transaction data whenever the selected category or date changes.
 *
 * @returns {JSX.Element} The rendered EventList component displaying a list of transactions.
 */




import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { fetchTransactionList } from '../../redux/transactionSlice';
import * as constant from "../../utlis/constant";
import FormattedDate from "../../utlis/date"
import Card from '../card/card';
const getPaymentStatusIcon = (status, hasRefund) => {
  if (status === constant.PAID) {
    return <span className="arrow up"></span>;
  } else if (hasRefund) {
    return <span className="arrow down"></span>;
  } else {
    return <span className="arrow down"></span>;
  }
};

const getPaymentStatusColor = (status, hasRefund) => {
  if (status === constant.PAID) {
    return 'green';
  } else if (hasRefund) {
    return 'blue';
  } else {
    return 'rgba(231, 28, 28, 1)';
  }
};

const EventList = ({ selectedCategory, date }) => {
  const dispatch = useDispatch();
  const { transactionList, loading } = useSelector((state) => state.transactionSlice) || [];
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchTransactionList(selectedCategory, date));
    };
    fetchData();
  }, [dispatch, selectedCategory, date]);

  const events = transactionList.map((event) => ({
    [constant.NAME]: event.eventName,
    [constant.CUSTOMER]: event.customerName,
    [constant.AMOUNT]: event.totalPrice.toLocaleString('en-US'),
    [constant.TIME]:  <FormattedDate date={event.bookingDate}/>,
    [constant.SEAT_BOOKED]: event.seatsBooked.join(', '),
    [constant.STATUS]: event.paymentStatus,
    [constant.HASREFUNDED]: event.hasRefund,
    [constant.REFUNDAMOUNT]: event.refundAmount,
  }));

  return (
    <div className="mb-4">
      <Card loading={loading} className="event-height-div">
        <div className='event-Containers-recent'>
          <h3>{t("TRANSACTIONS")}</h3>
        </div>

        <div className='event-height' style={{ overflowY: 'scroll' }}>

          <div className="event-list">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div
                  key={index}
                  className={`event-Containers-list event-item ${event.status === constant.PAID ? 'positive' : 'negative'
                    }`}
                >
                  <div className="d-flex justify-content-center ">
                    <div
                      className="event-icon"
                      style={{
                        backgroundColor: getPaymentStatusColor(event.status, event.hasRefund),
                      }}
                    >
                      {getPaymentStatusIcon(event.status, event.hasRefund)}
                    </div>
                    <div className="event-details">
                      <h5 className='mb-2 transaction-name'>{event.Name}</h5>
                      <h6 className='view-more transaction-customer'>{event.Customers}</h6>
                    </div>
                  </div>
                  <div>
                    <p className="event-time mb-1">{event.Time}</p>
                    <div
                      className="event-amount"
                      style={{
                        color: getPaymentStatusColor(event.status, event.hasRefund),
                      }}
                    >
                      $ {event.Amount}
                    </div>
                    {event.hasRefund && (
                      <div className="event-refund" style={{ color: 'rgba(231, 28, 28, 1)' }}>
                        $ {event.refundAmount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-transactions">
                <p>{t("NO_TRANSACTIONS_AVAILABLE")}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventList;
