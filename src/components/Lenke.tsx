import styled from 'styled-components';

const Lenke = styled.a`
    font-family: "Source Sans Pro", sans-serif;
    line-height: 1.1;
    background-color: transparent;
    color: rgb(0, 103, 197);
    background: none;
    text-decoration: none;
    border-bottom: 1px solid rgb(183, 177, 169);
    cursor: pointer;
    font-size: 0.9em;
    &:hover{
      border-bottom: 1px solid rgb(0, 103, 197);
    }
`;

export default Lenke;
