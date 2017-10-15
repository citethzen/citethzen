import React, { Component } from 'react';
import { Government } from '../util/contracts';
import { ZERO_ADDRESS } from '../util/constants';
import RegistrationForm from '../components/RegistrationForm';
import { Alert, PageHeader } from 'react-bootstrap';
import Balance from '../components/Balance';
import Contribution from '../components/Contribution';
import ContributionForm from '../components/ContributionForm';


export default class ImmigrantPage extends Component {
  state = {
    accounts: [],
    immigrantContractAddress: null,
    formValue: {},
    formValue2: {}
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

  handleSubmitContribution = async e => {
    e.preventDefault();

    const { formValue2: { tokenAmount, escrowAddress } } = this.state;
    
    try{
      escrowAddress.call.gas(30000).value(tokenAmount)();
      window.alert({message: 'successfully sent a contribution!', type: 'success'});
    } catch (error) {
      console.error(error);
      window.alert({message: `failed to register! #{error.message}`, type: 'danger'});
    }
  }

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
            <label>Your Escrow Address: </label> {immigrantContractAddress}
          </div>
          <div>
            <label>Contract Balance: </label> <Balance address={immigrantContractAddress}/>
          </div>
          <ContributionForm onChange={this.handleChange} value={formValue} onSubmit={this.handleSubmit}/>
        </div>
      </div>
    );

          //generate table: history of contributions
          // return(
          //   <div className="container">
          //   </div>
          // );

          //generate form: allows user to send contributions


  }
}