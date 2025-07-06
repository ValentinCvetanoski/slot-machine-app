import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinAnim = keyframes`
  0% { transform: translateY(-200%); }
  100% { transform: translateY(0%); }
`;

const ReelWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 8px;
  overflow: hidden;
  border-radius: 12px;
  background: #11121a;
  box-shadow: 0 0 20px rgba(0,255,255,0.4);
`;

const SymbolImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ${({ spinning }) => spinning ? spinAnim : 'none'} 0.5s ease-out;
`;

export default function Reel({ symbol, spinning }) {
  return (
    <ReelWrapper>
      <SymbolImage src={`/images/${symbol}.png`} alt={symbol} spinning={spinning ? 1 : 0} />
    </ReelWrapper>
  );
}