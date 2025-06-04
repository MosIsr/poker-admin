import { useEffect, useRef, useState } from 'react';
import { Desk } from './components/Desk';
import { Header } from './components/Header';
import { io } from 'socket.io-client';


function App() {
  const [players, setPlayers] = useState([]);
  const [playerActions, setPlayerActions] = useState({});
  const [hand, setHand] = useState(null);
  const [blindTime, setBlindTime] = useState(25);
  const [level, setLevel] = useState(1);
  const [playersChips, setPlayersChips] = useState(5000);
  const socketRef = useRef(null);
  const gameIdRef = useRef(null);


  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5050";

  useEffect(() => {
    
    const socket = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('ping-server', { message: 'Hello from client' });
    });

    socket.on('pong-client', (data) => {
      console.log('Received from server:', data);
    });

    socket.on('user-data', (data) => {
      console.log('user-data from server:', data);
    });

    socket.on('update-action', (data) => {
      console.log('Update received:', data);
    });

    socket.on('end-game-response', (data) => {
      console.log('end-game-response:', data);
      const { isEndedGame } = data;
      if(isEndedGame) {
        gameIdRef.current = null;
        setPlayers([]);
        setHand(null);
        setLevel(1);
        setBlindTime(25);
        setPlayerActions({})
      }
    });

    socket.emit('get-active-game');

    socket.on('game-data', (data) => {
      console.log('game-data:', data);
      if (data && data.hand && data.hand.game_id) {
        gameIdRef.current = data.hand.game_id;
        setPlayers(data.players || []);
        setHand(data.hand || null);
        setLevel(data.level);
        setBlindTime(data.blindTime);
        setPlayerActions(data.playerActions || {})
      }
    });

    socket.on('game-update', (data) => {
      console.log('game-update received:', data);
      setPlayers(data.players || []);
      setHand(data.hand || null);
      setPlayerActions(data.playerActions || null);
    });
    

    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePlayerAction = (handId, playerId, actionType, betAmount) => {
    socketRef.current?.emit(
      'player-action',
      { 
        gameId: gameIdRef.current,
        handId,
        playerId,
        actionType,
        betAmount,
      }
    );
  };

  const handleStartGame = () => {
    console.log('======== handle StartGame ============');
    
    if(blindTime && playersChips) {
      socketRef.current?.emit('start-game', {
        blindTime,
        playersChips,
      });
    }
  }

  const startNextHand = (winners, gameLevel, reBuyPlayers) => {    
    console.log('======== startNextHand ============');
    
    socketRef.current?.emit(
      'next-hand',
      { 
        gameId: gameIdRef.current,
        handId: hand.id,
        winners,
        gameLevel,
        reBuyPlayers,
      }
    );
  }

  const handleReBuy = (playerId) => {
    console.log('======== handleReBuy ============');
    
    socketRef.current?.emit(
      'player-re-buy',
      { 
        gameId: gameIdRef.current,
        handId: hand.id,
        playerId
      }
    );
  }
  
  const handleEndGame = () => {
    console.log('======== handleEndGame ============');
    socketRef.current?.emit(
      'end-game',
      { gameId: gameIdRef.current }
    );
  }

  return (
    <div className='w-full h-full min-h-screen bg-[#D0D1D3] text-black pb-[230px]'>
      <div className='w-full h-18 flex justify-center items-center bg-gray-600'>
        <p className='text-[48px] text-white'>Administrator</p>
      </div>
      {
        (hand && players) ? (
          <>
            <div className='max-w-[1600px] m-auto p-10'>
              <Header
                hand={hand}
                blindTime={blindTime}
                level={level}
                winnerPlayers={players.filter(item => item.is_active && item.action !== 'fold')}
                inActivePlayers={players.filter(item => !item.is_active)}
                startNextHand={startNextHand}
                onEndGame={handleEndGame}
              />
            </div>
            <div className='w-full p-10 mt-10'>
              <Desk
                players={players}
                hand={hand}
                handlePlayerAction={handlePlayerAction}
                playerActions={playerActions}
                onReBuy={handleReBuy}
              />
            </div>
          </>
        ) : (
          <div className='w-full flex items-center justify-center my-5'>
            <div className='space-y-4'>
              <div className="items-center text-2xl gap-3">
                <div className="w-[150px]">
                  <p>Blind time</p>
                </div>
                <input
                  name='blind_time'
                  type='number'
                  value={blindTime || ''}
                  className="border border-gray-500 h-8 w-[200px] flex items-center justify-center"
                  onChange={(e) => setBlindTime(+e.target.value)}
                />
              </div>
              <div className=" items-center text-2xl gap-3">
                <div className="w-[150px]">
                  <p>Players chips</p>
                </div>
                <input
                  name='players_chips'
                  type='number'
                  value={playersChips || ''}
                  className="border border-gray-500 h-8 w-[200px] flex items-center justify-center"
                  onChange={(e) => setPlayersChips(+e.target.value)}
                />
              </div>
              <button
                className='w-[200px] h-10 bg-green-500 text-white text-lg'
                onClick={handleStartGame}
              >
                Start Game
              </button>

            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;
