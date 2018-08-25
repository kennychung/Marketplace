import React, { Component } from 'react'
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom"
import Home from "./Home"
import Stores from "./Stores"
import Products from "./Products"
import AboutUs from "./AboutUs"
import Marketplace from '../build/contracts/Marketplace.json'
import Web3 from 'web3'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
var storeDetails = []
const contract = require('truffle-contract')
const marketplace = contract(Marketplace)
const getWeb3 = new Promise(function (resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)
      results = {
        web3: web3
      }

      console.log('Injected web3 detected.')

      resolve(results)
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      //var provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/metamask')
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545/')

      web3 = new Web3(provider)

      results = {
        web3: web3
      }

      console.log('No web3 instance injected, using Local web3.')
			alert('No web3 instance injected, please connect with Metamask or Ledger')
      resolve(results)
    }
  })
})
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3: null,
      products: null,
      isAdmin : null,
      storeDescriptions: [

      ]
    }
  }
  
  componentWillMount() {
    console.log("componentWillMount")
    getWeb3
    .then(results => {
			console.log(results)
      this.setState({
        web3: results.web3
      })
      marketplace.setProvider(this.state.web3.currentProvider)
      var marketplaceInstance
      console.log("...getting data")
      this.state.web3.eth.getAccounts((error, accounts) => {
        marketplace.deployed().then((instance) => {
          marketplaceInstance = instance
          return marketplaceInstance.getStoresCount.call()
        }).then((result) => {
          console.log("result", result)
        })
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }
  componentDidMount(){
    console.log("componentDidMount")
  }

  //buyProduct(uint _productId,address seller) 
  buyProduct(){
		this.state.web3.eth.getAccounts(function(err, accounts){
			if (err != null) alert("An error occurred: "+err)
			else if (accounts.length === 0) alert("User is not logged in to MetaMask")
			else console.log("User is logged in to MetaMask")
    })
    let productPrice = this.state.web3.toWei(1, "ether")
    marketplace.setProvider(this.state.web3.currentProvider)
    var marketplaceInstance
    console.log("...setting data")
    this.state.web3.eth.getAccounts((error, accounts) => {
      marketplace.deployed().then((instance) => {
        marketplaceInstance = instance
        return marketplaceInstance.buyProduct(3,accounts[0],{from: accounts[0], value: productPrice, gas: 4712388,gasPrice: 100000000000})
      }).then((result) => {
        console.log("result", result)
      })
    })
  }

  //postProduct("Apple","My description","Fruit", "http://www.google.com/hoy.jpg",12, 3,0,0)
  postProduct(){
		this.state.web3.eth.getAccounts(function(err, accounts){
			if (err != null) alert("An error occurred: "+err)
			else if (accounts.length === 0) alert("User is not logged in to MetaMask")
			else console.log("User is logged in to MetaMask")
		})
    marketplace.setProvider(this.state.web3.currentProvider)
    var marketplaceInstance
    console.log("...setting data")
    this.state.web3.eth.getAccounts((error, accounts) => {
      marketplace.deployed().then((instance) => {
        marketplaceInstance = instance
        return marketplaceInstance.postProduct("Pear","My description","Fruit", "http://www.google.com/hoy.jpg",1*1000000000000000000, 3,0,0,{from: accounts[0], gas: 4712388,gasPrice: 100000000000})
      }).then((result) => {
        console.log("result", result)
      })
    })
  }

  retrieveProducts(){
		this.state.web3.eth.getAccounts(function(err, accounts){
			if (err != null) alert("An error occurred: "+err)
			else if (accounts.length === 0) alert("User is not logged in to MetaMask")
			else console.log("User is logged in to MetaMask")
		})
    marketplace.setProvider(this.state.web3.currentProvider)
    var marketplaceInstance
    console.log("...setting data")
    this.state.web3.eth.getAccounts((error, accounts) => {
      marketplace.deployed().then((instance) => {
        marketplaceInstance = instance
        return marketplaceInstance.retrieveProducts(accounts[0])
      }).then((result) => {
        console.log("result", result)
      })
    })
  }
  
  //postStore("Kenny shop","My short description","My Long Description","http://www.google.com/img.jpg",0)
  postStore(){
		this.state.web3.eth.getAccounts(function(err, accounts){
			if (err != null) alert("An error occurred: "+err)
			else if (accounts.length === 0) alert("User is not logged in to MetaMask")
			else console.log("User is logged in to MetaMask")
		})
    marketplace.setProvider(this.state.web3.currentProvider)
    var marketplaceInstance
    console.log("...setting data")
    this.state.web3.eth.getAccounts((error, accounts) => {
      marketplace.deployed().then((instance) => {
        marketplaceInstance = instance
        return marketplaceInstance.postStore("Jessica shop","My short description","My Long Description","http://www.google.com/img.jpg",0,{from: accounts[0], gas: 4712388,gasPrice: 100000000000})
      }).then((result) => {
        console.log("result", result)
      })
    })
  }

  retrieveStore(){
		this.state.web3.eth.getAccounts(function(err, accounts){
			if (err != null) alert("An error occurred: "+err)
			else if (accounts.length === 0) alert("User is not logged in to MetaMask")
			else console.log("User is logged in to MetaMask")
		})
    marketplace.setProvider(this.state.web3.currentProvider)
    var marketplaceInstance
    console.log("...setting data")
    this.state.web3.eth.getAccounts((error, accounts) => {
      marketplace.deployed().then((instance) => {
        marketplaceInstance = instance
        
        marketplaceInstance.getStoresCount().then((_totalLength) => {
          console.log("a:" + _totalLength.toNumber())
          let totalLength = Number(_totalLength)
          return totalLength
        }).then((totalLength) => {
          storeDetails = []
          for (let i = 0 ; i< totalLength ; i++) {
            marketplaceInstance.getStoreAddress(i).then((storeAddress) => {
              return storeAddress 
            }).then((storeAddress) => {
              marketplaceInstance.retrieveStore(storeAddress).then((result) => {
                storeDetails.push(result)
              })
            })
          }   
        })
      }).then(()=>{
        console.log(storeDetails)
        this.setState({
          storeDescriptions: storeDetails
        });
      })
    })
  }

  render() {
    //if ()
    return (
      <HashRouter>
      <div>
        <h1>Decentralized Craigslist</h1>
        <ul className="header">
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink to="/stores">Stores</NavLink></li>
          <li><NavLink to="/products">All Products</NavLink></li>
          <li><NavLink to="/aboutus">About Us</NavLink></li>
        </ul>
        <div className="content">
          <Route exact path="/" component={Home}/>
          <Route path="/stores" component={Stores}/>
          <Route path="/products" component={Products}/>
          <Route path="/aboutus" component={AboutUs}/>
        </div>
        <div id="postStore" onClick={this.postStore.bind(this)}>Post a store</div>
        <div id="retrieveStore" onClick={this.retrieveStore.bind(this)}>Retrieve a store</div>
        <div id="postProduct" onClick={this.postProduct.bind(this)}>Post a product</div>
        <div id="retrieveProducts" onClick={this.retrieveProducts.bind(this)}>Retrieve products</div>
        <div id="buyProduct" onClick={this.buyProduct.bind(this)}>buyProduct</div>
        <div>
          
        </div>
      </div>
      </HashRouter>
    )
  }
}
export default App