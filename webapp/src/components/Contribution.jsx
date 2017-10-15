import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Immigrant} from '../util/contracts';

//Takes address and spits out the contributions to that address
export default class Contributions extends Component {
  state = {
    logs: []
  };

  static propTypes = {
    address: PropTypes.string.isRequired
  };

  async componentDidMount() {
    const immigrantContract = await Immigrant.deployed();
    const filter = immigrantContract.LogContribution();
    filter.get((error, logs) => this.setState({logs}));

    this.getContributions(this.props.address);
  }

  async getContributions(address) {
    this.setState({
        logs: await window.web3.eth.getContributionsPromise(address)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      this.getContributions(nextProps.address);
    }
  }

  render() {
    const{logs} = this.state;
    console.log(logs);
    return {logs};
  }
} 