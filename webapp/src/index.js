import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import contracts from './util/contracts';
import Web3 from 'web3';
import _ from 'underscore';
import Promise from 'bluebird';

document.addEventListener('DOMContentLoaded', () => {
  // initialize web3
  let provider;
  if (typeof window.web3 !== 'undefined') {
    provider = window.web3.currentProvider;
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    provider = new Web3.providers.HttpProvider('http://localhost:8545');
    // set the provider you want from Web3.providers
    window.web3 = new Web3(provider);
  }

  Promise.promisifyAll(window.web3.eth, { suffix: 'Promise' });

  _.each(contracts, contract => {
    contract.setProvider(provider);
    if (typeof contract.currentProvider.sendAsync !== 'function') {
      contract.currentProvider.sendAsync = function () {
        return contract.currentProvider.send.apply(
          contract.currentProvider, arguments
        );
      };
    }
  });

  ReactDOM.render(<App/>, document.getElementById('root'));
});

registerServiceWorker();
