import GovernmentJSON from 'citethzen-contracts/build/contracts/government.json';
import ImmigrantJSON from 'citethzen-contracts/build/contracts/Immigrant.json';
import TruffleContract from 'truffle-contract';

export const Government = TruffleContract(GovernmentJSON);
export const Immigrant = TruffleContract(ImmigrantJSON);

export default {
  Government,
  Immigrant
};