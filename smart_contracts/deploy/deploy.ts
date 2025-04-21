import { Wallet } from "zksync-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { vars } from "hardhat/config";


export default async function (hre: HardhatRuntimeEnvironment) {

  // Initialize the wallet using your private key.
  const wallet = new Wallet(vars.get("DEPLOYER_PRIVATE_KEY"));

  // Create deployer object and load the artifact of the contract we want to deploy.
  const deployer = new Deployer(hre, wallet);
  // Load contract
  const artifact = await deployer.loadArtifact("GrindRun");

  const grindTokenAddress = "0x53B0f690E836E248D074360029a0D8dA4982D2Da";
  // Deploy this contract. The returned object will be of a `Contract` type,
  // similar to the ones in `ethers`.
  const grindRunContract = await deployer.deploy(artifact, [grindTokenAddress]);

  console.log(
    `${
      artifact.contractName
    } was deployed to ${await grindRunContract.getAddress()}`
  );
}