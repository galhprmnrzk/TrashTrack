import React from 'react';
import LogoImg from '../assets/logo.png'; 

const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src={LogoImg} 
        alt="TrashTrack Logo" 
        className="w-full" 
      />
    </div>
  );
};

export default Logo;