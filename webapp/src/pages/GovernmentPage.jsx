import React, { Component } from 'react';
import { Government } from '../util/contracts';
import _ from 'underscore';

export default class GovernmentPage extends Component {
  static propTypes = {};

  state = {
    registrationLogs: []
  };

  componentDidMount() {
    Government.deployed()
      .then(
        instance => instance.LogImmigrantRegistration().get()
      )
      .then(
        registrationLogs => this.setState({ registrationLogs })
      );
  }

  render() {
    const { registrationLogs } = this.state;

    return (
      <div className="container">

        {
          _.map(
            registrationLogs,

            log => {
              return <div>{log.event}</div>
            }
          )
        }

      </div>
    );
  }
}