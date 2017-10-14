import React, { Component } from 'react';
import { Government } from '../util/contracts';
import _ from 'underscore';
import { ZERO_ADDRESS } from '../util/constants';
import RegistrationForm from '../components/RegistrationForm';
import { PageHeader } from 'react-bootstrap';

export default class ImmigrantPage2 extends Component {
  state = {
    accounts: [],
    immigrantContractAddress: null,
    formValue: {}
  };

  async componentDidMount() {
    const accounts = await window.web3.eth.getAccountsPromise();
    this.setState({ accounts });

    const firstAccount = accounts[ 0 ];

    const government = await Government.deployed();

    // debug print the logs
    const filter = government.LogImmigrantRegistration();
    const logs = filter.get((error, logs) => console.log(error, logs));

    const immigrantContractAddress = await government.immigrantRegistry(firstAccount);

    this.setState({ immigrantContractAddress });
  }

  handleSubmit = async e => {
    e.preventDefault();

    const { formValue: { firstName, lastName, dateOfBirth, age, occupation, income, password } } = this.state;

    const government = await Government.deployed();

    const dataHash = await government.createHash(firstName, lastName, dateOfBirth, password);

    const registerTx = await government.register(occupation, age, income, dataHash, {
      from: this.state.accounts[ 1 ],
      gas: 3000000
    });

    console.log(registerTx);
  };

  handleChange = formValue => {
    this.setState({ formValue });
  };

  render() {
    const { accounts, immigrantContractAddress, formValue } = this.state;

    if (immigrantContractAddress === ZERO_ADDRESS) {
      return (
        <div className="container">
          <PageHeader>Immigration Registration</PageHeader>
          <RegistrationForm onChange={this.handleChange} value={formValue} onSubmit={this.handleSubmit}/>
        </div>
      );
    }

    return (
      <div className="container">
        <div>{immigrantContractAddress}</div>
      </div>
    );
  }
}