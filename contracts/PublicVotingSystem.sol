// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PublicVotingSystem {
    struct Product {
        string name;
        string description;
        address creator;
        uint256 createdAt;
        bool active;
        uint256 totalRating;
        uint256 voteCount;
    }

    struct Vote {
        uint8 rating;
        uint256 timestamp;
        uint256 amount; // Amount paid with the vote
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => address[]) public productVoters;
    
    address public owner;
    uint256 public constant MIN_VOTE_AMOUNT = 0.001 ether;

    event ProductCreated(uint256 indexed productId, address indexed creator, string name);
    event VoteSubmitted(uint256 indexed productId, address indexed voter, uint8 rating, uint256 amount);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    function createProduct(string calldata _name, string calldata _description) external {
        productCount++;
        
        products[productCount] = Product({
            name: _name,
            description: _description,
            creator: msg.sender,
            createdAt: block.timestamp,
            active: true,
            totalRating: 0,
            voteCount: 0
        });

        emit ProductCreated(productCount, msg.sender, _name);
    }

    function submitVote(uint256 _productId, uint8 _rating) external payable {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        require(products[_productId].active, "Product not active");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(msg.value >= MIN_VOTE_AMOUNT, "Insufficient payment for vote");
        require(votes[_productId][msg.sender].timestamp == 0, "Already voted");

        // Record the vote
        votes[_productId][msg.sender] = Vote({
            rating: _rating,
            timestamp: block.timestamp,
            amount: msg.value
        });

        // Update product statistics
        products[_productId].totalRating += _rating;
        products[_productId].voteCount++;
        productVoters[_productId].push(msg.sender);

        emit VoteSubmitted(_productId, msg.sender, _rating, msg.value);
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

    function hasVoted(uint256 _productId, address _voter) external view returns (bool) {
        return votes[_productId][_voter].timestamp > 0;
    }

    function getVote(uint256 _productId, address _voter) 
        external 
        view 
        returns (uint8 rating, uint256 timestamp, uint256 amount) 
    {
        Vote storage vote = votes[_productId][_voter];
        return (vote.rating, vote.timestamp, vote.amount);
    }

    function getProductStats(uint256 _productId) 
        external 
        view 
        returns (uint256 totalRating, uint256 voteCount, uint256 averageRating) 
    {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        
        Product storage product = products[_productId];
        totalRating = product.totalRating;
        voteCount = product.voteCount;
        
        if (voteCount > 0) {
            averageRating = (totalRating * 100) / voteCount; // Average * 100 for precision
        } else {
            averageRating = 0;
        }
    }

    function getProductVoters(uint256 _productId) external view returns (address[] memory) {
        return productVoters[_productId];
    }

    function getUserVoteCount(address _user) external view returns (uint256 count) {
        for (uint256 i = 1; i <= productCount; i++) {
            if (votes[i][_user].timestamp > 0) {
                count++;
            }
        }
    }

    function toggleProductStatus(uint256 _productId) external {
        require(_productId > 0 && _productId <= productCount, "Invalid product ID");
        require(products[_productId].creator == msg.sender, "Not product creator");
        
        products[_productId].active = !products[_productId].active;
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(owner).transfer(balance);
        emit FundsWithdrawn(owner, balance);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        // Allow contract to receive ETH
    }
}