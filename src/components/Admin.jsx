import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const Wrapper = styled.section`
  padding: 2em;
  background: cadetblue;
`;

const ProductWrapper = styled.li`
  padding: 1em;
  background: white;
  display: flex;
  justify-content: space-around;
`;

const ProductList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Admin = ({ myAdmins,myAddress, addAdmin,handleInputChange }) => {
    var adminList = myAdmins.map(function(name,index){
        return <li key={index}>{name}</li>;
    });
      console.log('myAdmins?',myAdmins.indexOf(myAddress));
      
    if (myAdmins.indexOf(myAddress) < 0) {
        return (
            <div>
                <h1> This page is not available for you </h1>
                <Wrapper>
                <p>Unfortunately you are not an admin. Please send your request to "kenny.etherbase.eth"</p>
                <p>or you can reach out to one of the following admins</p>
                <ul>{adminList}</ul>
                </Wrapper>
            </div>
        );
    } 
    else {
        return (
            <div>
                <h1> Admin Dashboard </h1>
                <Wrapper>
                <h3> Current Admins </h3>
                {adminList}
                <h3>Functions Available via this Website</h3>
                <form name="adminInfo">
                    <label>
                        New Admin Address:
                        <input type="text" name="_newAdminAddress" onChange={handleInputChange} />
                    </label>
                    <Button type="button" text={ 'Add this address as admin '} onClick={(e) => addAdmin(e)} />
                </form>
                <h3>Functions Available via Contract</h3>
                <ul>
                    <li> Circuit Breaker can be activated via direct contract call - <b>toggleContractActive()</b> </li>
                    <li> Banning stores is available via direct contract call - <b>banStoreOwner(address _storeOwner, bool _isBanned)</b></li>
                </ul>
                </Wrapper>
            </div>
        );
    }
    
};

export default Admin;