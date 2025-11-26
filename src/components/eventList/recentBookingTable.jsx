/**
 * TableEvent Component
 *
 * This component renders a table displaying event bookings. It checks for valid bookings and
 * presents the relevant details in a structured format using the CustomTable component.
 * If no valid bookings are found, it displays a message indicating that no events are available.
 *
 * @component
 * @example
 * return (
 *   <TableEvent data={eventData} />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - CustomTable: A custom table component for displaying tabular data.
 *
 * @props
 * - data (Object): An object containing event details and seat bookings. Expected structure:
 *   - seatBookings (Array): Array of booking objects, each containing:
 *     - customerName (string): Name of the customer who booked the seats.
 *     - seatsBooked (Array): Array of booked seats.
 *     - totalPrice (number): Total price of the booking.
 *     - paymentStatus (string): Status of the payment (e.g., 'Paid', 'Pending').
 *   - eventName (string): Name of the event.
 *   - eventDate (string): Date of the event in ISO format.
 *   - eventTime (string): Time of the event.
 *   - location (string): Location of the event.
 *   - totalSeats (number): Total number of seats available for the event.
 *
 * @returns {JSX.Element} The rendered TableEvent component displaying a table of bookings or a message if no events are available.
 *
 * @logic
 * - Checks for valid bookings in the provided data.
 * - If no valid bookings exist, displays a message stating "No events available."
 * - Filters and flattens the seat booking data to extract relevant information for the table.
 * - Defines the headers for the table.
 * - Renders the table using the CustomTable component, including a custom cell rendering for the status column.
 */



import React from 'react';
import { useTranslation } from "react-i18next";

import FormattedDate from '../../utlis/date';
import CustomTable from '../table/analyticsTable';

const TableEvent = ({ data }) => {
  const { t } = useTranslation();
  // Check if there are any valid bookings
  const hasValidBookings = data?.seatBookings?.some(
    (booking) =>
      booking.paymentStatus &&
      booking.seatsBooked &&
      booking.seatsBooked.length > 0 &&
      booking.totalPrice
  );

  // If no valid bookings, display 'No events available.'
  if (!data || !hasValidBookings) {
    return (
      <div className="no-details NoEventList">
        <p>{t("NO_BOOKINGS_AVAILABLE")}</p>
      </div>
    );
  }

  // Map bookings that have actual data
  const flattenedData = data.seatBookings
  .filter(booking => 
    booking.paymentStatus && 
    booking.seatsBooked && 
    booking.seatsBooked.length > 0
  )
  .map((booking) => ({
    [t("EVENT_NAME")]: data.eventName,
    [t("CUSTOMER_NAME")]: booking.customerName || 'N/A', // Changed from booking.customerName
    [t("EVENT_DATE")]:<FormattedDate date={data.eventDate}/>,
    [t("EVENT_TIME")]: data.eventTime,
    [t("LOCATION")]: data.location,
    [t("SEATS")]: data.totalSeats,
  
    [t("SOLD")]: booking.seatsBooked?.length || 0,
    [t("STATUS")]: booking.paymentStatus || 'Pending',
    [t("PRICE")]: (
      <span style={{ color: 'black', fontWeight: 700 }}>
        ${booking.totalPrice.toLocaleString('en-US') || 0}
      </span>
    ),
  }));

  
  const headers = [
    t("EVENT_NAME"),
    t("CUSTOMER_NAME"),
    t("EVENT_DATE"),
    t("EVENT_TIME"),
    t("LOCATION"),
    t("SEATS"),   
    t("SOLD"), 
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
    <div className="booking-main-head">
      <CustomTable
        headers={headers}
        data={flattenedData}
        rowsPerPage={5}
        renderCell={(header, value) =>
          header === 'status' ? renderStatus(value) : value
        }
      />
    </div>
  );
};

export default TableEvent;
