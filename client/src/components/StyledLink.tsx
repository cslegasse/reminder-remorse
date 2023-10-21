import styled from "@emotion/styled";
import { ColorPalette } from "@/styles/theme";

export const StyledLink = styled.a`
  cursor: pointer;
  color: ${ColorPalette.purple};
  display: inline-block;
  position: relative;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s all;
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: ${ColorPalette.purple};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
    border-radius: 100px;
  }
  &:hover::after,
  &:focus-visible::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  &:hover {
    text-shadow: 0px 0px 20px ${ColorPalette.purple};
  }
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;
