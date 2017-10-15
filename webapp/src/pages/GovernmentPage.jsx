import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Government } from '../util/contracts';
import _ from 'underscore';
import Balance from '../components/Balance';
import { OCCUPATION_CODES } from '../util/constants';
import Icon from '../components/Icon';

export default class GovernmentPage extends Component {
  static propTypes = {
    value: PropTypes.object,
  };

  state = {
    registrationLogs: [],
    invitationLogs: {}
  };

  registrationFilter = null;
  invitationLogs = null;

  async componentDidMount() {
    const government = await Government.deployed();

    this.registrationFilter = government.LogImmigrantRegistration(null, { fromBlock: 0 });
    this.registrationFilter.watch(
      (error, log) =>
        this.setState(
          state => ({
            registrationLogs: [ log ].concat(state.registrationLogs)
          })
        )
    );

    this.invitationFilter = government.LogInvitation(null, { fromBlock: 0 });
    this.invitationFilter.watch(
      (error, log) =>
        this.setState(
          state => ({
            invitationLogs: {
              ...state.invitationLogs,
              [log.args.immigrantWallet]: true
            }
          })
        )
    );
  }

  sendInvitation = async immigrantWallet => {
    const government = await Government.deployed();
    const govOwner = await government.owner();

    try {
      const inviteTx = await government.invite(immigrantWallet, { gas: 3000000, from: govOwner });
      window.alert({
        type: 'success',
        headline: 'Success!',
        message: `Invited immigrant ${immigrantWallet} to join the process`
      });
    } catch (error) {
      console.error(error);
      window.alert({
        type: 'danger',
        headline: 'Error!',
        message: `Failed to invite ${immigrantWallet} to join the process: ${error.message}`
      });
    }
  };

  render() {
    const { registrationLogs, invitationLogs } = this.state;

    return (
      <div className="container">
        <h2>Candidates for Citizenship</h2>
        <p>The following individuals have paid funds in accordance with US tax law into our escrow contract.
          These funds will be released to the US Government upon naturalization.</p>
        <table className="table">
          <thead>
          <tr>
            <th>Age</th>
            <th>Occupation</th>
            <th>Income</th>
            <th>Total Contribution</th>
            <th>Invitation</th>
            <th>Acceptance</th>
          </tr>
          </thead>
          <tbody>
          {	//put in headers for the table here
            _.map(
              registrationLogs,
              (log, ix) => (
                //log.args.transactionHash.toString()+ log.args.transactionIndex.toString()
                <tr key={ix}>
                  <td>{log.args.age.toString()}</td>
                  <td>{OCCUPATION_CODES[ log.args.occupation.valueOf() ]}</td>
                  <td>{log.args.income.toString()}</td>
                  <td><Balance address={log.args.immigrantContractAddress}/></td>
                  <td>
                    {
                      invitationLogs[ log.args.immigrantAddress ] ?
                        <Icon name="check" className="text-success"/> : (
                          <button type="button" className="btn btn-primary btn-sm"
                                  onClick={() => this.sendInvitation(log.args.immigrantAddress)}>
                            <Icon name="envelope"/> Send
                          </button>
                        )
                    }
                  </td>
                  <td>
                    <button type="button" className="btn btn-success btn-sm">
                      <Icon name="thumbs-up"/> Accept
                    </button>
                    <button type="button" className="btn btn-danger btn-sm">
                      <Icon name="times-circle"/> Reject
                    </button>
                  </td>
                </tr>
              )
            )
          }
          </tbody>
        </table>
      </div>

    );

  }
}
