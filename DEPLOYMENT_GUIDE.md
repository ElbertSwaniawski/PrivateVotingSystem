# 🚀 Hello FHEVM - Complete Deployment Guide

**Step-by-Step Instructions for Deploying Your First Confidential Smart Contract**

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 16+ installed
- [ ] Git installed
- [ ] MetaMask browser extension
- [ ] Test ETH on Sepolia network
- [ ] Basic terminal/command line knowledge
- [ ] Text editor (VS Code recommended)

## 🛠️ Step 1: Environment Setup

### 1.1 Clone the Project

```bash
# Clone the repository
git clone <repository-url>
cd hello-fhevm-tutorial

# Or if starting from scratch
mkdir hello-fhevm-tutorial
cd hello-fhevm-tutorial
git init
```

### 1.2 Install Dependencies

```bash
# Install core dependencies
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Install FHEVM dependencies
npm install fhevm @fhevm/solidity fhevmjs

# Install additional tools
npm install dotenv ethers@^5.7.0
```

### 1.3 Initialize Hardhat

```bash
# Initialize Hardhat project
npx hardhat

# Choose: "Create a TypeScript project" or "Create a JavaScript project"
# Accept all defaults
```

### 1.4 Configure Environment Variables

Create a `.env` file in your project root:

```env
# Network Configuration
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here

# API Keys
ETHERSCAN_API_KEY=your_etherscan_api_key

# FHEVM Gateway
FHEVM_GATEWAY_URL=https://gateway.sepolia.zama.ai/
```

⚠️ **Security Warning**:
- Never commit your `.env` file
- Use a dedicated test account for development
- Keep your private keys secure

## 🔧 Step 2: Project Configuration

### 2.1 Update hardhat.config.js

