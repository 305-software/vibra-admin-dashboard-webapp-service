import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { fetchTransactionList } from '../../redux/transactionSlice';
import Card from '../card/tableCard';
import CustomTable from '../table/customTable';

/**
 * TableEvent component renders a table displaying transaction data 
 * based on selected event category and date.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.selectedCategory - Selected event category filter.
 * @param {string} props.date - Selected date filter.
 * @returns {JSX.Element} The rendered TableEvent component.
 */
const TableEvent = ({ selectedCategory, date }) => {
  const dispatch = useDispatch();
  const { transactionList = [], pagination, loading } = useSelector((state) => state.transactionSlice);
  const { t } = useTranslation();
  const fetchBookings = (page = 1, limit = 5) => {
    dispatch(fetchTransactionList({
      eventCategory: selectedCategory || undefined,
      date: date || undefined,
      page,
      limit
    }));
  };

  useEffect(() => {
    fetchBookings(1, 5);
  }, [selectedCategory, date]);

  const flattenedData = Array.isArray(transactionList) ? transactionList.map((event, index) => {
    try {
      return {
        [t("SNO")]: ((pagination?.currentPage || 1) - 1) * (pagination?.itemsPerPage || 5) + index + 1,
        [t("EVENT_NAME")]: event?.eventName || 'N/A',
        [t("CUSTOMER_NAME")]: event?.customerName || 'N/A',
        [t("SEAT_BOOKED")]: Array.isArray(event?.seatsBooked)
          ? event.seatsBooked.map((seat, idx) => {
            return idx === 0 ? (seat.startsWith('A') ? seat : `A${seat}`) : `A${seat.replace(/[A-Z]/g, '')}`;
          }).join(', ')
          : 'N/A',
        [t("STATUS")]: event?.paymentStatus || 'N/A',
        [t("TOTAL_AMOUNT")]: <span style={{ color: 'black', fontWeight: 700 }}>${event?.totalPrice.toLocaleString('en-US') || 0}</span>,
      };
    } catch (error) {
      console.error('Error processing event:', error);
      return null;
    }
  }).filter(Boolean) : [];




  const headers = [
    t("SNO"),
    t("EVENT_NAME"),
    t("CUSTOMER_NAME"),
    t("SEAT_BOOKED"),   
    t("TOTAL_AMOUNT"),
    t("STATUS"),
  ];

  const handlePageChange = (newPage) => {
    fetchBookings(newPage, pagination?.itemsPerPage || 5);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    fetchBookings(1, newRowsPerPage);
  };

  const renderStatus = (status) => {
    const displayStatus = status || 'Pending';
    return (
      <span className={`status-${displayStatus.toLowerCase()}`}>
        {displayStatus}
      </span>
    );
  };

  return (
    <Card>
      <div className='booking-main-head'>
        <CustomTable
          headers={headers}
          data={flattenedData}
          rowsPerPage={pagination?.itemsPerPage || 5}
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          totalItems={pagination?.totalItems || 0}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          loading={loading}
          renderCell={(header, value) =>
            header === 'status' ? renderStatus(value) : value
          }
        />
      </div>
    </Card>
  );
};

export default TableEvent;