/**
 * LeftTabsExample Component
 * 
 * This component provides a tabbed navigation interface using React Bootstrap. 
 * It allows users to switch between different sections: Users, Roles, and Master.
 * 
 * @component
 * @returns {JSX.Element} The rendered LeftTabsExample component.
 * 
 * @dependencies
 * - React Bootstrap (Container, Row, Col, Nav, Tab)
 * - i18next (Translation support)
 * - Custom components: UserTable, RoleManagement, Master
 * 
 * @example
 * <LeftTabsExample />
 * 
 * @state
 * - Uses Bootstrap's Tab.Container to manage active tabs.
 * 
 */


import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import { useTranslation } from "react-i18next";

import RoleManagement from '../roleManagement/roleManage';
import UserTable from '../user/userTable';
import Master from "./Master/index"

function LeftTabsExample() {
  const { t } = useTranslation();
  return (
    <Container fluid>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">

        <Row className='' >
          <Col className='sidetab' sm={2} >
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">{t("USERS")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">{t("ROLES")}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">{t("MASTER")}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10}>
            <Tab.Content>
              <Tab.Pane eventKey="first"><UserTable /></Tab.Pane>
              <Tab.Pane eventKey="second"><RoleManagement /></Tab.Pane>
              <Tab.Pane eventKey="third"><Master /></Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>

  );
}

export default LeftTabsExample;