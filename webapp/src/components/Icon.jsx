import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Icon extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  };

  render() {
    const { name, className, ...props } = this.props;
    return (
      <i className={cx(className, `fa fa-${name}`)} {...props}/>
    );
  }
}