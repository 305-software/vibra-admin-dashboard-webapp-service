/**
 * Dashboard Component - Displays an overview of sales, tickets, events, and transactions.
 *
 * @component
 * @returns {JSX.Element} The rendered dashboard page.
 *
 * @example
 * <Dashboard />
 */

import React , { useEffect,useState } from 'react';
import { Col, Container, Row } from "react-bootstrap";

import Calender from "../components/calender/calender";
import LatestSales from "../components/dashboard/latestSales";
import OverView from "../components/dashboard/overView";
import PieChart from "../components/dashboard/pieChart";
import RecentEvent from "../components/dashboard/recentEvent";
import Sales from "../components/dashboard/sales";
import TicketSoldByToday from "../components/dashboard/ticketSoldByToday";
import TotalTicket from "../components/dashboard/totalTicket";
import Transaction from "../components/dashboard/transaction";
import Spinner from "../utlis/spinner"

const Dashboard = () => {
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
        <Row className='mt-4'>
          <Col xxl={9} xl={8} lg={8} md={12} xs={12}>
            <Row>
              <Col xl={9} lg={12} md={9}>
                <OverView />
              </Col>

              <Col xl={3} lg={12} md={3}  className="ps-0">
                <TicketSoldByToday />
              </Col>
            </Row>

            <Row>
              <Col xxl={7} xl={7} lg={12} md={12} xs={12}>
                <PieChart />
              </Col>

              <Col xxl={5} xl={5} lg={12} md={12} xs={12} >
                <TotalTicket />
              </Col>
            </Row>

            <Row>
              <Col lg={12} >
                <Sales />
              </Col>
            </Row>

            <Row>
              <Col xxl={5} xl={6} lg={12} md={12} xs={12}>
                <Transaction />
              </Col>
              <Col xxl={7} xl={6} lg={12} md={12} xs={12} >
                <RecentEvent />
              </Col>
            </Row>
          </Col>

          <Col xxl={3} xl={4} lg={4} md={12} xs={12}>
            <Row>
              <Col>
                <LatestSales />
              </Col>
            </Row>
            <Row>
              <Calender />
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
