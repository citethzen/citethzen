import React, { Component } from 'react';
import { Government, Immigrant, SAI } from '../util/contracts';
import { STATUS_NAMES, ZERO_ADDRESS } from '../util/constants';
import RegistrationForm from '../components/RegistrationForm';
import { Alert, PageHeader } from 'react-bootstrap';
import Balance from '../components/Balance';
import ContributionForm from '../components/ContributionForm';
import _ from 'underscore';
import SaiContributionForm from '../components/SaiContributionForm';


export default class ImmigrantPage extends Component {
  state = {
    accounts: [],
    immigrantContractAddress: null,
    formValue: {},
    formValue2: {},
    formValue4: {},
    immigrantStatus: 0,
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

    const immigrantStatus = await immigrantContract.status();

    this.setState({ immigrantContractAddress, immigrantStatus: immigrantStatus.valueOf() });
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

      this.setState({ immigrantContractAddress }, () => {
        this.contributionFilter = Immigrant.at(immigrantContractAddress).LogContribution(null, { fromBlock: 0 });
        this.contributionFilter.watch(
          (error, log) =>
            this.setState(
              state => ({
                contributionLogs: [ log ].concat(state.contributionLogs)
              })
            )
        );
      });
    } catch (error) {
      console.error(error);
      window.alert({ message: `failed to register! ${error.message}`, type: 'danger' });
    }
  };

  handleSubmitContribution = async e => {
    e.preventDefault();

    console.log(this.state);

    try {
      const { immigrantContractAddress, formValue2: { tokenAmount }, accounts: [ fromAccount ] } = this.state;

      await window.web3.eth.sendTransactionPromise({
        to: immigrantContractAddress,
        from: fromAccount,
        value: tokenAmount
      });
      window.alert({
        message: `successfully sent a contribution for ${this.state.formValue2.tokenAmount} wei`,
        type: 'success'
      });
    } catch (error) {
      console.error(error);
      window.alert({ message: `failed to register! ${error.message}`, type: 'danger' });
    }
  };

  handleSubmitSAIContribution = async e => {
    e.preventDefault();

    const sai = await SAI.deployed();

    try {
      const { immigrantContractAddress, formValue4: { tokenAmount } } = this.state;

      await sai.transfer(immigrantContractAddress, tokenAmount, { from: this.state.accounts[ 0 ] });

      window.alert({ message: `successfully sent a contribution for ${tokenAmount} SAI`, type: 'success' });
    } catch (error) {
      console.error(error);
      window.alert({ message: `failed to register! ${error.message}`, type: 'danger' });
    }
  };

  handleChange = formValue => {
    this.setState({ formValue });
  };

  handleChange2 = formValue2 => {
    this.setState({ formValue2 });
  };
  handleChange4 = formValue4 => {
    this.setState({ formValue4 });
  };

  render() {
    const { immigrantContractAddress, immigrantStatus, formValue, formValue2, formValue4, contributionLogs } = this.state;

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

    console.log(this.state);
    console.log(contributionLogs);

    console.log('immigrant status', immigrantStatus);

    return (
      <div className="container">
        <PageHeader>
          Your Registration Info&nbsp;
          <small><strong>Status:</strong> {STATUS_NAMES[ immigrantStatus ]}</small>
        </PageHeader>
        <div>
          <div>
            <label>Your Escrow Address: </label> {immigrantContractAddress}
          </div>
          <div>
            <label>Contract Balance: </label> <Balance address={immigrantContractAddress}/>
          </div>
          {
            immigrantStatus < 1 ?
              <div>
                <h2>Send Contributions</h2>
                <div className="row">
                  <div className="col-sm-6">
                    <ContributionForm
                      onChange={this.handleChange2} value={formValue2}
                      onSubmit={this.handleSubmitContribution}/>
                  </div>

                  <div className="col-sm-6">
                    <SaiContributionForm onChange={this.handleChange4} value={formValue4}
                                         onSubmit={this.handleSubmitSAIContribution}/>
                  </div>
                </div>
              </div> :
              null
          }

          <h2>Your Contributions</h2>
          <div>
            <table className="table">
              <thead>
              <tr>
                <th>Contribution Amount</th>
                <th>Transaction Hash</th>
                <th>Block Number</th>
              </tr>
              </thead>
              <tbody>
              { //put in headers for the table here
                _.map(
                  contributionLogs,
                  (log, ix) => {
                    console.log('contribution log', log);
                    return (
                      <tr key={ix}>
                        <td> {log.args.amount.toString()} </td>
                        <td> {log.transactionHash} </td>
                        <td> {log.blockNumber} </td>
                      </tr>
                    );
                  }
                )
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}