import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Government } from '../util/contracts';
import _ from 'underscore';
import Balance from '../components/Balance';
import { OCCUPATION_CODES } from '../util/constants';

export default class GovernmentPage extends Component {
  static propTypes = {
  	value: PropTypes.object,
  };

  state = {
  	accounts: [],
  	logs: []
  };

  async componentDidMount() {
  	const accounts = await window.web3.eth.getAccountsPromise();
  	this.setState({ accounts });

  	const government = await Government.deployed();

  	const filter = government.LogImmigrantRegistration();
  	filter.get((error, logs) => this.setState({logs}));

  }

// need handleAccept button/stuff

  render(){
  	const {value, ...rest } = this.props;
  	const { logs, accounts } = this.state;
  	console.log(logs);
  	//console.log(value, " in value");

  	return(
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
			            <th>Acceptance</th>
			            <th>Collection</th>
					</tr>
				</thead>
				<tbody>
				{	//put in headers for the table here
					_.map(
						logs,
						log => (
							//log.args.transactionHash.toString()+ log.args.transactionIndex.toString()
							<tr key={log.args.transactionHash + log.args.transactionIndex}>  
								<td>{log.args.age.toString()}</td>
								<td>{OCCUPATION_CODES[log.args.occupation.valueOf()]}</td>
								<td>{log.args.income.toString()}</td>
								<td><Balance address={log.args.immigrantContractAddress}/></td>
								<td></td>
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
