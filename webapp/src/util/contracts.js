import GovernmentJSON from '../contracts/Government.json';
import ImmigrantJSON from '../contracts/Immigrant.json';
import HumanStandardTokenJSON from '../contracts/HumanStandardToken.json';
import TruffleContract from 'truffle-contract';

export const Government = TruffleContract(GovernmentJSON);
export const Immigrant = TruffleContract(ImmigrantJSON);
export const SAI = TruffleContract(HumanStandardTokenJSON);

export default {
  Government,
  Immigrant,
  SAI
};