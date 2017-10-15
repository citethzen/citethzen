import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Government } from '../util/contracts';
import _ from 'underscore';
import Balance from '../components/Balance';
import { OCCUPATION_CODES } from '../util/constants';
import Icon from '../components/Icon';
import { Button, Modal } from 'react-bootstrap';

export default class GovernmentPage extends Component {
  static propTypes = {
    value: PropTypes.object,
  };

  state = {
    registrationLogs: [],
    invitationLogs: {},
    decisionForm: null
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
      (error, log) => {
        console.log('invitation', log);
        this.setState(
          state => ({
            invitationLogs: {
              ...state.invitationLogs,
              [log.args.immigrantWallet]: true
            }
          })
        );
      }
    );
  }

  sendInvitation = async immigrantWallet => {
    const government = await Government.deployed();
    const govOwner = await government.owner();

    try {
      await government.invite(immigrantWallet, { gas: 3000000, from: govOwner });
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

  startDecision = immigrantAddress => {
    this.setState({ decisionForm: { immigrantAddress, accepted: null } });
  };

  cancelDecision = () => this.setState({ decisionForm: null });

  render() {
    const { registrationLogs, invitationLogs, decisionForm } = this.state;

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
                    <button type="button" className="btn btn-warning btn-sm"
                            disabled={!invitationLogs[ log.args.immigrantAddress ]}
                            onClick={() => this.startDecision(log.args.immigrantAddress)}>
                      <Icon name="thumbs-up"/> Decision <Icon name="thumbs-down"/>
                    </button>
                  </td>
                </tr>
              )
            )
          }
          </tbody>
        </table>

        <Modal show={decisionForm !== null} onHide={this.cancelDecision}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.cancelDecision}>Close</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );

  }
}
