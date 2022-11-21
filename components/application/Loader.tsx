import React from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const blink = keyframes`
    from, 0%, 19.999999%, to {
        opacity: 0;
    }

    20% {
        opacity: 1;
    }

    50%, 80% {
        opacity: 1;
    }
    
    80.000001% {
        opacity: 0;
    }

    100% {
        opacity: 0;
    }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Loader = styled.div`
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  span {
    display: block;
    background-color: #112733;
    animation: ${blink} linear 0.75s infinite;
    opacity: 0;
    margin: 1px;

    &:nth-of-type(1) {
      animation-delay: 0.15s;
    }

    &:nth-of-type(2) {
      animation-delay: calc(0.75s / 4);
    }

    &:nth-of-type(3) {
      animation-delay: calc((0.75s / 4) * 2);
    }

    &:nth-of-type(4) {
      animation-delay: calc((0.75s / 4) * 3);
    }
  }
`;

const LoaderAnimation: React.FC<Omit<React.HTMLProps<HTMLDivElement>, "as">> = (
  props
) => {
  return (
    <Wrapper {...props}>
      <Loader>
        <span />
        <span />
        <span />
        <span />
      </Loader>
    </Wrapper>
  );
};

export default LoaderAnimation;
