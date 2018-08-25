pragma solidity ^0.4.20;

import "installed_contracts/zeppelin/contracts/math/SafeMath.sol";

//Marketplace contract
contract Marketplace {
    using SafeMath for uint256;
    //Product Status
    enum ProductStatus {
        Available,
        Sold,
        Unsold,
        Pending
    }
    //Product Condition
    enum ProductCondition {
        New,
        Used
    }
    //Seller Status
    enum SellerStatus {
        Gold,
        Silver,
        Bronze        
    }

    bool private stopped = false; //Boolean to switch emergency breaker
    string public storeName; //Store Name
    uint public storeIndex; //Store Id increment
    uint public productIndex; //Product Id increment
    uint public salesIndex; //Sales Id increment
    uint public creationTime; //Contract creation time
    address[] public storeAddresses; //Store address array
    address[] public adminAddresses; //Store address of all admins
    uint256[] public productIdList; //Product Id array
    address public owner; //Owner address of the marketplace contract 
    mapping (address => Admin) admins; //List of admin addresses
    mapping (uint => Product) products; //List of products
    mapping (address => mapping (uint =>Product)) productDetails; //List of product details 
    mapping (address => Store) storeOwners; //List of store owners who manage their store's inventory and funds
    mapping (address => StoreDueDiligence) storeStatus; //List of store due diligence status
    mapping (address => uint[]) productIdInStore; //Product IDs per store
    mapping (uint => uint) productQuantity; //List of product quantities by the product ID
    mapping (uint => Sales) salesLog; //List of sales made in the contract
    mapping (address => uint) sellerBalance; //Total Seller ETH balance

    modifier onlyOwner() { //modifier to check whether the user is admin or not
        require(msg.sender == owner);
        _;
    }

    modifier onlyAfter(uint _time) { //modifier to run function only if it is after sudden time passed
        require(now >= _time);
        _;
    }

    modifier isAdmin() { //modifier to check whther the user is admin or not when the payment was sent to the contract
        if(msg.sender != owner) {
            revert();
        }
        _;
    }

    function toggleContractActive() isAdmin public //Circuit Breakers (Pause contract functionality)
    {        
        stopped = !stopped;
    }

    modifier stopInEmergency { if (!stopped) _; } //stop functions impacted by the circuit breaker
    modifier onlyInEmergency { if (stopped) _; } //run functions impacted by the circuit breaker

    struct Admin { //Admin info struct
        bool isActive;
        uint joinedDateTime;
    }

    struct Store { //Store info struct
        uint storeId;
        string storeName;
        string shortDescription;
        string storeDescription;
        string imgSrc;
        uint joinedDateTime;
        address storeOwner;
        SellerStatus sellerStatus;
    }

    struct StoreDueDiligence { //Store due diligence status struct
        bool isBanned;
        bool isActive;
    }

    struct Product { //Product info struct
        uint productId;
        string productName;
        string productDescription;
        string category;
        string imgSrc;
        uint postDateTime;
        uint productPrice;
        address storeOwner;
        ProductStatus productStatus;
        ProductCondition productCondition;
    }

    struct Sales { //Sales info struct
        uint productId;
        uint saleTimestamp;
        address buyer;
        address seller;
    }

    constructor() public payable { //Constructor to assign initival variable values
        owner = msg.sender;
        storeName = "Ken Decentralized Shop";
        admins[msg.sender].isActive = true;
        admins[msg.sender].joinedDateTime = now;
        adminAddresses.push(msg.sender);
        creationTime = now;
        productIndex = 0;
        storeIndex = 0;
        salesIndex = 0;
    }

    event StoreRegistered(address _storeOwnerAddress); //Event to capture new stores added
    event ProductDelisted(uint256 _productId); //Event to find product delisted
    event ProductDelistedFailed(uint256 _productId); //Event to capture any errors while the product being delisted
    event ProductSold(uint256 _productId, address _buyer); //Event to capture new sold item
    event productPosted(uint _productId, string _productName, string _imgSrc, string _description); //Event to capture new listed item

    function changeOwner(address _newOwner) public onlyOwner 
    {
        //Change the owner of the contract
        admins[msg.sender].isActive = false;
        owner = _newOwner;
        admins[msg.sender].isActive = true;
        admins[msg.sender].joinedDateTime = now;
    }

    function addNewAdmin(address _newAdmin) public onlyOwner
    {
        admins[_newAdmin].isActive = true;
        admins[_newAdmin].joinedDateTime = now;
        adminAddresses.push(_newAdmin);
    }

    function isStoreAvailable(address _storeAddress) public view returns(bool) {
        if (storeOwners[_storeAddress].storeId == 0) {
            //If store hasn't been created, return false
            return false;
        } 
        else{
            //If store hasn been created, return true
            return true;
        }
    }

    function isStoreCreated() public view returns (uint){
        //returns the store ID of the caller
        return storeOwners[msg.sender].storeId;
    }

    function postStore(string _storeName, string _shortDesc, string _storeDesc, string _imgSrc, uint _sellerStatus) public returns(bool){
        require(storeOwners[msg.sender].storeId == 0);
        //Create a store
        storeIndex += 1;
        storeAddresses.push(msg.sender);
        Store memory storeOwner = Store(storeIndex, _storeName, _shortDesc, _storeDesc, _imgSrc, now, msg.sender, SellerStatus(_sellerStatus) );
        storeOwners[msg.sender] = storeOwner;
        StoreDueDiligence memory dueDiligence = StoreDueDiligence(false,false);
        storeStatus[msg.sender] = dueDiligence;
        emit StoreRegistered(msg.sender);
        return true;
    }

    function postProduct(string _productName, string _description, string _category, string _imgSrc, uint _price, uint _quantity, uint _productStatus, uint _productCondition) public {
        require(storeOwners[msg.sender].storeId != 0);
        //List a product
        productIndex += 1;
        uint oneEther = 1 ether;
        uint __price = _price * oneEther;
        Product memory product = Product(productIndex, _productName, _description, _category, _imgSrc, now, __price, msg.sender, ProductStatus(_productStatus), ProductCondition(_productCondition) );
        productQuantity[productIndex] = _quantity;
        productDetails[msg.sender][productIndex] = product;
        products[productIndex] = product;
        productIdInStore[msg.sender].push(productIndex);
        productIdList.push(productIndex);
        emit productPosted(productIndex, _productName, _imgSrc, _description);
    }

    function retrieveStore(address _storeOwner) public view returns (string,string,string,string,uint,address,SellerStatus) {
        //return store details
        return (storeOwners[_storeOwner].storeName,
        storeOwners[_storeOwner].shortDescription,
        storeOwners[_storeOwner].storeDescription,
        storeOwners[_storeOwner].imgSrc,
        storeOwners[_storeOwner].joinedDateTime,
        storeOwners[_storeOwner].storeOwner,
        storeOwners[_storeOwner].sellerStatus);
    }

    function retrieveProducts(address _storeOwner) public view returns (uint[]) {
        //returns a list of product IDs in the store address passed to this function
        return productIdInStore[_storeOwner];
    }

    function retrieveProductDetail(uint _productIndex) public view returns (string,string,address,string,uint,uint) {
        //returns product details of the Product ID passed to this function
        return (
            products[_productIndex].productName,
            products[_productIndex].productDescription,
            products[_productIndex].storeOwner,
            products[_productIndex].imgSrc,
            products[_productIndex].postDateTime,
            products[_productIndex].productPrice
        );
    }

    function retrieveProductConditions(address _storeOwner,uint _productIndex) public view returns (ProductStatus,ProductCondition) {
        //returns product condition status of the product ID passed to this function
        return (
            productDetails[_storeOwner][_productIndex].productStatus,
            productDetails[_storeOwner][_productIndex].productCondition
        );
    }

    function retrieveProductQuantity(uint _productId) public view returns (uint) {
        //returns product quantity of the product ID passed to this function
        return productQuantity[_productId]; 
    }

    function removeProduct(uint productId) public returns (bool){
        //remove the product by calling the product ID of it
        if (productDetails[msg.sender][productId].productId == productId ) {
            productDetails[msg.sender][productId].productStatus = ProductStatus.Unsold;
            emit ProductDelisted(productId);
            return true;
        }
        else {
            emit ProductDelistedFailed(productId);
            return false;
        }
    }

    function modifyProductPrice(uint productId, uint _price) public returns(uint) {
        //modify the product price by passing product ID and new price
        productDetails[msg.sender][productId].productPrice = _price;
        return productDetails[msg.sender][productId].productPrice;
    }

    function modifyStorefrontDetails(string _storeName, string _shortDesc, string _storeDesc, string _imgSrc) public {
        //modify the store front details by passing new values to update
        SellerStatus _sellerStatus = storeOwners[msg.sender].sellerStatus;
        Store memory storeOwner = Store(storeIndex, _storeName, _shortDesc, _storeDesc, _imgSrc, now, msg.sender, _sellerStatus);
        storeOwners[msg.sender] = storeOwner;
    }

    function buyProduct(uint _productId,address seller) public stopInEmergency payable returns (bool) {
        require(productDetails[seller][_productId].productPrice == msg.value );
        require(productQuantity[_productId] > 0);
        //Buy a product by passing the product ID and seller address
        salesIndex += 1;
        salesLog[salesIndex].productId = _productId;
        salesLog[salesIndex].saleTimestamp = now;
        salesLog[salesIndex].buyer = msg.sender;
        salesLog[salesIndex].seller = seller;
        productQuantity[_productId] -= 1;
        sellerBalance[seller] += msg.value;
        emit ProductSold(_productId, msg.sender);
        return true;
    }

    function checkMyBalance() public view returns (uint){
        //check total balance stored in the contract
        return sellerBalance[msg.sender];
    }

    function withdrawMyBalance() public payable returns (uint){
        //withdraw total balance stored in the contract
        require(sellerBalance[msg.sender]>0);
        (msg.sender).transfer(sellerBalance[msg.sender]);
        sellerBalance[msg.sender] = 0;
        return sellerBalance[msg.sender];
    }

    function refundBalance(address buyer,address seller, uint256 amount) onlyOwner public {
        require(sellerBalance[seller]>0,"Seller doesnt have enough fund to refund.");
        //refund balance to the user if the admin finds any fraud or incient
        buyer.transfer(amount);
        sellerBalance[seller] -= amount;
    }

    function banStoreOwner(address _storeOwner, bool _isBanned) onlyOwner public {
        //Ban storeowner if the admin finds any fraud or incident
        if (_isBanned = true) {
            storeStatus[_storeOwner].isActive = false;
            storeStatus[_storeOwner].isBanned = true;
        }
        else {
            storeStatus[_storeOwner].isActive = true;
            storeStatus[_storeOwner].isBanned = false;
        }
    }

    function isStoreBanned(address _storeOwner) public view returns (bool) {
        //returns store ban status
        return storeStatus[_storeOwner].isBanned;
    }
    
    function isStoreActive(address _storeOwner) public view returns (bool) {
        //returns store active status
        return storeStatus[_storeOwner].isActive;
    }

    function activateStoreowner(address _storeOwner, bool _isActive) public{
        //Activate the store to be displayed in the website
        storeStatus[_storeOwner].isActive = _isActive;
    }

    function kill() public onlyInEmergency onlyOwner {
        //Kill the contract if there is any emergency issue
        selfdestruct(owner);
    }

    function getProductsCount() public view returns (uint) {
        //returns total # of products registered including unsold/sold products
        return productIdList.length;
    }

    function getStoresCount() public view returns (uint) {
        //returns total # of stores created including unbanned/banned stores
        return storeAddresses.length;
    }

    function getStoreAddresses() public view returns (address[]) {
        //returns the list of all store addresses
        return storeAddresses;
    }

    function getProductIds() public view returns (uint[]) {
        //returns the list of all product IDs
        return productIdList;
    }

    function getAdmins() public view returns (address[]) {
        //returns the list of all product IDs
        return adminAddresses;
    }
}

