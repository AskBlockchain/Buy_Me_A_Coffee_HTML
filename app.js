//import { ethers } from 'ethers';



const contractAddress = '0x932e315c860020AD57AAC4B8e176583aCcF493aF';
const abi = [
    {
      "type": "constructor",
      "name": "",
      "inputs": [],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "event",
      "name": "NewCoffee",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true,
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "timestamp",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "type": "string",
          "name": "message",
          "indexed": false,
          "internalType": "string"
        },
        {
          "type": "string",
          "name": "name",
          "indexed": false,
          "internalType": "string"
        }
      ],
      "outputs": [],
      "anonymous": false
    },
    {
      "type": "function",
      "name": "buyCoffee",
      "inputs": [
        {
          "type": "string",
          "name": "_message",
          "internalType": "string"
        },
        {
          "type": "string",
          "name": "_name",
          "internalType": "string"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "getAllCoffee",
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "name": "",
          "components": [
            {
              "type": "address",
              "name": "sender",
              "internalType": "address"
            },
            {
              "type": "string",
              "name": "message",
              "internalType": "string"
            },
            {
              "type": "string",
              "name": "name",
              "internalType": "string"
            },
            {
              "type": "uint256",
              "name": "timestamp",
              "internalType": "uint256"
            }
          ],
          "internalType": "struct MyContract.Coffee[]"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTotalCoffee",
      "inputs": [],
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "owner",
      "inputs": [],
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address payable"
        }
      ],
      "stateMutability": "view"
    }
  ];

// ... (previous code)

let provider;
let signer;
let contract;

document.getElementById('connect-wallet').addEventListener('click', async () => {
    await connectWallet();
});

document.getElementById('fetchBlockNumberBtn').addEventListener('click', async () => {
    await fetchBlockNumber();
});

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });

             // Hide the "Connect Wallet" button
             document.getElementById('connect-wallet').style.display = 'none';


             // Fetch and display block number and coffee messages
             fetchBlockNumber();
             fetchRecentMessages();




            // Call smart contract functions and interact with the frontend.
        } catch (err) {
            console.error('User denied account access:', err);
        }
    } else {
        console.error('No Ethereum provider detected.');
    }
}


document.getElementById('buy-coffee').addEventListener('click', async () => {
  const message = document.getElementById('message').value;
  const name = document.getElementById('name').value;
  await buyCoffee(message, name);
});


async function buyCoffee(message, name) {
  if (!provider || !signer || !contract) {
      console.error('Please connect your wallet first.');
      return;
  }

  try {
      const transaction = await contract.buyCoffee(message, name, {
          value: ethers.utils.parseEther('0.01')
      });

      // Wait for the transaction to be mined
      const receipt = await transaction.wait();

      console.log('Transaction mined:', receipt);
  } catch (err) {
      console.error('Error buying coffee:', err);
  }
}





async function fetchBlockNumber() {
    try {
        const blockNumber = await provider.getBlockNumber();
        displayBlockNumber(blockNumber);
    } catch (err) {
        console.error('Error fetching block number:', err);
    }
}

function displayBlockNumber(blockNumber) {
    const blockNumberElement = document.getElementById('blockNumber');
    blockNumberElement.innerText = `Current Block Number: ${blockNumber}`;
}

async function fetchRecentMessages() {
  try {
      const coffeeArray = await contract.getAllCoffee();
      displayRecentMessages(coffeeArray);
  } catch (err) {
      console.error('Error fetching recent messages:', err);
  }
}

function displayRecentMessages(coffeeArray) {
  const recentMessagesElement = document.getElementById('recentMessages');
  recentMessagesElement.innerHTML = '';

  for (const coffee of coffeeArray) {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${coffee.name}</strong>: ${coffee.message}`;
      recentMessagesElement.appendChild(listItem);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // ...
  // Add the following line after connecting to the wallet
  fetchRecentMessages();
});




document.addEventListener('DOMContentLoaded', () => {
  // ...
  const fetchRecentMessagesBtn = document.getElementById('fetchRecentMessagesBtn');
  // Add event listener to the Fetch Recent Messages button
  fetchRecentMessagesBtn.addEventListener('click', () => {
      fetchRecentMessages();
  });
});





  

    

