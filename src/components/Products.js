import React from 'react';
import { Card, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const CardStyled = styled.div`
.item {
  display: inline-block;
  padding: .5em;
  font-size: 22px;
  margin: .5rem;
  width: 20rem;
  height: 25rem;
  background-color: white;
}
.image {
  width: 18rem;
  height: 10rem;
}
`;

export const Products = props => {
  return (
  <CardStyled>
    <Card className='item'>
      <Card.Img variant='top' src={props.image} className='image' />
      <hr />
      <Card.Body>
        <Card.Title>
          {props.title}
          </Card.Title>
          <Card.Text>
          {props.text}
        </Card.Text>
          <Button >
            <LinkContainer>
              <Link to={props.pay}>
                {props.price}
              </Link>
            </LinkContainer>
          </Button>
      </Card.Body>
    </Card>
  </CardStyled>
  );
}