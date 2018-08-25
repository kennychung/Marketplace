import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Wrapper = styled.li`
  margin-top: 2px;
  padding: 1em;
  background: white;
  display: flex;
  justify-content: space-around;
`;

const StoreWrapper = styled.li`
  padding: 1em;
  background: white;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.li`
  margin-top: 20px;
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

const MyStore = ({ myStore , postStore,handleInputChange,withdrawMyFund,myBalance }) => {
    const { name,shortDesc,desc,imgSrc,joinDate,storeOwner,sellerStatus  } = myStore;
    if (!shortDesc){
        return (
            <div>
                <h1> My Store Management </h1>
                <Wrapper>
                
                <h1> Create your first store </h1>
                    <form name="storeInfo">
                        <label>
                            Store Name:
                            <input type="text" name="_storeName" onChange={handleInputChange} required />
                        </label>
                        <br />
                        <label>
                            Short Description:
                            <input type="text" name="_storeShortDesc" height="50px" onChange={handleInputChange} />
                        </label>
                        <br />
                        <label>
                            Long Description:
                            <input type="text" name="_storeDesc"  onChange={handleInputChange} />
                        </label>
                        <br />
                        <Button type="button" text={ 'Create a Store Now '} onClick={(e) => postStore(e)} />
                    </form>
                </Wrapper>
            </div>
        );
    }
    else if (myBalance == 0){
        return (
            <div>
                <h1> My Store Management - { myBalance } ether available to withdraw</h1>
                <StoreWrapper>
                    <Image src={imgSrc} alt={name} />
                    <Name>{name}</Name>
                    <Desc>Description: {desc}</Desc>
                </StoreWrapper>

                <ButtonWrapper>
                <h1>Withdraw your balance </h1>
                <button disabled> You have 0 ETH. Please come back once you have any items sold </button>
                </ButtonWrapper>
            </div>
        );
    } else {
        return (
            <div>
                <h1> My Store Management - { myBalance } ether available to withdraw</h1>
                <StoreWrapper>
                    <Image src={imgSrc} alt={name} />
                    <Name>{name}</Name>
                    <Desc>Description: {desc}</Desc>
                </StoreWrapper>

                <ButtonWrapper>
                <h1>Withdraw your balance </h1>
                <Button type="button" text={ 'Withdraw total ' + myBalance + 'ETH' } onClick={(e) => withdrawMyFund(e)} />
                </ButtonWrapper>
            </div>
        );
    }
};

export default MyStore;