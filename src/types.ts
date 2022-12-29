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
