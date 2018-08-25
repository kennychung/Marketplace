import React from 'react';
import styled from 'styled-components';

const NavBar = styled.nav`
  position: fixed;
  padding: 5px;
  background: #0c1a2b;
  font-family: 'Oswald', 'Arial Narrow', sans-serif;
  display: flex;
  justify-content: space-between;

  & .pure-menu-heading {
    font-weight: bold;
    text-transform: none;
  }

  & .navbar-right {
    float: right;
  }

  & .uport-logo {
    height: 16px;
    margin-right: 10px;
  }
`;

const NavBarLink = styled.a`
  color: #fffff;

  &:active,
  &:focus,
  &:hover {
    background: #233e5e;
  }
`;

const UserStatusLink = styled.p`
  color: #dcf442;

  &:active,
  &:focus,
  &:hover {
    background: #233e5e;
  }
`;

const Header = ({ name, userStatus }) => {
  return (
    <NavBar className="pure-menu">
      <NavBarLink href="/" className="pure-menu-heading pure-menu-link">
        {name}
      </NavBarLink>
      <NavBarLink href="/stores" className="pure-menu-link">
        All Stores
      </NavBarLink>
      <NavBarLink href="/mystore" className="pure-menu-link">
        My Store
      </NavBarLink>
      <NavBarLink href="/productmanagement" className="pure-menu-link">
        My Product Management
      </NavBarLink>
      <NavBarLink href="/admin" className="pure-menu-link">
        Admin Only
      </NavBarLink>
      <NavBarLink href="/about" className="pure-menu-link">
        About This Shop
      </NavBarLink>
      <UserStatusLink>
      {userStatus}
      </UserStatusLink>
    </NavBar>
  );
};

export default Header;