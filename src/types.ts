import { ethers } from "ethers";

export interface W3State {
  wallet?: string;
  provider?: ethers.providers.Web3Provider;
  baseProvider?: any;
  signer?: ethers.providers.JsonRpcSigner;
  contracts: {
    [key: string]: ethers.Contract;
  };
}
export interface NetworkChain {
  chainId: string;
  chainName: string;
  rpcUrls: Array<string>;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}
export interface FyWeb3Data {
  chains: {
    [key: string]: NetworkChain;
  };
}
