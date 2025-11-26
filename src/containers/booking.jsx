
/**
 * Booking Component - Manages booking events with category and date filters.
 *
 * @component
 * @returns {JSX.Element} The rendered booking page.
 *
 * @example
 * <Booking />
 */

import React, { useEffect,useState  } from 'react';
import { Container } from 'react-bootstrap';

import BookingEvent from "../components/booking/bookingEvent";
import BookingHead from "../components/booking/bookingHead";
import Spinner from "../utlis/spinner"

function Booking() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Simulate data fetching
      setTimeout(() => {
          setLoading(false);
      }, 1000);
  }, []);

  if (loading) {
      return <Spinner />;
  }

  return (
    <div>
      <Container fluid>
        <BookingHead setSelectedCategory={setSelectedCategory} setDate={setDate} />
      
          <BookingEvent selectedCategory={selectedCategory} date={date} />
        
      </Container>
    </div>
  );
}

export default Booking;
