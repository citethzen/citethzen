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

  _lastId = 0;

  handleAlert = alt => {
    if (typeof alt === 'string') {
      this.setState({
        alerts: [ { id: this._lastId++, message: alt, type: 'info' }, ...this.state.alerts ]
      });
    } else {
      this.setState({
        alerts: [ { type: 'info', ...alt, id: this._lastId++ }, ...this.state.alerts ]
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

    return (
      <AlertContainer>
        {
          _.map(
            alerts,
            (alt, ix) => (
              <Alert key={alt.id} type={alt.type} onDismiss={() => this.handleDismiss(alt)}>{alt.message}</Alert>
            )
          )
        }
      </AlertContainer>
    );
  }
}