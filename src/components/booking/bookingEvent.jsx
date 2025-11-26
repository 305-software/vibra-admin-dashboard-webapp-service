import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { bookingListDetails } from "../../redux/bookingSlice";
import FormattedDate from "../../utlis/date"
import Card from '../card/tableCard';
import BootstrapCustomTable from '../table/customTable';
/**
 * TableEvent Component
 * 
 * This component displays a table of event bookings. It fetches booking data from the Redux store 
 * and updates the component accordingly. The table supports pagination and allows changing the number 
 * of rows per page.
 * 
 * @component
 * @example
 * return (
 *   <TableEvent selectedCategory="category1" date="2025-02-21" />
 * )
 */

const TableEvent = ({ selectedCategory, date }) => {
    const dispatch = useDispatch();
    const { bookingList, loading, error } = useSelector((state) => state.bookingSlice);
    const { t } = useTranslation();


    const handlePageChange = (newPage) => {
        fetchBookings(newPage, bookingList.pagination?.itemsPerPage || 5);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        fetchBookings(1, newRowsPerPage);
    };

    const fetchBookings = (page, limit) => {
        const payload = {
            eventCategory: selectedCategory || '',
            date: date || '',
            page,
            limit
        };
        dispatch(bookingListDetails(payload));
    };

    useEffect(() => {
        fetchBookings(1, 5);
    }, [selectedCategory, date]);

    const flattenedData = (bookingList?.bookings || []).map((event, index) => ({
        [t("SNO")]: ((bookingList.pagination?.currentPage || 1) - 1) * (bookingList.pagination?.itemsPerPage || 5) + index + 1,
        [t("EVENT_NAME")]: event.eventName,
        [t("CUSTOMER_NAME")]: event.customerName,
        [t("LOCATION")]: event.location,
        [t("BOOKING_DATE")]:<FormattedDate date={event.bookingDate}/>,
        [t("BOOKED_SEAT")]: event.seatsBooked.map((seat, index) =>
            index === 0 ? (seat.startsWith('A') ? seat : `A${seat}`)
                : `A${seat.replace(/[A-Z]/g, '')}`)
            .join(', '),
        [t("STATUS")]: event.paymentStatus,
        [t("PRICE")]: <span style={{ color: 'black', fontWeight: 700 }}>${event.totalPrice.toLocaleString('en-US')}</span>,
    }));

    const headers = [
        t("SNO"),
        t("EVENT_NAME"),
        t("CUSTOMER_NAME"),
        t("LOCATION"),
        t("BOOKING_DATE"),
        t("BOOKED_SEAT"),     
        t("PRICE"), 
        t("STATUS"),
    ];

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
            <div className="booking-main-head">
                {error ? (
                    <div className="alert alert-danger text-center">
                        {error}
                    </div>
                ) : (
                    <BootstrapCustomTable
                        headers={headers}
                        data={flattenedData}
                        rowsPerPage={bookingList?.pagination?.itemsPerPage || 5}
                        currentPage={bookingList?.pagination?.currentPage || 1}
                        totalPages={bookingList?.pagination?.totalPages || 1}
                        totalItems={bookingList?.pagination?.totalItems || 0}
                        loading={loading}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        renderCell={(header, value) =>
                            header === t("STATUS") ? renderStatus(value) : value
                        }
                    />
                )}
            </div>
        </Card>
    );
};

export default TableEvent;