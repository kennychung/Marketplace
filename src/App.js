import React, { Component } from 'react';
import contract from 'truffle-contract';
import {
  BrowserRouter,
  Route
} from "react-router-dom";

import Marketplace from '../build/contracts/Marketplace.json';
import getWeb3 from './utils/getWeb3';
import web3 from 'web3';
import Header from './components/Header';
import Inventory from './components/Inventory';
import StoreInventory from './components/StoreInventory';
import StoreManagement from './components/StoreManagement';
import MyStore from './components/MyStore';
import About from './components/About';
import Admin from './components/Admin';
import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';


/*
const TEST_PRODUCT_1 = {
  id: 1,
  name: 'Apple Basket',
  shortDesc: 'It is apple basket',
  imgSrc: './honey.png',
  postDateTime: '1122',
  storeOwner: 1,
  productPrice: 11  
};
*/

const marketplace = contract(Marketplace);
var marketplaceInstance;
var myStoreInfo = {}
var myProductInfo = {}

class App extends Component {
  web3;

  constructor(props) {
    super(props);

    this.state = {        
        storeName : 'Kenny Centralized Shop',
        userStatus : '',
        myStore : {
          name: 'Your dont have a store yet. Create your first store!',
          desc: 'Your description will be displayed here',
          imgSrc: 'https://placekitten.com/200/200'
        },
        myAddress : null,
        myProducts : [],
        myAdmins : [],
        myBalance: 0,
        stores : [],
        products : [],
        newState : {}
    };  
  }

  componentWillMount() {
    getWeb3.then(result => {
      this.instantiateContract();
    }).catch(() => {
      console.error("Failed to initiate web3.");
    });
  }

