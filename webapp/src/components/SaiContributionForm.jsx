import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

export default class SaiContributionForm extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { value, onChange, ...rest } = this.props;
    const changed = more => onChange({ ...value, ...more });

    return (
      <form {...rest} className="form">
        <div className="form-group">
          <label>Amount of SAI</label>
          <input type="number" className="form-control"
                 placeholder="100"
                 required
                 value={value.tokenAmount || ''}
                 onChange={e => changed({ tokenAmount: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          <Icon name="money"/> Send SAI
        </button>
      </form>
    );
  }
}