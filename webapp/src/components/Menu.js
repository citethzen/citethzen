import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link, Route } from 'react-router-dom';
import cx from 'classnames';
import Icon from './Icon';
import Balance from './Balance';

const NavItem = ({ href, activeHref, activeKey, ...props }) => (
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
  state = {
    accounts: null
  };


  componentDidMount() {
    this.getAccounts();
    setInterval(this.getAccounts, 1000);
  }

  getAccounts = () => {
    window.web3.eth.getAccountsPromise()
      .then(accounts => {
        this.setState({ accounts });
      });
  };

  render() {
    const { accounts } = this.state;

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
          <Navbar.Text pullRight>
            {
              accounts !== null && accounts.length > 0 ? (
                <span>
                  <em style={{ opacity: 0.3 }}>{accounts[ 0 ]}</em> <strong>My Balance: </strong> <Balance
                  address={accounts[ 0 ]}/>
                </span>
              ) : null
            }
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}