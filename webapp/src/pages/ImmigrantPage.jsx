import React, { Component } from 'react';

export default class ImmigrantPage extends Component {
  static propTypes = {};

  render() {

    return (
		<form>
		<div className="form-group">
			<label for="input1">Age</label>
			<select class="form-control" id="input1">
			  <option>18-25</option>
			  <option>26-35</option>
			  <option>36-45</option>
			  <option>46-60</option>
			  <option>61+</option>
			</select>
		</div>
		<div className="form-group">
			<label for="input2">Occupation</label>
			<input className="form-control" id="input2"/>
		</div>
		<div className="form-group">
			<label for="input3">Education</label>
			<input className="form-control" id="input3"/>
		</div>
		<button class="btn btn-primary">Submit</button>
		</form>
    );
  }
}