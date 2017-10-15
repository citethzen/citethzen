import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SAI } from '../util/contracts';

export default class Balance extends Component {
  state = {
    balance: '',
    saiBalance: ''
  };

  static propTypes = {
    address: PropTypes.string.isRequired
  };

  timer = null;

  async componentDidMount() {
    this.fetchBalances();

    this.timer = setInterval(this.fetchBalances, 1000);
  }

  fetchBalances = () => {
    this.getBalance(this.props.address);
    this.getSaiBalance(this.props.address);
  };

  async getBalance(address) {
    this.setState({
      balance: await window.web3.eth.getBalancePromise(address)
    });
  }

  async getSaiBalance(address) {
    const sai = await SAI.deployed();
    this.setState({
      saiBalance: await sai.balanceOf(address)
    });
  }

  render() {
    const { balance, saiBalance } = this.state;
    return <span>{balance.toString()} <strong>wei</strong>, {saiBalance.toString()} <strong>sai</strong></span>;
  }
} 