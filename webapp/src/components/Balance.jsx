import { Component } from 'react';
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

  async componentDidMount() {
    this.getBalance(this.props.address);
    this.getSaiBalance(this.props.address);
  }

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      this.getBalance(nextProps.address);
      this.getSaiBalance(nextProps.address);
    }
  }

  render() {
    const { balance, saiBalance } = this.state;
    return `${balance} wei, ${saiBalance} sai`;
  }
} 