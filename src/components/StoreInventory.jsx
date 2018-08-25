import React from 'react';
import styled from 'styled-components';

import Store from './Store';

const Wrapper = styled.section`
  padding: 2em;
  width:100%;
  background: cadetblue;
`;

const StoreList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;


const StoreInventory = ({ stores,visitStore }) => {
    const storeList = stores.map(store => 
        <Store key={store.id} store={store} visitStore={visitStore} />
    );
    console.log(storeList);
    return (
        <div>
            <h1> Available Stores </h1>
            <Wrapper>
                <StoreList>{storeList}</StoreList>
            </Wrapper>
        </div>
    );
};

export default StoreInventory;