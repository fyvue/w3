import { FyWeb3Data } from "./types";

const regexEthTruncate = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export function truncateEthAddr(address: string) {
  if (!address) return "";
  const match = address.match(regexEthTruncate);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}

export const fyw3Data: FyWeb3Data = {
  chains: {
    mumbai: {
      chainId: "0x13881",
      chainName: "Mumbai Network",
      rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
    },
    polygon: {
      chainId: "0x89",
      chainName: "Polygon Main Network",
      rpcUrls: ["https://polygon-rpc.com"],
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
    },
    ethereum: {
      chainId: "0x1",
      chainName: "Ethereum Main Network (Mainnet)",
      rpcUrls: ["https://mainnet.infura.io/v3/"],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
    },
  },
};
