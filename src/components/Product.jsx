import React from 'react';
import styled from 'styled-components';
import Button from './Button';
var moment = require('moment');

const Wrapper = styled.li`
  padding: 1em;
  background: white;
  display: flex;
  justify-content: space-around;
`;

const Image = styled.img`
  align-self: center;
  width: 150px;
  height: 150px;
`;

const Name = styled.span`
  align-self: center;
`;

const Price = styled.span`
  align-self: center;
`;

const Desc = styled.p`
  align-self: center;
`;


const Product = ({ product, buyItNow }) => {
    const { id,name,shortDesc,imgSrc,postDateTime,storeOwner,productPrice } = product;
    var ppostDateTime = new Date(postDateTime * 1000); 
    ppostDateTime = moment(ppostDateTime).fromNow();
    return (
        <Wrapper>
            <Image src={imgSrc} alt={name} />
            <Name>{name}</Name>
            <Price>Price: {productPrice} ETH</Price>
            <Price>Posted {ppostDateTime.toString()}</Price>
            <Desc><b>Description:</b> <br />{shortDesc}</Desc>
            <Button text={ 'Buy Now '} onClick={(e) => buyItNow(id,productPrice, storeOwner)} />
        </Wrapper>
    );
};


export default Product;