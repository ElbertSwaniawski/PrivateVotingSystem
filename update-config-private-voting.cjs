const fs = require('fs');
const path = require('path');

// Update contract address in config.js after PrivateVotingSystem deployment
function updatePrivateVotingAddress(contractAddress) {
    const configPath = path.join(__dirname, 'frontend', 'public', 'config.js');
    
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Replace the placeholder address
    configContent = configContent.replace(
        /PRIVATE_VOTING: '[^']*'/,
        `PRIVATE_VOTING: '${contractAddress}'`
    );
    
    fs.writeFileSync(configPath, configContent);
    
    console.log(`✅ Updated PrivateVotingSystem contract address to: ${contractAddress}`);
    console.log(`📝 Config file updated at: ${configPath}`);
}

// Export for use in deployment scripts
module.exports = { updatePrivateVotingAddress };

// If called directly, read address from command line
if (require.main === module) {
    const contractAddress = process.argv[2];
    if (!contractAddress) {
        console.error('❌ Please provide contract address as argument');
        console.log('Usage: node update-config-private-voting.js 0x1234567890123456789012345678901234567890');
        process.exit(1);
    }
    
    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
        console.error('❌ Invalid Ethereum address format');
        process.exit(1);
    }
    
    updatePrivateVotingAddress(contractAddress);
}