Replace your `hardhat.config.js` with FHEVM-compatible settings:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      // Required for FHEVM
      viaIR: true,
    },
  },
  networks: {
    // FHEVM Local Development
    zama: {
      url: "http://127.0.0.1:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 8009,
    },
    // Sepolia Testnet
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    // Local Development
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
```

### 2.2 Add Package Scripts

Update your `package.json` scripts section:

```json
{
  "scripts": {
    "compile": "npx hardhat compile",
    "test": "npx hardhat test",
    "deploy:local": "npx hardhat run scripts/deploy-hello-fhevm.js --network localhost",
    "deploy:sepolia": "npx hardhat run scripts/deploy-hello-fhevm.js --network sepolia",
    "verify": "npx hardhat verify --network sepolia",
    "node": "npx hardhat node",
    "clean": "npx hardhat clean"
  }
}
```

## 📝 Step 3: Smart Contract Setup

### 3.1 Create the HelloFHEVM Contract

Create `contracts/HelloFHEVM.sol` with the provided contract code.

### 3.2 Compile the Contract

```bash
# Clean previous builds
npm run clean

# Compile contracts
npm run compile
```

Expected output:
```
✅ Compiled 1 Solidity file successfully
✅ HelloFHEVM contract compiled without errors
```

### 3.3 Handle Compilation Issues

If you encounter errors:

**Error: "TFHE not found"**
```bash
# Install FHEVM dependencies
npm install fhevm @fhevm/solidity
```

**Error: "viaIR compilation failed"**
- Ensure `viaIR: true` is set in hardhat.config.js
- Update to Solidity 0.8.19 or higher

**Error: "Out of memory"**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run compile
```

## 🚀 Step 4: Local Development

### 4.1 Start Local Network

```bash
# Terminal 1: Start Hardhat node
npm run node
```

Keep this terminal running. You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### 4.2 Deploy to Local Network

```bash
# Terminal 2: Deploy contract
npm run deploy:local
```

Expected output:
```
🚀 Starting Hello FHEVM Deployment Tutorial
📝 Deploying contracts with account: 0x...
✅ HelloFHEVM Contract Deployed Successfully!
📍 Contract Address: 0x...
```

### 4.3 Add Local Network to MetaMask

1. Open MetaMask
2. Click network dropdown
3. Add network manually:
   - **Network Name**: Hardhat Local
   - **RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 31337
   - **Currency Symbol**: ETH

### 4.4 Import Test Account

1. Copy a private key from the Hardhat node output
2. In MetaMask: Account menu → Import Account
3. Paste the private key
4. You should see 10,000 ETH balance

## 🌐 Step 5: Testnet Deployment

### 5.1 Get Sepolia ETH

1. Visit a Sepolia faucet:
   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - [Infura Sepolia Faucet](https://infura.io/faucet)
   - [Chainlink Sepolia Faucet](https://faucets.chain.link/)

2. Request test ETH for your deployment account
3. Wait for confirmation (usually 1-2 minutes)

### 5.2 Configure Sepolia Network

1. In MetaMask, add Sepolia network:
   - **Network Name**: Sepolia Test Network
   - **RPC URL**: https://sepolia.infura.io/v3/YOUR_KEY
   - **Chain ID**: 11155111
   - **Currency Symbol**: ETH
   - **Block Explorer**: https://sepolia.etherscan.io

### 5.3 Deploy to Sepolia

```bash
# Deploy to Sepolia testnet
npm run deploy:sepolia
```

Expected output:
```
🚀 Starting Hello FHEVM Deployment Tutorial
📝 Deploying contracts with account: 0x...
💰 Account balance: 0.5 ETH
✅ HelloFHEVM Contract Deployed Successfully!
📍 Contract Address: 0x...
🔗 Transaction Hash: 0x...
```

### 5.4 Verify Contract (Optional)

```bash
# Verify on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS

# If constructor arguments are needed
npx hardhat verify --network sepolia CONTRACT_ADDRESS "arg1" "arg2"
```

## 🧪 Step 6: Testing Deployment

### 6.1 Basic Contract Testing

```bash
# Run automated tests
npm run test
```

### 6.2 Manual Testing via Console

```bash
# Open Hardhat console
npx hardhat console --network sepolia

# Test contract interaction
const HelloFHEVM = await ethers.getContractFactory("HelloFHEVM");
const contract = HelloFHEVM.attach("YOUR_CONTRACT_ADDRESS");

// Test product creation
await contract.createProduct("Test Product", "Test Description");
const count = await contract.productCount();
console.log("Product count:", count.toString());
```

### 6.3 Frontend Testing

1. Update frontend configuration with deployed contract address
2. Test MetaMask connection
3. Test product creation
4. Test encrypted vote submission

## 📊 Step 7: Monitoring and Maintenance

### 7.1 Monitor Contract Activity

- **Etherscan**: View transactions and contract interactions
- **Hardhat Network**: Check logs during local development
- **Gas Usage**: Monitor FHE operation costs

### 7.2 Common Issues and Solutions

**Issue: Transaction fails with "out of gas"**
```javascript
// Increase gas limit in deployment script
const tx = await contract.submitEncryptedVote(productId, encryptedRating, {
    gasLimit: 500000  // Increase gas limit
});
```

**Issue: "Invalid encrypted input"**
- Ensure fhevmjs is properly initialized
- Check that input encryption matches expected type (euint8, euint32, etc.)

**Issue: Contract verification fails**
- Check that all import paths are correct
- Ensure constructor arguments match deployment
- Verify using exact compiler settings

### 7.3 Upgrading and Updates

```bash
# Update FHEVM dependencies
npm update fhevm @fhevm/solidity fhevmjs

# Recompile after updates
npm run clean
npm run compile
```

## 🎯 Step 8: Production Considerations

### 8.1 Security Checklist

- [ ] Audit smart contract code
- [ ] Test with multiple users
- [ ] Implement proper access controls
- [ ] Set up monitoring and alerting
- [ ] Plan for emergency procedures

### 8.2 Gas Optimization

- [ ] Minimize FHE operations
- [ ] Batch operations when possible
- [ ] Use appropriate data types (euint8 vs euint32)
- [ ] Implement gas estimation for users

### 8.3 User Experience

- [ ] Clear error messages
- [ ] Loading states for FHE operations
- [ ] Transaction confirmation feedback
- [ ] Mobile responsiveness

## 🎉 Success Metrics

Your deployment is successful if:

✅ Contract compiles without errors
✅ Deployment transaction confirms
✅ Contract is verified on Etherscan
✅ Basic functions work (create product, check counts)
✅ Frontend can interact with contract
✅ Encrypted operations execute correctly

## 🆘 Troubleshooting Guide

### Common Error Messages

**"Error: cannot estimate gas"**
- Check that function parameters are correct
- Ensure account has sufficient ETH
- Verify contract is deployed correctly

**"Error: execution reverted"**
- Check require statements in contract
- Verify function preconditions are met
- Review transaction data for clues

**"Error: insufficient funds"**
- Add more ETH to deployment account
- Check gas price settings
- Consider using a gas station for current prices

### Getting Help

1. **GitHub Issues**: Report bugs and ask questions
2. **Zama Discord**: Community support for FHEVM
3. **Hardhat Discord**: Development environment help
4. **Stack Overflow**: General Web3 questions

## 📚 Next Steps

After successful deployment:

1. **Experiment**: Modify contract features
2. **Learn**: Explore advanced FHEVM concepts
3. **Build**: Create your own confidential application
4. **Share**: Contribute to the FHEVM ecosystem

---

**Congratulations! 🎉**

You've successfully deployed your first FHEVM smart contract. You're now ready to build privacy-preserving decentralized applications!

For support and updates, visit our [GitHub repository](https://github.com/your-repo/hello-fhevm-tutorial).