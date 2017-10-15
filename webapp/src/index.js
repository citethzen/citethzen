import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import contracts from './util/contracts';
import Web3 from 'web3';
import _ from 'underscore';
import Promise from 'bluebird';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(
    () => {
      // initialize web3
      if (typeof window.web3 !== 'undefined') {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      }

      Promise.promisifyAll(window.web3.eth, { suffix: 'Promise' });

      _.each(
        contracts,
        contract => {
          contract.setProvider(window.web3.currentProvider);
          if (typeof contract.currentProvider.sendAsync !== 'function') {
            contract.currentProvider.sendAsync = function () {
              return contract.currentProvider.send.apply(contract.currentProvider, arguments);
            };
          }
        });

      ReactDOM.render(<App/>, document.getElementById('root'));
    },
    100
  );
});

registerServiceWorker();
