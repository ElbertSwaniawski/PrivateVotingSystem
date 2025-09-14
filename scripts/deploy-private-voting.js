import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log("Deploying Private Voting System contract...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

    // Deploy the contract
    const PrivateVotingSystem = await ethers.getContractFactory("PrivateVotingSystem");
    const privateVotingSystem = await PrivateVotingSystem.deploy();
    await privateVotingSystem.waitForDeployment();

    const contractAddress = await privateVotingSystem.getAddress();
    console.log("PrivateVotingSystem deployed to:", contractAddress);
    
    // Save deployment info
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployerAddress: deployer.address,
        network: "localhost",
        deployedAt: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber()
    };

    const deploymentsDir = path.join(__dirname, '../deployments');
    
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(deploymentsDir, 'localhost-private-voting.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("Deployment info saved to deployments/localhost-private-voting.json");
    
    // Wait for a few confirmations before verifying
    console.log("Waiting for confirmations...");
    await privateVotingSystem.deploymentTransaction().wait(5);
    
    console.log("Contract deployed successfully!");
    console.log("Contract deployed to localhost network at:", contractAddress);
    console.log("\nTo update frontend config, run:");
    console.log(`node update-config-private-voting.js ${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });