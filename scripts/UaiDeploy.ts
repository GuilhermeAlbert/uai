import { ethers } from "hardhat";

async function main() {
  const initialSupply = 100_000_000; // 100 milhões de tokens
  const UaiCoin = await ethers.getContractFactory("UaiCoin");
  const uaicoin = await UaiCoin.deploy(initialSupply);

  await uaicoin.deployed();

  console.log(`UaiCoin deployed to: ${uaicoin.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
