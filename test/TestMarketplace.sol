pragma solidity 0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Marketplace.sol";

contract TestMarketplace {
    Marketplace marketplace = new Marketplace();
    function testSettingAnOwnerDuringCreation() public {
        //As msg.sender is the owner of this contract, owner variable should return msg.sender address
        Assert.equal(marketplace.owner(), this, "An owner is same as a deployer");
    }

    function testStoresFunctions() public {
        //As there is no store created by msg.sender, isStoreAvailable() returns false
        Assert.equal(marketplace.isStoreAvailable(this), false, "It should return False as there is no store created by this address");        
        
        //postStore() should return true after store is successfully created by the seller
        Assert.equal(marketplace.postStore("Kenny shop","My short description","My Long Description","http://www.google.com/img.jpg",0),true,"It should return True as the store has been added");
        
        //getStoresCount() should return 1 after the store was created
        Assert.equal(marketplace.getStoresCount(),1,"It should return 1 as there is only one store created");
        
        //As there is one store created by msg.sender, isStoreAvailable() returns true
        Assert.equal(marketplace.isStoreAvailable(this), true, "It should return True as the store has been created by this address");
        
        //Since the store is not activated by the admin, isStoreActive() should return False
        Assert.equal(marketplace.isStoreActive(this), false, "It should return False as it has not been approved by the admin");
        
        //Revise the storefront details
        marketplace.modifyStorefrontDetails("Kenny shop","My short description","My Long Description","http://www.google.com/img.jpg");
        
        //Activate the store by the admin
        marketplace.activateStoreowner(this,true);
        
        //Since the store has been activated by the admin, isStoreActive() should return True
        Assert.equal(marketplace.isStoreActive(this), true, "It should return True as it has been approved by the admin");
    }

    function testProductFunctions() public {
        //Add first product
        marketplace.postProduct("Pear","My pear is better than yours","Fruit", "http://via.placeholder.com/350x150",1, 3,0,0);
        //Add second product
        marketplace.postProduct("Apple","My apple has great taste","Fruit", "http://via.placeholder.com/350x150",2, 3,0,0);
        
        //Since there are two products listed, getProductsCount should return 2
        Assert.equal(marketplace.getProductsCount(), 2, "It should return 2 as there are total 2 products added");
        
        //Since seller hasn't sold any item, the total balance should be 0
        Assert.equal(marketplace.checkMyBalance(),0,"There should be 0 ether as total balance since there was no transaction");
        
    }   
}