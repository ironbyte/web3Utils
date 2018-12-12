const Web3 = require('web3');
web3Instance = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/<token>'));

exports.getLatestBlock = async function GetLatestBlock() {
  try {
    const currentBlock = await web3Instance.eth.getBlock('latest');
    return currentBlock;
  } catch (error) {
    throw error;
  }
};

exports.getIncomingTransactionsByAccount = async function getIncomingTransactionsByAccount(receivingAddress, startBlockNumber) {
  try {
    const incomingTransactions = [];
    const promises = [];

    const latestBlock = await web3Instance.eth.getBlock('latest');
    for (let i = startBlockNumber; i < latestBlock.number + 1; i++) {
      promises.push(web3Instance.eth.getBlock(i, true));
    }

    const fetchedBlocks = await Promise.all(promises);

    for (let j = 0; j < fetchedBlocks.length; j++) {
      const currentBlock = fetchedBlocks[j];
      const { transactions } = currentBlock;

      for (let k = 0; k < transactions.length; k++) {
        const currentTransaction = transactions[k];

        if (Object.keys(currentTransaction).length > 0) {
          const currentTransactionToAddress = currentTransaction.to.toLowerCase();

          if (currentTransactionToAddress === receivingAddress) {
            incomingTransactions.push(currentTransaction);
          }
        }
      }
    }

    return incomingTransactions;
  } catch (error) {
    throw (error);
  }
};

exports.getIncomingTransactionsByBlock = async function getIncomingTransactionsByBlock(receivingAddress, blockNumber) {
  try {
    const blockDetails = await web3Instance.eth.getBlock(blockNumber, true);
    const { transactions } = blockDetails;

    const incomingTransactions = [];

    if (transactions.length > 0) {
      for (let i = 0; i < transactions.length; i++) {
        const currentTransaction = transactions[i];
        const currentTransactionToAddress = currentTransaction.to.toLowerCase();

        if (currentTransactionToAddress === receivingAddress) {
          incomingTransactions.push(currentTransaction);
        }
      }
    }

    return incomingTransactions;
  } catch (error) {
    throw error;
  }
};

exports.getConfirmationCount = async function getConfirmationCount(txHash) {
  try {
    const transactionHash = await web3Instance.eth.getTransaction(txHash);
    const currentBlock = await web3Instance.eth.getBlock('latest');

    return transactionHash.blockNumber === null ? 0 : currentBlock.number - transactionHash.blockNumber;
  } catch (error) {
    throw error;
  }
};

exports.getAccountBalance = async function getAccountBalance(address) {
  try {
    const balance = await web3Instance.eth.getBalance(address);

    return balance;
  } catch (error) {
    throw error;
  }
};
