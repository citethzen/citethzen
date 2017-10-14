import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import { OCCUPATION_CODES } from '../util/constants';
import _ from 'underscore';

export default class RegistrationForm extends Component {
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
            <h2>Public Information</h2>
            <div className="form-group">
              <label>Age</label>
              <input type="number" className="form-control"
                     placeholder="25"
                     required
                     value={value.age || ''}
                     onChange={e => changed({ age: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <select className="form-control"
                      required
                      placeholder="Doctor"
                      value={value.occupation || ''}
                      onChange={e => changed({ occupation: e.target.value })}>
                <option value="">Select Occupation...</option>
                {
                  _.map(
                    OCCUPATION_CODES,
                    (occupation, ix) => <option value={`${ix}`}>{occupation}</option>
                  )
                }
              </select>
            </div>
            <div className="form-group">
              <label>Income</label>
              <input type="number" className="form-control"
                     required
                     placeholder="150000"
                     value={value.income || ''}
                     onChange={e => changed({ income: e.target.value })}/>
            </div>
          </div>

          <hr className="visible-xs visible-sm"/>

          <div className="col-md-6">
            <h2>Secret Information</h2>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" className="form-control"
                     required
                     placeholder="John"
                     value={value.firstName || ''}
                     onChange={e => changed({ firstName: e.target.value })}/>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" className="form-control"
                     required
                     placeholder="Doe"
                     value={value.lastName || ''}
                     onChange={e => changed({ lastName: e.target.value })}/>
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" className="form-control"
                     required
                     value={value.dateOfBirth || ''}
                     onChange={e => changed({ dateOfBirth: e.target.value })}/>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control"
                     required
                     placeholder="abc123"
                     value={value.password || ''}
                     onChange={e => changed({ password: e.target.value })}/>
            </div>
          </div>
        </div>

        <hr/>

        <button type="submit" className="btn btn-primary btn-block">
          <Icon name="plane"/> Register
        </button>
      </form>
    );
  }
}