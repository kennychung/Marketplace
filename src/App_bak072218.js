import React, { Component } from 'react'
import Marketplace from '../build/contracts/Marketplace.json'
import Web3 from 'web3';
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
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

      console.log('Injected web3 detected.');

      resolve(results)
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      //var provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/metamask')
      var provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545/');

      web3 = new Web3(provider)

      results = {
        web3: web3
      }

      console.log('No web3 instance injected, using Local web3.');
			alert('No web3 instance injected, please connect with Metamask or Ledger');
      resolve(results)
    }
  })
});
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3: null
    }
  }
  
  componentWillMount() {
    getWeb3
    .then(results => {
			console.log(results);
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }
  coinCount(){
    marketplace.setProvider(this.state.web3.currentProvider)
    var marketplaceInstance
    console.log("...getting data");
    this.state.web3.eth.getAccounts((error, accounts) => {
        marketplace.deployed().then((instance) => {
        marketplaceInstance = instance
        return marketplaceInstance.allCoins.call({from: accounts[0]})
      }).then((result) => {
        console.log("result", result);
      })
    })
  }
  printCoin(){
		this.state.web3.eth.getAccounts(function(err, accounts){
			if (err != null) alert("An error occurred: "+err);
			else if (accounts.length == 0) alert("User is not logged in to MetaMask");
			else console.log("User is logged in to MetaMask");
		});
    marketplace.setProvider(this.state.web3.currentProvider)
    var marketplaceInstance
    console.log("...setting data");
    this.state.web3.eth.getAccounts((error, accounts) => {
        marketplace.deployed().then((instance) => {
            marketplaceInstance = instance
        return marketplaceInstance.printCoin(4, {from: accounts[0]})
      }).then((result) => {
        console.log("result", result);
      })
    })
  }

  render() {
    return (
      <div>
        <div id="get" onClick={this.coinCount.bind(this)}>GET</div>
        <div id="set" onClick={this.printCoin.bind(this)}>SET</div>
      </div>
    );
  }
}
export default App