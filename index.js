const Web3Utils = require('./web3Utils');~

Web3Utils.getLatestBlock().then(result => {
  console.log(result);
})
