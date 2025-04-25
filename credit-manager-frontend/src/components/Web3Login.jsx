import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

function Web3Login() {
    const [account, setAccount] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    useEffect(() => {
        checkMetaMask();
    }, []);

    const checkMetaMask = async () => {
        if (window.ethereum) {
            console.log('MetaMask is installed!');
        } else {
            setErrorMessage('MetaMask is not installed. Please install it to use this feature.');
        }
    };

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log('Found account', accounts[0]);
                setAccount(accounts[0]);
            } catch (err) {
                setErrorMessage('Error connecting to MetaMask: ' + err.message);
            }
        }
    };

    const loginWithMetaMaskHandler = async () => {
        if (!window.ethereum || !account) {
            setErrorMessage('Please connect your wallet first.');
            return;
        }

        const message = 'Sign this message to log in to our dApp!'; // Should match the backend
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer =await provider.getSigner();

        try {
            const signature = await signer.signMessage(message);
            console.log('Signature:', signature);

            // Send the address and signature to the backend for verification
            const response = await axios.post('http://localhost:8081/auth/login', {
                address: account,
                signature: signature,
            });

            console.log('Login response:', response.data);
            setLoginMessage(response.data.message);
            // Handle successful login (e.g., store a token, redirect)
        } catch (err) {
            setErrorMessage('Error signing message or sending to backend: ' + err.message);
        }
    };

    return (
        <div>
            <h2>Web3 Login with MetaMask</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {loginMessage && <p style={{ color: 'green' }}>{loginMessage}</p>}

            {!account ? (
                <button onClick={connectWalletHandler}>Connect Wallet</button>
            ) : (
                <div>
                    <p>Connected Account: {account}</p>
                    <button onClick={loginWithMetaMaskHandler}>Login with MetaMask</button>
                </div>
            )}
        </div>
    );
}

export default Web3Login;