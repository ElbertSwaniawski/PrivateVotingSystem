const { ethers } = require("hardhat");

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
        network: "sepolia",
        deployedAt: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber()
    };

    const fs = require('fs');
    const path = require('path');
    const deploymentsDir = path.join(__dirname, '../deployments');
    
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(deploymentsDir, 'sepolia-private-voting.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("Deployment info saved to deployments/sepolia-private-voting.json");
    
    // Wait for a few confirmations before verifying
    console.log("Waiting for confirmations...");
    await privateVotingSystem.deploymentTransaction().wait(5);
    
    console.log("Contract deployed successfully!");
    console.log("You can verify it on Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });