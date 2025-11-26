
import React ,{useEffect,useState } from 'react';
import { Container } from 'react-bootstrap';

import Transaction from "../components/transaction/transaction";
import TransactionHead from "../components/transaction/transactionHead";
import Spinner from "../utlis/spinner"


/**
 * The TransactionPage component renders the transaction page, including transaction filters
 * and a list of transactions. It utilizes state for managing the selected category and date filters.
 * 
 * A loading state is used to simulate data fetching before rendering the content.
 * 
 * @component
 * @returns {JSX.Element} The rendered transaction page component.
 */

function TransactionPage() {
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
        <TransactionHead setSelectedCategory={setSelectedCategory} setDate={setDate} />
      
          <Transaction selectedCategory={selectedCategory} date={date} />
        
      </Container>
    </div>
  );
}

export default TransactionPage;
