
/**
 * Analytics Component - Provides an overview of analytics including sales, categories, trending events, and a donut chart.
 *
 * @component
 * @returns {JSX.Element} The rendered analytics dashboard.
 *
 * @example
 * <Analytics />
 */

import React, { useEffect,useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import Categories from "../components/analytics/categories";
import DonutChart from '../components/analytics/donutChart';
import Overview from "../components/analytics/overview";
import Sales from '../components/analytics/sales';
import TrendingEvent from '../components/analytics/trendingEvent';
import Spinner from "../utlis/spinner"

function Analytics() {
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
                    <Col xxl={12} xl={12} lg={12}>
                        <Overview />
                    </Col>
                </Row>
                <Row>
                    <Col lg={8} md={12}>
                        <Row>
                            <Col lg={12}>
                                <Sales />
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Categories />
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={4} md={12}>
                        <Row>
                            <Col lg={12} md={12}>
                                <DonutChart />
                            </Col>
                            <Col lg={12} md={12}>
                                <TrendingEvent />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Analytics;
