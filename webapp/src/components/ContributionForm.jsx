import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { OCCUPATION_CODES } from '../util/constants';
import _ from 'underscore';

export default class ContributionForm extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { value, onChange, ...rest } = this.props;
    const changed = more => onChange({ ...value, ...more });

    return (
      <form {...rest} className="form">
        <div className="row">
          <div className="col-md-6">
            <h2>Send Contributions</h2>
            <div className="form-group">
              <label>Amount of Wei</label>
              <input type="number" className="form-control"
                     placeholder="25"
                     required
                     value={value.tokenAmount || ''}
                     onChange={e => changed({ tokenAmount: e.target.value })}
              />
            </div>
          </div>
        </div>

        <hr/>

        <button type="submit" className="form btn btn-primary">
          <Icon name="money"/> Contribute
        </button>
      </form>
    );
  }
}