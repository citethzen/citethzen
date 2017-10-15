import React, { Component } from 'react';
import { Government, Immigrant } from '../util/contracts';
import { ZERO_ADDRESS } from '../util/constants';
import RegistrationForm from '../components/RegistrationForm';
import { Alert, PageHeader } from 'react-bootstrap';
import Balance from '../components/Balance';
import ContributionForm from '../components/ContributionForm';
import _ from 'underscore';


export default class ImmigrantPage extends Component {
  state = {
    accounts: [],
    immigrantContractAddress: null,
    formValue: {},
    formValue2: {},
    contributionLogs: []
  };

  contributionFilter = null;

  async componentDidMount() {
    const accounts = await window.web3.eth.getAccountsPromise();
    this.setState({ accounts });

    const firstAccount = accounts[ 0 ];

    const government = await Government.deployed();

    const immigrantContractAddress = await government.immigrantRegistry(firstAccount);
    const immigrantContract = Immigrant.at(immigrantContractAddress);

    this.contributionFilter = immigrantContract.LogContribution(null, { fromBlock: 0 });
    this.contributionFilter.watch(
          (error, log) =>
            this.setState(
              state => ({
                contributionLogs: [ log ].concat(state.contributionLogs)
              })
            )
        );
    console.log(this.state.contributionLogs);

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

    console.log(this.state);
    
    try{
      await window.web3.eth.sendTransactionPromise({
        to: this.state.immigrantContractAddress, 
        from: this.state.accounts[ 0 ],
        value: this.state.formValue2.tokenAmount
      });
      window.alert({message: 'successfully sent a contribution!', type: 'success'});
    } catch (error) {
      console.error(error);
      window.alert({message: `failed to register! #{error.message}`, type: 'danger'});
    }
  }

  handleChange = formValue => {
    this.setState({ formValue });
  };

  handleChange2 = formValue2 => {
    this.setState({ formValue2 });
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

    const { formValue2, contributionLogs } = this.state;
    console.log(this.state);
    console.log(contributionLogs);

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
          <ContributionForm onChange={this.handleChange2} value={formValue2} onSubmit={this.handleSubmitContribution}/>
          <h2> Your Contributions </h2>
          <div className = "container">
            <table className="table">
              <thead>
                <tr>
                  <th>Contribution Amount</th>
                </tr>
              </thead>
            <tbody>
              { //put in headers for the table here
                _.map(
                  contributionLogs,
                  (log, ix) => (
                    <tr key={ix}>
                      <td>
                        log
                      </td>
                    </tr>
                  )
                )
              }
            </tbody>
            </table>
          </div>
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