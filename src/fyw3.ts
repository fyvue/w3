import { ethers } from "ethers";
import { defineStore, Pinia } from "pinia";
import type { NetworkChain, W3State } from "./types";

export const useW3State = defineStore({
  id: "w3State",
  state: (): W3State => ({
    wallet: undefined,
    provider: undefined,
    baseProvider: undefined,
    signer: undefined,
    contracts: {},
  }),
  actions: {
    async getContract(addr: string, abi: ethers.ContractInterface) {
      if (!this.signer) return false;
      if (this.contracts[addr]) return this.contracts[addr];
      const newContract = new ethers.Contract(addr, abi, this.signer);
      this.contracts[addr] = newContract;

      return this.contracts[addr];
    },
    async addChainToWallet(chain: NetworkChain) {
      if (this.provider) {
        try {
          await this.provider.send("wallet_addEthereumChain", [chain]);
          return true;
        } catch (e) {
          console.log("Error while adding chain: ", e);
        }
      }
      return false;
    },
    async changeCurrentChain(chainId: string, forcedChain?: NetworkChain) {
      if (this.provider) {
        try {
          await this.provider.send("wallet_switchEthereumChain", [
            { chainId: chainId },
          ]);
          return true;
        } catch (e) {
          console.log("Error while changing chain: ", e);
          // @ts-expect-error
          if (e.code == 4902 && forcedChain) {
            const addChain = await this.addChainToWallet(forcedChain);
            if (addChain) {
              await this.changeCurrentChain(chainId);
            }
          }
        }
      }
      return false;
    },
    getCurrentChain() {
      if (this.baseProvider && this.baseProvider.chainId) {
        return this.baseProvider.chainId;
      }
      return undefined;
    },
    async checkForcedChain(forcedChain: NetworkChain) {
      if (!this.signer) return;
      const currentChain = await this.getCurrentChain();
      if (!currentChain) return;
      if (forcedChain.chainId == currentChain) return;
      return await this.changeCurrentChain(forcedChain.chainId, forcedChain);
    },
    async checkConnect(forcedChain?: NetworkChain, onConnect?: Function) {
      if (!this.wallet) {
        if (typeof window !== "undefined") {
          let w3Provider = null;

          if (typeof window.ethereum !== "undefined")
            w3Provider = window.ethereum;
          else if (typeof window.web3 !== "undefined")
            w3Provider = window.web3.currentProvider;

          if (w3Provider == null) {
            // Modal?
            return;
          }
          this.baseProvider = w3Provider;
          this.provider = new ethers.providers.Web3Provider(w3Provider);
          const accounts = await this.provider.send("eth_accounts", []);

          if (accounts && accounts.length > 0) {
            this.signer = this.provider.getSigner();
            this.wallet = await this.signer.getAddress();

            if (this.wallet && forcedChain) {
              this.checkForcedChain(forcedChain);
            }
            this.registerEvents(forcedChain);
            if (onConnect) onConnect();
          }
        }
      }
    },
    async connectWallet(forcedChain?: NetworkChain, onConnect?: Function) {
      if (typeof window !== "undefined") {
        let w3Provider = null;

        if (typeof window.ethereum !== "undefined")
          w3Provider = window.ethereum;
        else if (typeof window.web3 !== "undefined")
          w3Provider = window.web3.currentProvider;

        if (w3Provider == null) {
          // Modal?
          return;
        }
        this.baseProvider = w3Provider;
        this.provider = new ethers.providers.Web3Provider(w3Provider);
        await this.provider.send("eth_requestAccounts", []);
        this.signer = this.provider.getSigner();
        this.wallet = await this.signer.getAddress();

        if (this.wallet && forcedChain) {
          this.checkForcedChain(forcedChain);
          this.registerEvents(forcedChain);
          if (onConnect) onConnect();
        }
      }
    },
    registerEvents(forcedChain?: NetworkChain) {
      // metamask
      if (this.provider && typeof window.ethereum !== "undefined") {
        window.ethereum.on("accountsChanged", () => {
          this.connectWallet(forcedChain);
        });
        window.ethereum.on("chainChanged", (newNetwork: any) => {
          if (forcedChain && forcedChain.chainId != newNetwork) {
            //this.changeCurrentChain(forcedChain.chainId, forcedChain);
            // @TODO: fire event or something.
          }
        });
      }
    },
  },
});
