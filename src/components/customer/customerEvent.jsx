import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { customerListDetails } from '../../redux/customerSlice';
import FormattedDate from '../../utlis/date';
import Card from '../card/tableCard';
import CustomTable from '../table/customTable';

/**
 * TableEvent Component
 * 
 * This component displays a table of customer bookings for events. It fetches booking data from the Redux store 
 * and updates the component accordingly. The table supports pagination and allows changing the number 
 * of rows per page.
 * 
 * @component
 * @param {string} selectedCategory - The selected event category to filter bookings.
 * @param {string} date - The selected date to filter bookings.
 * @example
 * return (
 *   <TableEvent selectedCategory="category1" date="2025-02-21" />
 * )
 */

const TableEvent = ({ selectedCategory, date }) => {
    const dispatch = useDispatch();
    const { customerList, pagination, loading } = useSelector((state) => state.customerSlice);
    const { t } = useTranslation();

    const fetchBookings = (page, limit) => {
        const payload = {
            eventCategory: selectedCategory,
            date: date,
            page,
            limit
        };
        dispatch(customerListDetails(payload));
    };

    useEffect(() => {
        fetchBookings(1, 5);
    }, [selectedCategory, date]);

    const flattenedData = customerList?.flatMap((event, index) => ({
        [t("SNO")]: ((pagination.currentPage - 1) * pagination.itemsPerPage) + index + 1,
        [t("CUSTOMER_NAME")]: event.customerName,
        [t("EMAIL")]: event.customerEmail,
        [t("EVENT_NAME")]: event.eventName,
        [t("LOCATION")]: event.location,
        [t("DATE")]:<FormattedDate date={ new Date(event.bookingDate)} />,
        [t("BOOKED")]: event.seatsBooked.map((seat, index) => {
            if (index === 0) {
                return seat.startsWith('A') ? seat : `A${seat}`;
            } else {
                return `A${seat.replace(/[A-Z]/g, '')}`;
            }
        }).join(', '),
        [t("PRICE")]: <span style={{ color: 'black', fontWeight: 700 }}>${event.totalPrice.toLocaleString('en-US')}</span>,
    }));


    const handlePageChange = (newPage) => {
        fetchBookings(newPage, customerList.pagination?.itemsPerPage || 5);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        fetchBookings(1, newRowsPerPage);
    };

    const headers = [
        t("SNO"),
        t("CUSTOMER_NAME"),
        t("EMAIL"),
        t("EVENT_NAME"),
        t("LOCATION"),
        t("DATE"),
        t("BOOKED"),
        t("PRICE")
    ];

    return (
        <Card>
            <div className='booking-main-head'>

                <CustomTable
                    headers={headers}
                    data={flattenedData}
                    rowsPerPage={pagination.itemsPerPage || 5}
                    currentPage={pagination.currentPage || 1}
                    totalPages={pagination.totalPages || 1}
                    totalItems={pagination.totalItems || 0}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    loading={loading}
                />

            </div>
        </Card>
    );
};

export default TableEvent;