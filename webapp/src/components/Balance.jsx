import { Component } from 'react';
import PropTypes from 'prop-types';

export default class Balance extends Component {
  state = {
    balance: ''
  };

  static propTypes = {
    address: PropTypes.string.isRequired
  };

  async componentDidMount() {
    this.getBalance(this.props.address);
  }

  async getBalance(address) {
    this.setState({
      balance: await window.web3.eth.getBalancePromise(address)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      this.getBalance(nextProps.address);
    }
  }

  render() {
    return `${this.state.balance} wei`;
  }
} 