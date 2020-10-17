const express = require('express');
const config = require('../../config');
const { ChildChain, OmgUtil } = require('@omisego/omg-js');
const BigNumber =  require("bn.js");
const Web3 = require("web3");
const wait =  require("../helpers/wait");

const router = express.Router();

const rootChainPlasmaContractAddress = config.plasmaframework_contract_address;
const web3 = new Web3(new Web3.providers.HttpProvider(config.eth_node), null, {
  transactionConfirmationBlocks: 1,
});
const childChain = new ChildChain({
  watcherUrl: config.watcher_url,
  watcherProxyUrl: config.watcher_proxy_url,
  plasmaContractAddress: config.plasmaframework_contract_address,
});

// const senderAddress = config.sender_eth_address;
// const senderPrivateKey = config.sender_eth_address_private_key;
// const receiverAddress = config.receiver_eth_address;
// const transferAmount = new BigNumber(
//   web3.utils.toWei(config.sender_erc20_transfer_amount, "ether")
// );

async function logBalances(senderAddress, receiverAddress) {
    const senderBalanceArray = await childChain.getBalance(senderAddress);
    const senderErc20Object = senderBalanceArray.find(
      (i) =>
        i.currency.toLowerCase() === config.erc20_contract_address.toLowerCase()
    );
    const senderChildchainERC20Balance = senderErc20Object
      ? senderErc20Object.amount
      : 0;
  
    const receiversBalanceArray = await childChain.getBalance(receiverAddress);
    const receiverErc20Object = receiversBalanceArray.find(
      (i) =>
        i.currency.toLowerCase() === config.erc20_contract_address.toLowerCase()
    );
    const receiversChildchainERC20Balance = receiverErc20Object ? receiverErc20Object.amount : 0;
  
    console.log(
      `Sender's childchain ERC20 balance: ${web3.utils.fromWei(
        senderChildchainERC20Balance.toString(),
        "ether"
      )}`
    );
    console.log(
      `Receiver's childchain ERC20 balance: ${web3.utils.fromWei(
        receiversChildchainERC20Balance.toString(),
        "ether"
      )}`
    );
    return { receiverERC20Balance: receiversChildchainERC20Balance };
  }

router.post("/transactionErc20",async(req,res,next)=>{
  const senderAddress = OmgUtil.hexPrefix(req.body.sender_eth_address);
  const senderPrivateKey = OmgUtil.hexPrefix(req.body.sender_eth_address_private_key);
  const receiverAddress = OmgUtil.hexPrefix(req.body.receiver_eth_address);
  const transfer_amount = req.body.transfer_amount;
  const transferAmount = new BigNumber(
    web3.utils.toWei(transfer_amount, "ether")
  );
    let result = {};
    if (!config.erc20_contract_address) {
        console.log("Please define an ERC20 contract address in your .env");
        result.status = false;
        result.msg = "There is missing ERC20 contract address in request";

        res.json(result);
        return next();
      }
      const { receiverERC20Balance } = await logBalances(senderAddress, receiverAddress);
      console.log("-----");
    
      const payments = [
        {
          owner: receiverAddress,
          currency: config.erc20_contract_address,
          amount: transferAmount,
        },
      ];
      const fee = {
        currency: OmgUtil.transaction.ETH_CURRENCY,
      };
    
      const createdTxn = await childChain.createTransaction({
        owner: senderAddress,
        payments,
        fee,
        metadata: "data",
      });
      console.log(
        `Created a childchain transaction of ${web3.utils.fromWei(
          transferAmount.toString(),
          "ether"
        )} ERC20 from sender to receiver.`
      );
      
      // type/sign/build/submit
      const typedData = OmgUtil.transaction.getTypedData(
        createdTxn.transactions[0],
        rootChainPlasmaContractAddress
      );
      const privateKeys = new Array(createdTxn.transactions[0].inputs.length).fill(
        senderPrivateKey
      );
    
      console.log("Signing transaction...");
      const signatures = childChain.signTransaction(typedData, privateKeys);
    
      console.log("Building transaction...");
      const signedTxn = childChain.buildSignedTransaction(typedData, signatures);
    
      console.log("Submitting transaction...");
      const receipt = await childChain.submitTransaction(signedTxn);
      console.log("Transaction submitted: " + receipt.txhash);
    
      console.log("Waiting for a transaction to be recorded by the watcher...");
      const expectedAmount = Number(transferAmount) + Number(receiverERC20Balance);
    
      await wait.waitForBalance(
        childChain,
        receiverAddress,
        expectedAmount,
        config.erc20_contract_address
      );
    
      console.log("-----");
      await logBalances(senderAddress, receiverAddress);
      res.json({
            status : true,
            transactionID: receipt.txhash
        })
    return next();
});

module.exports = router;