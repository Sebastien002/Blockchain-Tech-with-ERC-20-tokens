const { OmgUtil } = require("@omisego/omg-js");

module.exports = {
  eth_node: ''/*process.env.ETH_NODE*/,
  watcher_url: 'https://watcher-info.ropsten.v1.omg.network',//process.env.WATCHER_URL,
  watcher_proxy_url: process.env.WATCHER_PROXY_URL,
  plasmaframework_contract_address: OmgUtil.hexPrefix('0x96d5d8bc539694e5fa1ec0dab0e6327ca9e680f9'/*process.env.PLASMAFRAMEWORK_CONTRACT_ADDRESS*/),
  erc20_contract_address: OmgUtil.hexPrefix('0xd74ef52053204c9887df4a0e921b1ae024f6fe31'),
//   erc20_contract_address: process.env.ERC20_CONTRACT_ADDRESS
//     ? OmgUtil.hexPrefix(process.env.ERC20_CONTRACT_ADDRESS)
//     : undefined,
  alice_eth_address: OmgUtil.hexPrefix('0x8CB0DE6206f459812525F2BA043b14155C2230C0'),
  alice_eth_address_private_key: OmgUtil.hexPrefix(
    'CD55F2A7C476306B27315C7986BC50BD81DB4130D4B5CFD49E3EAF9ED1EDE4F7'
  ),
  bob_eth_address: OmgUtil.hexPrefix('0xA9cc140410c2bfEB60A7260B3692dcF29665c254'),
  bob_eth_address_private_key: OmgUtil.hexPrefix(
    'E4F82A4822A2E6A28A6E8CE44490190B15000E58C7CBF62B4729A3FDC9515FD2'
  ),
  alice_erc20_deposit_amount: process.env.ALICE_ERC20_DEPOSIT_AMOUNT || "20",
  alice_erc20_transfer_amount: process.env.ALICE_ERC20_TRANSFER_AMOUNT || "0.34",
  millis_to_wait_for_next_block:
    process.env.MILLIS_TO_WAIT_FOR_NEXT_BLOCK || 1000,
  blocks_to_wait_for_txn: process.env.BLOCKS_TO_WAIT_FOR_TXN || 3,
};
