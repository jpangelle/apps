import contractAddresses from './addresses.json';
import abiDefinitions from '../abi/';
import { Account } from './types';
import { ContractAddresses, ContractAbis } from '../Tinlake';

const testConfig : ProviderConfig = {
  contractAddresses,
  godAccount: {
    address: '0xf6fa8a3f3199cdd85749ec749fb8f9c2551f9928',
    publicKey: '0x592ff5c6edfe1325d0af7ec33f56483e85ec33d30c213fa189f7887dc8525420db6a25cf1a1d1c1430c5a14d742750bbadd301cde5d87f8c7cc927c0fdcd5c2a',
    privateKey: '0xb2e0c8e791c37df214808cdadc187f0cba0e36160f1a38b321a25c9a0cea8c11',
  },
  transactionTimeout: 50000,
  gasPrice: 5000000,
  gasLimit: 2500000000,
  rpcUrl: 'http://127.0.0.1:8545',
  contractAbis: abiDefinitions,
  SUCCESS_STATUS: '0x1',
  FAIL_STATUS: '0x0',
  FAUCET_AMOUNT: '200000000000000000000',
};

export type ProviderConfig = {
  rpcUrl: string;
  godAccount: Account;
  gasLimit: number;
  gasPrice: number;
  transactionTimeout: number;
  contractAddresses: ContractAddresses;
  contractAbis: ContractAbis;
  SUCCESS_STATUS: '0x1';
  FAIL_STATUS: '0x0';
  FAUCET_AMOUNT: string;
}


export default testConfig;
