// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Simplified version without FHE for now - can be enhanced later
contract PrivateVotingSystem {
    struct Product {
        string name;
        string description;
        address creator;
        uint256 totalRating;
        uint256 totalVotes;
        uint256 createdAt;
        bool active;
    }

    struct Vote {
        uint8 rating; // 1-5 stars 
        uint256 timestamp;
        bool exists;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;
    mapping(uint256 => mapping(address => Vote)) public productVotes;
    mapping(address => uint256[]) public userVotes;

    event ProductCreated(uint256 indexed productId, address indexed creator, string name);
    event VoteSubmitted(uint256 indexed productId, address indexed voter);
    event ProductStatusChanged(uint256 indexed productId, bool active);

    function createProduct(
        string calldata _name,
        string calldata _description
    ) external {
        productCount++;
        
        products[productCount] = Product({
            name: _name,
            description: _description,
            creator: msg.sender,
            totalRating: 0,
            totalVotes: 0,
            createdAt: block.timestamp,
            active: true
        });

        emit ProductCreated(productCount, msg.sender, _name);
    }

    function submitVote(
        uint256 _productId,
        uint8 _rating
    ) external {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        require(products[_productId].active, "Product not active");
        require(!productVotes[_productId][msg.sender].exists, "Already voted");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        // Store the vote
        productVotes[_productId][msg.sender] = Vote({
            rating: _rating,
            timestamp: block.timestamp,
            exists: true
        });

        // Update product totals
        products[_productId].totalRating += _rating;
        products[_productId].totalVotes += 1;

        userVotes[msg.sender].push(_productId);

        emit VoteSubmitted(_productId, msg.sender);
    }

    function hasVoted(uint256 _productId, address _voter) 
        external 
        view 
        returns (bool) 
    {
        return productVotes[_productId][_voter].exists;
    }

    function getUserVoteCount() external view returns (uint256) {
        return userVotes[msg.sender].length;
    }

    function getUserVotedProducts() external view returns (uint256[] memory) {
        return userVotes[msg.sender];
    }

    function getProductInfo(uint256 _productId) 
        external 
        view 
        returns (
            string memory name,
            string memory description,
            address creator,
            uint256 createdAt,
            bool active
        ) 
    {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        
        Product storage product = products[_productId];
        return (
            product.name,
            product.description,
            product.creator,
            product.createdAt,
            product.active
        );
    }

    function toggleProductStatus(uint256 _productId) external {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        require(products[_productId].creator == msg.sender, "Not product creator");
        
        products[_productId].active = !products[_productId].active;
        emit ProductStatusChanged(_productId, products[_productId].active);
    }

    function getProductStats(uint256 _productId) 
        external 
        view 
        returns (uint256 totalRating, uint256 voteCount, uint256 averageRating) 
    {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        
        Product storage product = products[_productId];
        totalRating = product.totalRating;
        voteCount = product.totalVotes;
        
        if (voteCount > 0) {
            averageRating = (totalRating * 100) / voteCount; // Average * 100 for precision
        } else {
            averageRating = 0;
        }
    }
}