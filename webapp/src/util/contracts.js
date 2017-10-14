import GovernmentJSON from '../contracts/Government.json';
import ImmigrantJSON from  '../contracts/Immigrant.json';
import TruffleContract from 'truffle-contract';

export const Government = TruffleContract(GovernmentJSON);
export const Immigrant = TruffleContract(ImmigrantJSON);

export default {
  Government,
  Immigrant
};