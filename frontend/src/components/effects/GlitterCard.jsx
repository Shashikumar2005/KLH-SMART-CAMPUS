import React from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGlitterCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: 'rgba(30, 41, 59, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `conic-gradient(
      from 0deg,
      transparent 0deg,
      ${theme.palette.primary.main}40 90deg,
      transparent 180deg,
      ${theme.palette.secondary.main}40 270deg,
      transparent 360deg
    )`,
    animation: 'rotate 4s linear infinite',
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    background: theme.palette.background.paper,
    borderRadius: 'inherit',
    zIndex: 1,
  },
  
  '& > *': {
    position: 'relative',
    zIndex: 2,
  },
  
  '&:hover': {
    transform: 'translateY(-4px) scale(1.01)',
    border: `1px solid ${theme.palette.primary.main}`,
    boxShadow: `
      0 20px 60px -10px ${theme.palette.primary.main}40,
      0 0 40px ${theme.palette.secondary.main}30,
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    
    '&::before': {
      opacity: 1,
    },
  },
  
  '@keyframes rotate': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

const GlitterCard = ({ children, ...props }) => {
  return (
    <StyledGlitterCard {...props}>
      {children}
    </StyledGlitterCard>
  );
};

export default GlitterCard;
