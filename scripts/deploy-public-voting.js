const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying Public Voting System contract...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

    // Deploy the contract
    const PublicVotingSystem = await ethers.getContractFactory("PublicVotingSystem");
    const publicVotingSystem = await PublicVotingSystem.deploy();
    await publicVotingSystem.waitForDeployment();

    const contractAddress = await publicVotingSystem.getAddress();
    console.log("PublicVotingSystem deployed to:", contractAddress);
    
    // Create some initial products for testing
    console.log("Creating initial products...");
    
    const products = [
        {
            name: "MetaMask Wallet Extension",
            description: "Browser extension for Ethereum wallet management and Web3 application interaction"
        },
        {
            name: "Uniswap DEX Platform", 
            description: "Decentralized exchange for swapping cryptocurrencies with automated market makers"
        },
        {
            name: "OpenSea NFT Marketplace",
            description: "Leading marketplace for buying, selling, and creating NFTs on multiple blockchains"
        },
        {
            name: "Chainlink Oracle Network",
            description: "Decentralized oracle network providing real-world data to smart contracts"
        }
    ];

    for (let i = 0; i < products.length; i++) {
        const tx = await publicVotingSystem.createProduct(products[i].name, products[i].description);
        await tx.wait();
        console.log(`Created product ${i + 1}: ${products[i].name}`);
    }
    
    // Save deployment info
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployerAddress: deployer.address,
        network: "sepolia",
        deployedAt: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber(),
        productCount: products.length
    };

    const fs = require('fs');
    const path = require('path');
    const deploymentsDir = path.join(__dirname, '../deployments');
    
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    fs.writeFileSync(
        path.join(deploymentsDir, 'sepolia-public-voting.json'),
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("Deployment info saved to deployments/sepolia-public-voting.json");
    
    // Wait for a few confirmations before verifying
    console.log("Waiting for confirmations...");
    await publicVotingSystem.deploymentTransaction().wait(5);
    
    console.log("Contract deployed successfully!");
    console.log("Contract Address:", contractAddress);
    console.log("You can verify it on Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);
    console.log("\nTo update frontend config, run:");
    console.log(`node update-config-public-voting.js ${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });