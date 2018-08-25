import React from 'react';
import styled from 'styled-components';
import Button from './Button';

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

const Name = styled.p`
  align-self: center;
`;

const Desc = styled.p`
  align-self: right;
  width: 100px;
`;



const Store = ({ store,visitStore }) => {
    const { name,shortDesc,desc,imgSrc,joinDate,storeOwner,sellerStatus  } = store;
    return (
        <Wrapper>
            <Image src={imgSrc} alt={name} />
            <Name>{name}</Name>
            <Desc>Description: {desc}</Desc>
            <Button text={ 'Visit '} onClick={(e) => visitStore(storeOwner)} />
        </Wrapper>
    );
};


export default Store;