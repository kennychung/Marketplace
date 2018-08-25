## Why did you choose to use the design patterns that you applied in this project?
1. I've used some recommended design patterns in case the business faces any issues requiring the contract to be terminated. Because of this possible issue, contract self destruction function has been created. 
2. To save gases on listing products and stores, I've used memory to store the temporary data in memory for the users. 
3. The application need to iterate a mapping to retrieve stores and products listed in the Dapp, the Mapping Iterator pattern has been used such as getStoreCount() and getProductsCount(). 
4. Refund design has been implemented in case there should be refunds to be processed for fraud cases while the fund is stored in the contract.
5. Emergency stop breaker have been implemented for the business emergency issue mentioned in #1.

## What other design patterns have you not used and why didn't you use them?
1. Due to lack of development time and busy with the work, I couldn't spend too much time to adopt "Tight Variable Packing" pattern to reduce the gas requirements. One lesson I've learned from developing a contract was that it can get exepensive if the developer doesn't optimize the contract transaction workflows.
2. I didn't have any Randomness pattern (part of behaviroral pattern) to generate a random number of a predefined internval in the deterministic environment of a blockchain since it wasn't required in this project. However, I wouldn't recommend to use it since it is not yet perfect.