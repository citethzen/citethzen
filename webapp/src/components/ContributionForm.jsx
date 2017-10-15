import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

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
        <h2>Send Contributions</h2>
        <div className="form-group">
          <label>Amount of Wei</label>
          <input type="number" className="form-control"
                 placeholder="100"
                 required
                 value={value.tokenAmount || ''}
                 onChange={e => changed({ tokenAmount: e.target.value })}
          />
        </div>

        <button type="submit" className="form btn btn-primary">
          <Icon name="money"/> Contribute
        </button>
      </form>
    );
  }
}