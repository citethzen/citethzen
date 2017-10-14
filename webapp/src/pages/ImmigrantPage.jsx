import React, { Component } from 'react';

export default class ImmigrantPage extends Component {
  static propTypes = {};

  NewGreeting(props) {
    return (
		<form>
		<div className="form-group">
			<label >Age</label>
			<select className="form-control" id="input1">
			  <option>18-25</option>
			  <option>26-35</option>
			  <option>36-45</option>
			  <option>46-60</option>
			  <option>61+</option>
			</select>
		</div>
		<div className="form-group">
			<label htmlFor="input2">Occupation</label>
			<input className="form-control" id="input2"/>
		</div>
		<div className="form-group">
			<label htmlFor="input3">Education</label>
			<input className="form-control" id="input3"/>
		</div>
		<button className="btn btn-primary">Submit</button>
		</form>
    );
  }

   RegisteredGreeting(props) {
  	return (
	  	<form>
      <div className="container">
        <h2>Registered</h2>
        <p>You have previously registered on CitEthZen.  Please enter your contribution for 2017 in SAI:</p>
        <div className="form-group">
				<input className="form-control" placeholder="2017 Contribution" id="input2"/>
				<button class="btn btn-primary">Submit</button>
			</div>
			</div>
			</form>
  	);
  }

  	NoSai(props) {
  		return (
		  	<div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal">&times;</button>
		        <h4 class="modal-title">Modal Header</h4>
		      </div>
		      <div class="modal-body">
		        <p>Your current account does not have any Sai.  SAI is a cryptocurrency that is pegged to USD, protecting your contribution from volatility prior to government acceptance.  Contributions can only be made in Sai.</p>
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		      </div>
		    </div>
  		)
  	}

	render() {

		return (
			false ? this.NewGreeting(this.props) : this.RegisteredGreeting(this.props)
		)
	}

}