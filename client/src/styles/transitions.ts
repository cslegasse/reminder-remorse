import { keyframes } from "@emotion/react";

export const fadeInLeft = keyframes`
from {
  opacity: 0;
  transform: translateX(-40px)
}
to {
  opacity: 1;
  transform: translateX(0px)
  }
`;
export const fadeIn = keyframes`
from {
  opacity: 0;
}

`;
export const slideIn = keyframes`
  from{
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;
export const slideInBottom = keyframes`
  from{
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(182, 36, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgba(182, 36, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(182, 36, 255, 0);
  }
`;
