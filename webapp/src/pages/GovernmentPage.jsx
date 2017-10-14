import React, { Component } from 'react';
import { Government } from '../util/contracts';

export default class GovernmentPage extends Component {
  static propTypes = {};

  componentDidMount() {
    Government.deployed()
      .then(
        government => console.log(government)
      );
  }

  render() {
    return (
      <div className="container">
        <h2>Candidates for Citizenship</h2>
        <p>The following individuals have paid funds in accordance with US tax law into CitEthZen's escrow contract.
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