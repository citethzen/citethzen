import React, { Component } from 'react';
import { Jumbotron } from 'react-bootstrap';

export default class HomePage extends Component {
  render() {
    return (
      <div className="container">
        <Jumbotron>
          <h1>CitEthZen</h1>
          <p className="lead">
            CitEthZen is a system for accepting taxes from undocumented immigrants in exchange for naturalization.
          </p>
        </Jumbotron>
      </div>
    );
  }
}