  instantiateContract() {
    getWeb3
    .then(results => {
			console.log(results)
      this.setState({
        web3: results.web3
      })
      marketplace.setProvider(this.state.web3.currentProvider)
      console.log("...getting data")
      this.setState({
        userStatus : 'Connecting..'
      });
      this.state.web3.eth.getAccounts((error, accounts) => {
        if(!accounts[0]) {
          alert("Did you log into your Metamask yet? If not, please sign in and refresh the page to get started!");
          this.setState({
            userStatus : 'You are not connected'
          })
        }
        else {
          this.setState({
            userStatus : 'You are connected as ' + accounts[0].substring(0,5) + '...'
          })
        }
        this.setState({
          myAddress : accounts[0]
        });
        marketplace.deployed().then((instance) => {
          marketplaceInstance = instance;
          
          this.retreieveAllProductIds();
          this.retreieveAllAdmins();
        }).then((result) => {
          this.retreieveAllStore();
          console.log("result", result)
        })
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  retrieveProductObj = async (productId) => {
    await marketplaceInstance.retrieveProductDetail(productId).then((productDetails) => {
      //name,shortDesc,desc,imgSrc,joinDate,storeOwner,sellerStatus
      const id = productId;
      const name = productDetails[0];
      const shortDesc = productDetails[1];
      const storeOwner = productDetails[2];
      const imgSrc = productDetails[3];
      const postDateTime = this.state.web3.toBigNumber(productDetails[4]).toNumber();
      const productPrice = this.state.web3.toBigNumber(productDetails[5]).toNumber() / 1000000000000000000;

      //console.log('product', { id,name,shortDesc,imgSrc,postDateTime,storeOwner,productPrice });
      
      var productD = { id,name,shortDesc,imgSrc,postDateTime,storeOwner,productPrice };
      if (this.state.myAddress === storeOwner) {
        console.log('productD',productD);
        this.setState({
          myProducts: [...this.state.myProducts,productD]
        });
        console.log('myProducts',this.state.myProducts);
      }
      
      this.setState({
        products: [...this.state.products,productD]
      });
      return { id,name,shortDesc,imgSrc,postDateTime,storeOwner,productPrice };
    })
  };

  retreieveAllProductIds = async () => {
    await marketplaceInstance.getProductIds.call().then((ProductIds) => {
      //console.log('ProductIds',ProductIds);
      this.retrieveAllProductDetails(ProductIds);
    });
  };

  retreieveAllAdmins = async () => {
    await marketplaceInstance.getAdmins.call().then((AdminAddresses) => {
      //console.log('ProductIds',ProductIds);
      this.setState({
        myAdmins: AdminAddresses
      });
      console.log('myAdmins',this.state.myAdmins);
    });
  };

  retrieveAllProductDetails = async (ar) => {
    ar.forEach(async (productId) => {
      //console.log('ProductId',productId);
      await this.retrieveProductObj(productId);
    });
    //console.log('Done');
  };

  retrieveStoreObj = async (_storeAddress) => {
    await marketplaceInstance.retrieveStore(_storeAddress).then((storeDetails) => {
      //name,shortDesc,desc,imgSrc,joinDate,storeOwner,sellerStatus
      const name = storeDetails[0];
      const shortDesc = storeDetails[1];
      const desc = storeDetails[2];
      const imgSrc = storeDetails[3];
      const joinDate = storeDetails[4];
      const storeOwner = storeDetails[5];
      const sellerStatus = this.state.web3.toBigNumber(storeDetails[6]).toNumber();
      //console.log('store', { name,shortDesc,desc,imgSrc,joinDate,storeOwner,sellerStatus });
      
      var storeD = { name,shortDesc,desc,imgSrc,joinDate,storeOwner,sellerStatus };
      if (this.state.myAddress === storeOwner) {
        this.setState({
          myStore : storeD
        });
        console.log('myStore' ,this.state.myStore);
      }
      this.setState({
        stores: [...this.state.stores,storeD]
      });
      console.log(this.state.stores);
      return { name,shortDesc,desc,imgSrc,joinDate,storeOwner,sellerStatus };
    });
  };

  retreieveAllStore = async () => {
    await marketplaceInstance.getStoreAddresses.call().then((StoreAr) => {
      //console.log(StoreAr);
      this.retrieveAllStoreDetails(StoreAr);
    });
    await marketplaceInstance.checkMyBalance.call().then((result) => {
      this.setState({
        myBalance: this.state.web3.toBigNumber(result).toNumber() /1000000000000000000
      });
      console.log('myBalance' ,this.state.myBalance);
    });
  };

  retrieveAllStoreDetails = async (ar) => {
    ar.forEach(async (_storeAddress) => {
      await this.retrieveStoreObj(_storeAddress)
    });
    //console.log('Done');
  };

  addAdmin = async (e) => {
    e.preventDefault();
    console.log('myStoreInfo',myStoreInfo);
    if(!myStoreInfo['_newAdminAddress']){
      alert('All fields are required');
      return;
    }
    await marketplaceInstance.addNewAdmin(
      myStoreInfo['_newAdminAddress'],
      {
        from: this.state.myAddress,
        gas: 400000,
        gasPrice: 100000000000}
    ).then(results => {
      console.log('results',results);
      if (results['tx']){
        alert('Successful! Here is your tx' + results['tx'] + '. Once your tx gets confirmed, your store will be available here')
      }
    }).catch(error => {
      console.log(error);
      alert("Error detected. Please see the console. It is possible that you already have a store or problem with your metamask");
    });
  };

  postStore = async (e) => {
    e.preventDefault();
    console.log('myStoreInfo',myStoreInfo);
    if(!myStoreInfo['_storeName'] || !myStoreInfo['_storeShortDesc'] || !myStoreInfo['_storeDesc'] ) {
      alert('All fields are required');
      return;
    }
    await marketplaceInstance.postStore(
      myStoreInfo['_storeName'],
      myStoreInfo['_storeShortDesc'],
      myStoreInfo['_storeDesc'],
      "https://placekitten.com/350/350",
      0,
      {from: this.state.myAddress, 
        gas: 712388,
        gasPrice: 100000000000}).then(results => {
          console.log('results',results);
          if (results['tx']){
            alert('Successful! Here is your tx' + results['tx'] + '. Once your tx gets confirmed, your store will be available here')
          }
        }).catch(error => {
          console.log(error);
          alert("Error detected. Please see the console. It is possible that you already have a store or problem with your metamask");
        });
  };


  postProduct = async (e) => {
    e.preventDefault();
    console.log('myProductInfo', myProductInfo);
    if(!myStoreInfo['_productName'] || !myStoreInfo['_productDesc'] || !myStoreInfo['_productPrice'] || !myStoreInfo['_productQuantity']) {
      alert('All fields are required');
      return;
    }
    if(myStoreInfo['_productPrice'] < 1){
      alert('Product price should be equal or more than 1 eth');
      return;
    }
    if(myStoreInfo['_productQuantity'] < 1){
      alert('Product quantity should be equal or more than 1');
      return;
    }
    myStoreInfo['_productPrice'] = Number(myStoreInfo['_productPrice']);
    myStoreInfo['_productQuantity'] = Number(myStoreInfo['_productQuantity']);
    if(!Number.isInteger(myStoreInfo['_productPrice'])){
      alert('I am sorry but only integer is available for the price (Due to lack of development time)');
      return;
    }
    if(!Number.isInteger(myStoreInfo['_productQuantity'])){
      alert('Quantity should be integer. Please type integer number again');
      return;
    }
    await marketplaceInstance.postProduct(
      myStoreInfo['_productName'],
      myStoreInfo['_productDesc'],
      "General",
      "https://placekitten.com/320/320",
      myStoreInfo['_productPrice'],
      myStoreInfo['_productQuantity'],
      0,
      0,
      {from: this.state.myAddress, 
        gas: 712388,
        gasPrice: 100000000000}).then(results => {
          console.log('results',results);
          if (results['tx']){
            alert('Successful! Here is your tx' + results['tx'] + '. Once your tx gets confirmed, your product will be available here')
          }
        }).catch(error => {
          console.log(error);
          alert("Error detected. Please see the console. It is possible that you have a problem with your metamask");
        });
  };

  buyItNow = async ( productId, price, storeOwner ) => {
    var productId = this.state.web3.toBigNumber(productId).toNumber();
    console.log('productId',  productId);
    console.log('price',price);
    console.log('storeOwner',storeOwner);
    await marketplaceInstance.buyProduct(
      productId,
      storeOwner,
      {from: this.state.myAddress,
        value: this.state.web3.toWei(price, 'ether'), 
        gas: 652388,
        gasPrice: 100000000000}).then(results => {
          console.log('results',results);
          if (results['tx']){
            alert('Successful! Here is your tx' + results['tx'] + '. Once your tx gets confirmed, your purchase will be successful')
          }
        }).catch(error => {
          console.log(error);
          alert("Error detected. Please see the console. It is possible that you have a problem with your metamask");
        });
  };

  visitStore = (_addr) => {
    console.log('address', _addr);
    window.open("/?storeAddress="+_addr,"_self");
  }

  handleInputChange(event) {
    const target = event.target;
    const value = event.target.value;
    const name = target.name;
    
    if (name.indexOf("store")){ 
      myStoreInfo[name] =value;
    }
    if (name.indexOf("product")){ 
      myProductInfo[name] =value;
    }  
  }

  withdrawMyFund = async (e) =>{
    await marketplaceInstance.withdrawMyBalance(
      {from: this.state.myAddress, 
        gas: 52388,
        gasPrice: 100000000000}).then(results => {
          console.log('results',results);
          if (results['tx']){
            alert('Successful! Here is your tx' + results['tx'] + '. Once your tx gets confirmed, your balance will become available')
          }
        }).catch(error => {
          console.log(error);
          alert("Error detected. Please see the console. It is possible that you have a problem with your metamask");
        });
  }

  render() {
    const { storeName, myStore,myAddress,myProducts,stores,products,userStatus, myAdmins,myBalance } = this.state;
    
    return (
      <BrowserRouter>
        <div className="App">
          <Header name={storeName} userStatus={userStatus}/>
          <main className="container">
            <div className="pure-g">
              <div className="pure-u-1-1">
                <Route
                  exact
                  path="/stores"
                  render={props => (
                    <StoreInventory {...props} stores={stores} visitStore={this.visitStore} />
                  )}
                />
              </div>
            </div>
            <div className="pure-g">
              <div className="pure-u-1-1">
                <Route
                  exact
                  path="/"
                  render={props => (
                    <Inventory {...props} products={products} buyItNow={this.buyItNow} />
                  )}
                />
              </div>
            </div>
            <div className="pure-g">
              <div className="pure-u-1-1">
                <Route
                  exact
                  path="/mystore"
                  render={props => (
                    <MyStore {...props} myAddress={myAddress} myStore={myStore} postStore={this.postStore} handleInputChange={this.handleInputChange} withdrawMyFund={this.withdrawMyFund} myBalance={myBalance} />
                  )}
                />
              </div>
            </div>
            <div className="pure-g">
              <div className="pure-u-1-1">
                <Route
                  exact
                  path="/productmanagement"
                  render={props => (
                    <StoreManagement {...props} myAddress={myAddress} myStore={myStore} myProducts={myProducts} postProduct={this.postProduct} handleInputChange={this.handleInputChange} />
                  )}
                />
              </div>
            </div>
            <div className="pure-g">
              <div className="pure-u-1-1">
                <Route
                  exact
                  path="/about"
                  render={props => (
                    <About {...props} />
                  )}
                />
              </div>
            </div>
            <div className="pure-g">
              <div className="pure-u-1-1">
                <Route
                  exact
                  path="/admin"
                  render={props => (
                    <Admin {...props} myAdmins={myAdmins} myAddress={myAddress} addAdmin={this.addAdmin} handleInputChange={this.handleInputChange} />
                  )}
                />
              </div>
            </div>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;