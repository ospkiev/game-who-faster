import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 20px;
  margin-left: 50px;
`;

const GameArea = styled.div`
  height: 400px;
  width: 600px;
  background-color: #a9b9b5;
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(
    ${(props) =>
      props.mode === 'easy' ? 5 : props.mode === 'normal' ? 7 : 10},
    1fr
  );
  grid-template-rows: repeat(
    ${(props) =>
      props.mode === 'easy' ? 5 : props.mode === 'normal' ? 7 : 10},
    1fr
  );
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Control = styled.div`
  margin-right: 10px;
  font-size: 20px;
`;

const ModeSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 18px;
  cursor: pointer;
  ${(props) => props.disabled && 'opacity: 0.5; cursor: not-allowed;'}
`;

const PlayerInput = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 18px;
`;

const StartButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: #073bd6;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background-color: #14b63d;
  }
  ${(props) => props.disabled && 'opacity: 0.5; cursor: not-allowed;'}
`;

const Cell = styled.div`
  background-color: ${(props) => (props.isColored ? '#000' : '#a9b9b5')};
`;

const Clock = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const GameInfo = styled.div`
  font-size: 18px;
  margin-left: 20px;
`;

const GameInterface = () => {
  const [mode, setMode] = useState('easy');
  const [playerName, setPlayerName] = useState('');
  const [cells, setCells] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameTimes, setGameTimes] = useState({ start: null, end: null });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isGameOver, setIsGameOver] = useState(false);

  const totalCells = useMemo(
    () => (mode === 'easy' ? 25 : mode === 'normal' ? 49 : 100),
    [mode]
  );

  const delay = useMemo(
    () => (mode === 'easy' ? 1000 : mode === 'normal' ? 750 : 500),
    [mode]
  );

  const handleModeChange = (e) => {
    if (!isGameStarted) {
      setMode(e.target.value);
    }
  };

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const startGame = () => {
    if (playerName.trim() === '') {
      alert('Please enter your name to start the game.');
      return;
    }

    console.log(`Game is started in ${mode} mode. Player: ${playerName}`);

    const initialCells = Array(totalCells).fill(false);

    setCells(initialCells);
    setIsGameStarted(true);
    setIsGameOver(false);
    setGameTimes({ start: new Date(), end: null });
  };

  useEffect(() => {
    if (isGameStarted) {
      const intervalId = setInterval(() => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * totalCells);
        } while (cells[randomIndex]);

        const updatedCells = [...cells];
        updatedCells[randomIndex] = true;
        setCells(updatedCells);

        if (!updatedCells.includes(false)) {
          clearInterval(intervalId);
          setIsGameStarted(false);
          setTimeout(() => {
            setIsGameOver(true);
            setGameTimes((prev) => ({ ...prev, end: new Date() }));
          }, 1000);
        }
      }, delay);

      return () => clearInterval(intervalId);
    }
  }, [isGameStarted, mode, cells, totalCells, delay]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isGameOver) {
      setCells(Array(totalCells).fill(false));
    }
  }, [isGameOver, totalCells]);

  return (
    <Container>
      <div>
        <Clock>
          {currentTime.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
          })}
          &nbsp;|&nbsp;
          {currentTime.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Clock>
        <ControlsContainer>
          <Control>
            <label htmlFor='mode'>Select the mode:</label>
            <ModeSelect
              id='mode'
              value={mode}
              onChange={handleModeChange}
              disabled={isGameStarted}
            >
              <option value='easy'>Easy</option>
              <option value='normal'>Normal</option>
              <option value='hard'>Hard</option>
            </ModeSelect>
          </Control>
          <Control>
            <label htmlFor='playerName'>Enter the name:</label>
            <PlayerInput
              id='playerName'
              type='text'
              value={playerName}
              onChange={handlePlayerNameChange}
              disabled={isGameStarted}
            />
          </Control>
          <Control>
            <StartButton onClick={startGame} disabled={isGameStarted}>
              Start game
            </StartButton>
          </Control>
        </ControlsContainer>
        <GameArea mode={mode}>
          {cells.map((cell, index) => (
            <Cell key={index} isColored={cell} />
          ))}
        </GameArea>
      </div>
      <GameInfo>
        {isGameStarted && (
          <div>
            Game started at:{' '}
            {gameTimes.start?.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false,
            })}
            <br />
            Player: {playerName}
            <br />
            Mode: {mode}
          </div>
        )}
        {!isGameStarted && gameTimes.end && (
          <div>
            Game finished at:{' '}
            {gameTimes.end?.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false,
            })}
            <br />
            You can start a new game.
          </div>
        )}
      </GameInfo>
    </Container>
  );
};

export default GameInterface;
