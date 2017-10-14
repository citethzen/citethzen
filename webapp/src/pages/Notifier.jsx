import React, { Component } from 'react';
import { Alert, AlertContainer } from 'react-bs-notifier';
import _ from 'underscore';

export default class Notifier extends Component {
  state = {
    alerts: []
  };

  componentDidMount() {
    window.alert = this.handleAlert;
  }

  handleAlert = alt => {
    if (typeof alt === 'string') {
      this.setState({
        alerts: [ { message: alt, type: 'info' }, ...this.state.alerts ]
      });
    } else {
      this.setState({
        alerts: [ alt, ...this.state.alerts ]
      });
    }
  };

  handleDismiss = alt => {
    this.setState({
      alerts: _.without(this.state.alerts, alt)
    });
  };

  render() {
    const { alerts } = this.state;

    console.log(alerts);

    return (
      <AlertContainer>
        {
          _.map(
            alerts,
            (alt, ix) => (
              <Alert key={ix} type={alt.type} onDismiss={() => this.handleDismiss(alt)}>{alt.message}</Alert>
            )
          )
        }
      </AlertContainer>
    );
  }
}