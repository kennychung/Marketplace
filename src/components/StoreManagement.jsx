import React from 'react';
import styled from 'styled-components';
import Product from './MyProduct';
import Button from './Button';

const Wrapper = styled.section`
  padding: 2em;
  background: cadetblue;
`;

const FormWrapper = styled.section`
  margin-top: 20px;
  padding: 2em;
  background: white;
`;

const ProductWrapper = styled.li`
    list-style: none;
    margin: 0;
    padding: 0;
`;

const Name = styled.p`
  align-self: center;
`;

const Desc = styled.p`
  align-self: right;
  width: 100px;
`;

const ProductList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const ProductForm = styled.form`
  margin: auto; 
  width: 100%;
`;

const Label = styled.label`
  margin: auto; 
  width: 500px;
`;

const StoreManagement = ({ myAddress, myStore, myProducts,postProduct,handleInputChange }) => {
    console.log('myStore[name]',myStore.name);
    
    const productList = myProducts.map(product => 
        <Product key={product.id} product={product} />
    );
    if (myStore.name != "Your dont have a store yet. Create your first store!") {
        if (productList.length != 0) {
            return (
                <div>
                    <Wrapper>
                    <h1> My Product Management - {myAddress} </h1>
                    <p>My Product List</p>
                    <ProductWrapper>
                        <ProductList>{productList}</ProductList>
                    </ProductWrapper>
                    </Wrapper>
                    <FormWrapper>
                    <ProductForm>
                        <h2><b>Add your products here</b></h2>
                        <Label>
                            Product Name:
                        </Label>
                        <input type="text" name="_productName" onChange={handleInputChange} />
                        <br />
                        <Label>
                            Description:
                            <input type="text" name="_productDesc" onChange={handleInputChange} />
                        </Label>
                        <br />
                        <Label>
                            Product Price in Ether:
                            <input type="number" name="_productPrice" onChange={handleInputChange} />
                        </Label>
                        <br />
                        <Label>
                            Product Quantity:
                            <input type="number" name="_productQuantity" onChange={handleInputChange} />
                        </Label>
                        <br />
                        <Button type="button" text={ 'Post a Product Now '} onClick={(e) => postProduct(e)} />
                    </ProductForm>
                    </FormWrapper>
                </div>
            );
        }
        else {
            return (
                <div>
                    <h1> My Product Management - {myAddress} </h1>
                    <FormWrapper>
                    
                    <ProductForm>
                    <h2><b>Great! I see that you have created your first store!</b></h2>
                    <h2><b>List your first product by filling out the form below</b></h2>
                        <Label>
                            Product Name:
                        </Label>
                        <br />
                        <input type="text" name="_productName" onChange={handleInputChange} />
                        <br />
                        <Label>
                            Description:
                        </Label>
                        <br />
                        <input type="text" name="_productDesc" onChange={handleInputChange} />
                        <br />
                        <Label>
                            Product Price in Ether:
                        </Label>
                        <br />
                        <input type="number" name="_productPrice" onChange={handleInputChange} />
                        <br />
                        <Label>
                            Product Quantity:
                        </Label>
                        <br />
                        <input type="number" name="_productQuantity" onChange={handleInputChange} />
                        <br />
                        <Button type="button" text={ 'Post a Product Now '} onClick={(e) => postProduct(e)} />
                    </ProductForm>
                    </FormWrapper>
                </div>
            );
        }
    } else {
        return (
            <div>
                <h1> You don't have a store yet, please create a store first! </h1>
                <a href="/mystore">Click here to create your first store</a>
            </div>
        )
    }
    
};

export default StoreManagement;