/**
 * EventList Component - Manages the display of events in different views (Dashboard, Grid, Calendar).
 *
 * @component
 * @returns {JSX.Element} The rendered EventList component.
 *
 * @example
 * <EventList />
 */

import React ,{useEffect,useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Calender from "../components/eventList/calender";
import CalenderEvent from "../components/eventList/calenderEvent";
import EventDetails from '../components/eventList/eventDetails';
import EventHead from '../components/eventList/eventHead';
import TableEvent from '../components/eventList/tableEvent';
import Spinner from "../utlis/spinner"

function EventList() {
  const [view, setView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [calender, setCalender] = useState('');

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
        <EventHead view={view} setView={setView} setSelectedCategory={setSelectedCategory} />
        
  
          <>
            {view === 'dashboard' && (
              <Row>
                <Col lg={8} md={6}>
                  <EventDetails selectedCategory={selectedCategory} calender={calender} />
                </Col>
                <Col lg={4} md={6}>
                  <Calender setCalender={setCalender} />
                </Col>
              </Row>
            )}

            {view === 'grid' && (
              <Container fluid>
                <Row>
                  <Col lg={8} md={6}>
                    <TableEvent selectedCategory={selectedCategory} calender={calender} />
                  </Col>
                  <Col lg={4} md={6}>
                    <Calender setCalender={setCalender} />
                  </Col>
                </Row>
              </Container>
            )}

            {view === 'calendar' && (
              <Row>
                <Col>
                  <CalenderEvent />
                </Col>
              </Row>
            )}
          </>
        
      </Container>
    </div>
  );
}

export default EventList;
