pragma solidity ^0.4.24;

contract Marketplace {
    address public owner;
    mapping(address => uint) balance;
    uint total_coins = 1;

    constructor() public {
        owner = msg.sender;
    }

    function allCoins() view public returns (uint){
        return total_coins;
    }

    function retrieveAdmin() view public returns (address){
        return owner;
    }

    function printCoin(uint howMuch) public {
        balance[msg.sender] += howMuch;
        total_coins += howMuch;
    }

    function myCoin() view public returns (uint){
        return balance[msg.sender];
    }

}
