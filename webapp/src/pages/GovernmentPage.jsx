import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Government } from '../util/contracts';
import _ from 'underscore';
import Balance from '../components/Balance';
import { OCCUPATION_CODES } from '../util/constants';
import Icon from '../components/Icon';
import { Alert, Button, Modal } from 'react-bootstrap';
import { PrivateInfoFields } from '../components/RegistrationForm';

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

        {
          registrationLogs.length > 0 ? (
            <table className="table">
              <thead>
              <tr>
                <th>Age</th>
                <th>Occupation</th>
                <th>Income</th>
                <th>Total Contribution</th>
                <th>Invitation</th>
                <th/>
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
                                <Icon name="envelope"/> Invite
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
          ) : <Alert>No immigrants have registered with the government contract</Alert>
        }

        <Modal show={decisionForm !== null} onHide={this.cancelDecision}>
          <Modal.Header closeButton>
            <Modal.Title>Decide on {decisionForm && decisionForm.immigrantAddress}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <PrivateInfoFields value={decisionForm || {}} onChange={decisionForm => this.setState({ decisionForm })}/>
            <hr/>
            <div className="row">
              <div className="col-xs-6">
                <button className="btn btn-danger btn-block"><Icon name="thumbs-down"/> Nay!</button>
              </div>
              <div className="col-xs-6">
                <button className="btn btn-success btn-block"><Icon name="thumbs-up"/> Yay!</button>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.cancelDecision}>Close</Button>
          </Modal.Footer>
        </Modal>

      </div>
    );

  }
}
