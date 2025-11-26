/**
 * Customer Component - Displays customer-related events and data filtering options.
 *
 * @component
 * @returns {JSX.Element} The rendered customer page.
 *
 * @example
 * <Customer />
 */


import React, { useEffect,useState  } from 'react';
import { Container } from 'react-bootstrap';

import CustomerEvent from "../components/customer/customerEvent";
import CustomerTable from "../components/customer/customerHead";
import Spinner from "../utlis/spinner"

function Customer() {
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
        <CustomerTable setSelectedCategory={setSelectedCategory} setDate={setDate} />
      
          <CustomerEvent selectedCategory={selectedCategory} date={date} />
        
      </Container>
    </div>
  );
}

export default Customer;
