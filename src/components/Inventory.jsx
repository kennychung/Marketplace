import React from 'react';
import styled from 'styled-components';
import Product from './Product';
const queryString = require('query-string');

const Wrapper = styled.section`
  padding: 2em;
  background: cadetblue;
`;

const ProductList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Inventory = ({ products, buyItNow }) => {
    var storeAddress = queryString.parse(location.search)['storeAddress'];
    console.log('products',products);
    var productList = '';
    var product = '';
    if (storeAddress) {
        productList = products.filter(function(obj) {
            return obj.storeOwner == storeAddress;
        }).map(product => 
            <Product key={product.id} product={product} buyItNow={buyItNow} />
        );
    }
    else {
        productList = products.map(product => 
            <Product key={product.id} product={product} buyItNow={buyItNow} />
        );
    }
    console.log(productList);
    return (
        <div>
            <h1> Available Products to Purchase </h1>
            <Wrapper>
                <ProductList>{productList}</ProductList>
            </Wrapper>
        </div>
    );
};

export default Inventory;