import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Board from "./Board";
import runAnimations, { allLinks, allFunctions } from "./scripts";
import backgroundImage from './images/image.png'; 

const Page2 = () => {
  useEffect(() => {
    runAnimations();
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        height: '100vh', 
        
      }}
    >
      <Board />
    </div>
  );
};

export default Page2;
