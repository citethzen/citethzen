import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';

export default class RegistrationForm extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { value, onChange, ...rest } = this.props;

    const changed = more => onChange({ ...value, ...more });

    return (
      <form {...rest}>
        <h2>Public Information</h2>
        <div className="form-group">
          <label>Age</label>
          <input type="number" className="form-control"
                 required
                 value={value.age || ''}
                 onChange={e => changed({ age: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Occupation</label>
          <input type="number" className="form-control"
                 required
                 value={value.occupation || ''}
                 onChange={e => changed({ occupation: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Income</label>
          <input type="number" className="form-control"
                 required
                 value={value.income || ''}
                 onChange={e => changed({ income: e.target.value })}/>
        </div>

        <hr/>

        <h2>Secret Information</h2>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" className="form-control"
                 required
                 value={value.firstName || ''}
                 onChange={e => changed({ firstName: e.target.value })}/>
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" className="form-control"
                 required
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
                 value={value.password || ''}
                 onChange={e => changed({ password: e.target.value })}/>
        </div>

        <button type="submit" className="btn btn-primary">
          <Icon name="plane"/> Register
        </button>
      </form>
    );
  }
}