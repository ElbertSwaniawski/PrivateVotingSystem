// Anonymous Voting System Configuration - Sepolia Deployment

const CONFIG = {
    // Network Configuration
    NETWORK: {
        NAME: 'Localhost',
        CHAIN_ID: 31337,
        CHAIN_ID_HEX: '0x7a69',
        RPC_URL: 'http://127.0.0.1:8545',
        EXPLORER_URL: 'http://localhost:8545',
        FAUCET_URL: 'http://localhost:8545'
    },
    
    // Smart Contract Addresses (will be updated after deployment)
    CONTRACTS: {
        PRIVATE_VOTING: '0xF8976BA463c31f4A0fbD6948Da43a77e74EE4196' // PrivateVotingSystem FHE contract
    },
    
    // Gas Settings (20 gwei for cost efficiency)
    GAS: {
        PRICE: '20000000000', // 20 gwei
        LIMIT: '200000'
    },
    
    // FHE Configuration
    FHE: {
        ENABLED: true,
        PROVIDER: 'Zama',
        VERSION: '0.5.0',
        ENCRYPTION_TYPE: 'TFHE',
        GATEWAY_URL: 'https://gateway.sepolia.zama.ai/'
    },
    
    // App Settings
    APP: {
        NAME: 'Anonymous Voting System',
        VERSION: '1.0.0',
        DESCRIPTION: 'Anonymous Product Rating System with FHE Encryption',
        FEATURES: [
            'Anonymous Rating Submission',
            'Encrypted Vote Storage',
            'Privacy-Preserving Aggregation',
            'User Experience Evaluation'
        ]
    }
};

// Global access - updated for new naming
window.CONFIG = CONFIG;

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

console.log('⭐ Anonymous Voting System Configuration Loaded');
console.log('📊 Contract deployed on localhost network');
console.log('🚀 Ready for anonymous product rating with FHE!');