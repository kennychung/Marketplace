import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 2em;
  background: white;
`;

const ProductList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const About = ({  }) => {
    return (
        <div>
            <h1> About this project </h1>
            <Wrapper>
                <h1> Hi, Consensys Academy Colleagues </h1>
                <p>Thank you for visiting this website. As POC, the design was no so perfect but at least I tried my best to navigate the pages in simple manner, hope you enjoy grading it!</p>
                <p>Github Link: </p>
                <h3>I take donations through ENS address - feel free to send ETH tips to "kenny.etherbase.eth" </h3>
            </Wrapper>
        </div>
    );
};

export default About;