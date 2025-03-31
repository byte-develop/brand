import React, { useState } from 'react';

const Game = () => {
  const [bet, setBet] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startGame = (amount) => {
    setBet(amount);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    setBet(0);
  };

  return (
    <div className="">

    </div>
  );
};

export default Game;