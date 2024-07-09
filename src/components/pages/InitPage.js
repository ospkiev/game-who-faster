import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color:#14b63d;
`;

const Greet = styled.h3`
  font-size: 24px;
  font-weight: 500;
  margin: 0;
`;

const Link = styled.a`
  text-decoration: none;
  color: #000;
  margin-left: 20px;
  &:hover {
    color: #fff;
  }
`;

const InitPage = () => {
  return (
    <Wrapper>
      <Greet>Welcome to the game! Have Fun!</Greet>
      <div>
        <Link href='/' title='About'>
          About
        </Link>
        <Link href='/' title='Contact'>
          Contacts
        </Link>
      </div>
    </Wrapper>
  );
};

export default InitPage;
