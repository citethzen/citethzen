import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import cx from 'classnames';
import Icon from './Icon';

const NavItem = ({ href, ...props }) => (
  <Route path={href} exact>
    {
      ({ match }) => (
        <li role="presentation" className={cx({ active: match !== null })}>
          <Link to={href} {...props}/>
        </li>
      )
    }
  </Route>
);

export default class Menu extends Component {
  render() {
    return (
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">CitEthZen</Link>
          </Navbar.Brand>
          <Navbar.Toggle/>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem href="/government">
              <Icon name="university"/> Government
            </NavItem>
            <NavItem href="/immigrant">
              <Icon name="user-secret"/> Immigrant
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}