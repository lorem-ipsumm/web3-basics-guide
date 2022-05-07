require("dotenv").config();
const { ethers } = require("ethers");

// setup and return an ERC20 token based on address
const getToken = async (address, wallet) => {
  return new ethers.Contract(
    address,
    [
      "function symbol() public view returns (string memory)",
      "function name() public view returns (string memory)",
      "function decimals() public view returns (uint8)",
      "function allowance(address owner, address spender) public view returns (uint256)",
      "function approve(address spender, uint256 amount) public returns (bool)",
      "function transfer(address recipient, uint256 amount) public returns (bool)",
      "function balanceOf(address account) public view returns (uint256)"
    ],
    wallet
  );
}

const main = async () => {

  // setup a connection to an Ethereum wallet
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const RPC_ADDRESS = process.env.RPC_ADDRESS;
  const provider = new ethers.providers.JsonRpcProvider(RPC_ADDRESS);
  const wallet = await new ethers.Wallet(PRIVATE_KEY, provider);

  const rawEthBalance = await provider.getBalance("0xe0650bd7a053e30a579491811c8fe56f493ee7ef");
  const ethBalance = ethers.utils.formatUnits(rawEthBalance, 18);

  // setup reference
  const tokenContract = await getToken(
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 
    wallet
  );
  // get token decimals
  const tokenDecimals = await tokenContract.decimals();
  console.log(tokenDecimals);
  // prints: 6
  // get token balance represented as a BigNumber
  const rawTokenBalance = await tokenContract.balanceOf("0x480e4f02df07a736e53baf5ba2c453c47bc2e1e3");
  const tokenBalance = ethers.utils.formatUnits(
    rawTokenBalance,
    tokenDecimals
  );
  console.log(tokenBalance);
  // prints: 100.0

}

main();
