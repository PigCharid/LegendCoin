async function main() {
  const USDT = await ethers.getContractFactory("Token");
  console.log("Deploying USDT...");
  const _USDT = await USDT.deploy();
  console.log("USDT... deployed to:", _USDT.address);
}

// 这里也可以简化为 main()，后面的都省略也可以
main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });