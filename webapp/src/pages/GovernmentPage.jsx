import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Government } from '../util/contracts';
import _ from 'underscore';

export default class GovernmentPage extends Component {
  static propTypes = {
  	accounts: [],
  	value: PropTypes.object,
  };

  async componentDidMount() {
  	const accounts = await window.web3.eth.getAccountsPromise();
  	this.setState({ accounts });

  	const government = await Government.deployed();

  	const filter = government.LogImmigrantRegistration();
  	const logs = filter.get((error, logs) => console.log(error, logs));
  }

// need handleAccept button/stuff

  render(){
  	const {value, ...rest } = this.props;
  	const logs = this.state;
  	console.log(logs);
  	console.log(value);

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
            <th>Education</th>
            <th>2014 Contribution</th>
            <th>2015 Contribution</th>
            <th>2016 Contribution</th>
            <th>Total Contribution</th>
            <th>Accpetance</th>
            <th>Collection</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>25</td>
            <td>Doctor</td>
            <td>B.A. in Computer Science</td>
            <td>$1,500</td>
            <td>$2,000</td>
            <td>$1,000</td>
            <td>$4,500</td>
            <td>Accepted</td>
            <td>
              <button>Collect</button>
            </td>
          </tr>
          <tr>
            <td>25</td>
            <td>Lawyer</td>
            <td>Bachelor of Laws</td>
            <td>$1,500</td>
            <td>$2,000</td>
            <td>$1,000</td>
            <td>$4,500</td>
            <td>
              <button>Accpet</button>
            </td>
            <td>
              <button>Collect</button>
            </td>
          </tr>
          <tr>
            <td>25</td>
            <td>Farmer</td>
            <td>Masters in Agriculture</td>
            <td>$1,500</td>
            <td>$2,000</td>
            <td>$1,000</td>
            <td>$4,500</td>
            <td>
              <button>Accpet</button>
            </td>
            <td>
              <button>Collect</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
  	);

  }
}
 

  // render(

  // 	<Table data={products} />,
  // 	document.getElementById("root")
  // );

// console.log(this.state);
//   	debugger
//   	const logs = this.state;
//   	const log = logs.map((logs) =>
//   		<li key={this.state.id}>
//   			{this.state.text}
//   		</li>
//   	);

// 	console.log(log);
// 	debugger
// 	return (
// 		<table className="table">
// 			<thead></thead>
// 			<tbody>
// 				{	//put in headers for the table here
// 					_.map(
// 						logs,
// 						log => (
// 							<tr> 
// 								<th> </th>
// 								<td>this is how old i am</td>
// 							</tr>
// 							)
// 						)
// 				}
// 			</tbody>
// 		</table>
// 	)
// }

  // render() {
  //   return (
  //     <div className="container">
  //       <h2>Candidates for Citizenship</h2>
  //       <p>The following individuals have paid funds in accordance with US tax law into our escrow contract.
  //         These funds will be released to the US Government upon naturalization.</p>
  //       <table className="table">
  //         <thead>
  //         <tr>
  //           <th>Age</th>
  //           <th>Occupation</th>
  //           <th>Education</th>
  //           <th>2014 Contribution</th>
  //           <th>2015 Contribution</th>
  //           <th>2016 Contribution</th>
  //           <th>Total Contribution</th>
  //           <th>Accpetance</th>
  //           <th>Collection</th>
  //         </tr>
  //         </thead>
  //         <tbody>
  //         <tr>
  //           <td>25</td>
  //           <td>Doctor</td>
  //           <td>B.A. in Computer Science</td>
  //           <td>$1,500</td>
  //           <td>$2,000</td>
  //           <td>$1,000</td>
  //           <td>$4,500</td>
  //           <td>Accepted</td>
  //           <td>
  //             <button>Collect</button>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>25</td>
  //           <td>Lawyer</td>
  //           <td>Bachelor of Laws</td>
  //           <td>$1,500</td>
  //           <td>$2,000</td>
  //           <td>$1,000</td>
  //           <td>$4,500</td>
  //           <td>
  //             <button>Accpet</button>
  //           </td>
  //           <td>
  //             <button>Collect</button>
  //           </td>
  //         </tr>
  //         <tr>
  //           <td>25</td>
  //           <td>Farmer</td>
  //           <td>Masters in Agriculture</td>
  //           <td>$1,500</td>
  //           <td>$2,000</td>
  //           <td>$1,000</td>
  //           <td>$4,500</td>
  //           <td>
  //             <button>Accpet</button>
  //           </td>
  //           <td>
  //             <button>Collect</button>
  //           </td>
  //         </tr>
  //         </tbody>
  //       </table>
  //     </div>
  //   );