import React, { Component } from 'react';
import { Government } from '../util/contracts';
import { ZERO_ADDRESS } from '../util/constants';
import RegistrationForm from '../components/RegistrationForm';
import { Alert, PageHeader } from 'react-bootstrap';
import Balance from '../components/Balance';

export default class ImmigrantPage extends Component {
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

    const immigrantContractAddress = await government.immigrantRegistry(firstAccount);

    this.setState({ immigrantContractAddress });
  }

  handleSubmit = async e => {
    e.preventDefault();

    const { formValue: { firstName, lastName, dateOfBirth, age, occupation, income, password } } = this.state;

    const government = await Government.deployed();

    const dataHash = await government.createHash(firstName, lastName, dateOfBirth, password);

    try {
      const registerTx = await government.register(occupation, age, income, dataHash, {
        from: this.state.accounts[ 0 ],
        gas: 3000000
      });
      window.alert({ message: 'successfully registered!', type: 'success' });

      const { immigrantContractAddress } = registerTx.logs[ 0 ].args;

      this.setState({ immigrantContractAddress });
    } catch (error) {
      console.error(error);
      window.alert({ message: `failed to register! ${error.message}`, type: 'danger' });
    }
  };

  handleChange = formValue => {
    this.setState({ formValue });
  };

  render() {
    const { immigrantContractAddress, formValue } = this.state;

    if (immigrantContractAddress === null) {
      return (<div className="container"><Alert> please wait ... </Alert></div>);
    }

    if (immigrantContractAddress === ZERO_ADDRESS) {
      return (
        <div className="container">
          <PageHeader>Register as an Immigrant</PageHeader>
          <RegistrationForm onChange={this.handleChange} value={formValue} onSubmit={this.handleSubmit}/>
        </div>
      );
    }

    return (
      <div className="container">
        <PageHeader>Your Registration Info</PageHeader>
        <div>
          <div>
            <label>Your Address: </label> {immigrantContractAddress}
          </div>
          <div>
            <label>Balance: </label> <Balance address={immigrantContractAddress}/>
          </div>
        </div>
      </div>
    );
  }
}