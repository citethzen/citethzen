import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Government } from '../util/contracts';
import _ from 'underscore';
import Balance from '../components/Balance';
import { OCCUPATION_CODES } from '../util/constants';
import Icon from '../components/Icon';
import { Alert, Button, Modal, PageHeader } from 'react-bootstrap';
import { PrivateInfoFields } from '../components/RegistrationForm';
import cx from 'classnames';

export default class GovernmentPage extends Component {
  static propTypes = {
    value: PropTypes.object,
  };

  state = {
    governmentAddress: null,
    registrationLogs: [],
    invitationLogs: {},
    decisionLogs: {},
    decisionForm: null
  };

  registrationFilter = null;
  invitationFilter = null;

  async componentDidMount() {
    const government = await Government.deployed();
    this.setState({ governmentAddress: government.address });

    this.registrationFilter = government.LogImmigrantRegistration(null, { fromBlock: 0 });
    this.registrationFilter.watch(
      (error, log) => {
        console.log('registration', log);
        this.setState(
          state => ({
            registrationLogs: [ log ].concat(state.registrationLogs)
          })
        );
      }
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

    this.decisionFilter = government.LogGovernmentDecision(null, { fromBlock: 0 });
    this.decisionFilter.watch(
      (error, log) => {
        console.log('decision', log);
        this.setState(
          state => ({
            decisionLogs: {
              ...state.decisionLogs,
              [log.args.immigrant]: log.args.wasAccepted
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
  handleDecision = async accepted => {
    const { decisionForm } = this.state;
    const { firstName, lastName, dateOfBirth, password } = decisionForm;

    const government = await Government.deployed();
    const govOwner = await government.owner();

    try {
      const transactionObject = await government.makeDecision(
        decisionForm.immigrantAddress, accepted,
        firstName, lastName, dateOfBirth, password,
        {
          gas: 3000000,
          from: govOwner
        }
      );

      window.alert({
        type: 'success',
        headline: 'Success!',
        message: `Immigrant ${decisionForm.immigrantAddress} ${accepted ? 'has been accepted!' : 'has been denied!'}`
      });

      this.setState({ decisionForm: null });
    } catch (error) {
      console.error(error);
      window.alert({
        type: 'danger',
        headline: 'Error!',
        message: `Failed to make decision on ${decisionForm.immigrantAddress}: ${error.message}`
      });
    }
  };

  render() {
    const { registrationLogs, invitationLogs, decisionLogs, decisionForm, governmentAddress } = this.state;

    return (
      <div className="container">
        <PageHeader>
          Government&nbsp;
          <small>Balance: {governmentAddress !== null ? <Balance address={governmentAddress}/> : null}</small>
        </PageHeader>

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
                  (log, ix) => {
                    const invited = Boolean(invitationLogs[ log.args.immigrantAddress ]);
                    const decision = decisionLogs[ log.args.immigrantAddress ];

                    return (
                      <tr key={ix}>
                        <td>{log.args.age.toString()}</td>
                        <td>{OCCUPATION_CODES[ log.args.occupation.valueOf() ]}</td>
                        <td>{log.args.income.toString()}</td>
                        <td><Balance address={log.args.immigrantContractAddress}/></td>
                        <td>
                          {
                            invited ?
                              <Icon name="check" className="text-success"/> :
                              (
                                <button type="button" className="btn btn-primary btn-sm"
                                        onClick={() => this.sendInvitation(log.args.immigrantAddress)}>
                                  <Icon name="envelope"/> Invite
                                </button>
                              )
                          }
                        </td>
                        <td>
                          {
                            typeof decision === 'undefined' ? (
                              <button type="button" className="btn btn-warning btn-sm"
                                      disabled={!invited}
                                      onClick={() => this.startDecision(log.args.immigrantAddress)}>
                                <Icon name="thumbs-up"/> Decision <Icon name="thumbs-down"/>
                              </button>
                            ) : (
                              <span className={cx({
                                'text-success': decision,
                                'text-danger': !decision
                              })}>{decision === true ? 'Accepted' : 'Rejected'}</span>
                            )
                          }
                        </td>
                      </tr>
                    );
                  }
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
                <button className="btn btn-danger btn-block"
                        onClick={() => this.handleDecision(false)}>
                  <Icon name="thumbs-down"/> Nay!
                </button>
              </div>
              <div className="col-xs-6">
                <button className="btn btn-success btn-block"
                        onClick={() => this.handleDecision(true)}>
                  <Icon name="thumbs-up"/> Yay!
                </button>
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
