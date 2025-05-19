import { ethers } from 'ethers';

export const web3Service = {
    // Check if MetaMask is installed
    isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined';
    },

    // Request account access
    async requestAccount() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return accounts[0];
        } catch (error) {
            throw new Error('User denied account access');
        }
    },

    // Get the current account
    async getCurrentAccount() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            return accounts[0];
        } catch (error) {
            throw new Error('Failed to get current account');
        }
    },

    // Sign a message
    async signMessage(message) {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(message);
            return signature;
        } catch (error) {
            throw new Error('Failed to sign message: ' + error.message);
        }
    },

    // Generate a random message for signing
    generateMessage() {
        const timestamp = new Date().getTime();
        return `Welcome to Credit Manager!\n\nClick to sign in and accept the Credit Manager Terms of Service.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address:\n${window.ethereum.selectedAddress}\n\nNonce:\n${timestamp}`;
    },

    // Listen for account changes
    onAccountChange(callback) {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', callback);
        }
    },

    // Remove account change listener
    removeAccountChangeListener(callback) {
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', callback);
        }
    }
}; 