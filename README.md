## What does your project do?
### Decentralized Marketplace

The central marketplace is managed by a group of administrators. Admins allow store owners to add stores to the marketplace. Store owners can manage their store’s inventory and funds. Shoppers can visit stores and purchase goods that are in stock using ETH. 
 
## User Stories:
An administrator opens the web app. The web app reads the address and identifies that the user is an admin under the admin page, showing them admin only functions, such as adding new admins (Only Owner can add new owners) or admin-only functions via web or direct contract call.
 
Anyone can become a store owner if they end up creating a storefront. Once an regular shopper logs into the app and create a store, they will become a store owner while being a shopper. Store owner can create only one store per address. The web app recognizes their address and identifies them as a store owner if they access store management page. They can create a new storefront that will be displayed on the marketplace. They can also see the storefronts that they have already created. They can add products to the storefront or change any of the products’ prices from the product management page. They can also withdraw any funds that the store has collected from sales from the store management page. 
 
A shopper logs into the app. everyone is shown the generic shopper application once the connection established between the user wallet and the contract. From the main page they can browse all of the products that have been listed by the store owners in the marketplace. They can see a list of products offered by the store. Shoppers can purchase a product, which will debit their account and send it to the store. The quantity of the item in the store’s inventory will be reduced by the appropriate amount.

## How to set it up
0. Clone the repo:

    ```shell
    git clone https://github.com/kennychung/Marketplace.git
    cd Marketplace
    ```
    
1. Install the Truffle toolkit globally and install project dependencies:

    ```shell
    npm install -g truffle && npm install
    ```

2. Run the development console from the terminal.
    ```javascript
    truffle develop
    ```
   - Make sure that Truffle Develop started at http://127.0.0.1:9545 or the address configured in Ganache CLI

3. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```
    - Make sure that you receive contract addresses after successfully migrating the contracts locally

4. Run the webpack server for front-end hot reloading (outside the development console). Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run start
    ```
    
5. Truffle can run tests written in Solidity or JavaScript against your smart contracts. Note the command varies slightly if you're in or outside of the development console.
    ```javascript
    // If inside the development console.
    test

    // If outside the development console..
    truffle test
    ```
	- Warning messages are thrown due to the SafeMath library
	- All test cases should pass 

Local - Make sure that your Metamask is connected to http://127.0.0.1:9545 or the address configured in Ganache CLI. 
   - **Note** - Make sure that you reset your account on Metamask when you have a problem connecting to the local server
   - **Note** - Since I didn't get a chance to display loading animation while the transaction is being populated, please wait until you receive a pop-up message for the TX population message and refresh the page after the TX has been confirmed. 

Rinkeby - The Rinkeby contract addresses provided in deployed_addresses.txt

## Libraries used by EthPM package manager
- Safemath has been imported by using EthPM package manager

## Security Tools / Common Attacks
** Explain what measures you’ve taken to ensure that your contracts are not susceptible to common attacks**
Since smart contracts are immutable and once they are deployed, the code cannot be updated or fix any discovered bugs. I've decided to aplly the following functions and checked some of the items to ensure that the contract doesn't fall into any popular pitfalls.
1. OpenZepplin's SafeMath library has been used to prevent any risks by overflow or underflow.
2. Since public calls can be called by anyone, I tried to minimize the # of public functions used in the contract. Also some modifiers are created to have some type of permission levels to access the functions by the various users involved in function calls.
3. I've kept my functions private or internal unless there is a need for any public interactions.
4. To prevent any business emergency issues, I've decided to use delegation to load the contract dynamically from a different address assigned as a delagate. So, the discovered bugs can be fixed with updated smart contract.
5. Fail-Safe mode is in place, so the contract can pause any transactions while the bugs are being fixed.
6. Lastly, I ended up not using any loops that do not have a fixed number of iterations. If the # of iterations in a loop is high and it grows beyond the block gas limit, it is possible that the contract could be stalled at a certain point.

# Extra Assignmeents
** 1. ENS Donation Jar**
- I've created "kenny.etherbase.eth" to meet the additional requirements.

** 2. deployed contracts on the rinkeby testnet **
- The addresses provided in deployed_addresses.txt