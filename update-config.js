const fs = require('fs');
const path = require('path');

// Update contract address in config.js after deployment
function updateContractAddress(contractAddress) {
    const configPath = path.join(__dirname, 'frontend', 'public', 'config.js');
    
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Replace the placeholder address
    configContent = configContent.replace(
        'PRODUCT_FEEDBACK_VOTING: \'0x0000000000000000000000000000000000000000\'',
        `PRODUCT_FEEDBACK_VOTING: '${contractAddress}'`
    );
    
    // Also update the window.CONFIG assignment for backwards compatibility
    configContent = configContent.replace(
        'CONTRACT_ADDRESS = window.CONFIG?.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"',
        `CONTRACT_ADDRESS = window.CONFIG?.CONTRACTS?.PRODUCT_FEEDBACK_VOTING || "${contractAddress}"`
    );
    
    fs.writeFileSync(configPath, configContent);
    
    console.log(`✅ Updated contract address to: ${contractAddress}`);
    console.log(`📝 Config file updated at: ${configPath}`);
}

// Export for use in deployment scripts
module.exports = { updateContractAddress };

// If called directly, read address from command line
if (require.main === module) {
    const contractAddress = process.argv[2];
    if (!contractAddress) {
        console.error('❌ Please provide contract address as argument');
        console.log('Usage: node update-config.js 0x1234567890123456789012345678901234567890');
        process.exit(1);
    }
    
    updateContractAddress(contractAddress);
}