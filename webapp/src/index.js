import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import contracts from './util/contracts';
import Web3 from 'web3';
import _ from 'underscore';

// initialize web3
if (typeof window.web3 !== 'undefined') {
  window.web3 = new Web3(window.web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  window.web3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io/0eep3H3CSiqitPXv0aOy'));
}

// initialize the provider for the contracts
_.each(contracts, contract => contract.setProvider(window.web3.currentProvider));

ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
