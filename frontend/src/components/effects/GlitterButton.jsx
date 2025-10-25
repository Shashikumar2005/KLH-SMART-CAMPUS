import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGlitterButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundSize: '200% 200%',
  animation: 'gradientShift 3s ease infinite',
  transition: 'all 0.3s ease',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.03) 10px,
      rgba(255, 255, 255, 0.03) 20px
    )`,
    backgroundSize: '200% 200%',
    animation: 'sparkleMove 20s linear infinite',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: `0 10px 40px ${theme.palette.primary.main}80, 0 0 20px ${theme.palette.secondary.main}60`,
    
    '&::before': {
      left: '100%',
    },
    
    '&::after': {
      opacity: 1,
    },
  },
  
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
  },
  
  '@keyframes gradientShift': {
    '0%, 100%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
  },
  
  '@keyframes sparkleMove': {
    '0%': {
      backgroundPosition: '0% 0%',
    },
    '100%': {
      backgroundPosition: '200% 200%',
    },
  },
}));

const GlitterButton = ({ children, ...props }) => {
  return (
    <StyledGlitterButton {...props}>
      {children}
    </StyledGlitterButton>
  );
};

export default GlitterButton;
