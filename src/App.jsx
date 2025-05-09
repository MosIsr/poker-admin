import { useEffect, useRef, useState } from 'react';
import { Desk } from './components/Desk';
import { Header } from './components/Header';
import { io } from 'socket.io-client';


function App() {
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState(null);
  const [blindTime, setBlindTime] = useState(25);
  const [level, setLevel] = useState(1);
  const [smallBlind, setSmallBlind] = useState(50);
  const socketRef = useRef(null);
  const gameIdRef = useRef(null);


  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5050";

  useEffect(() => {
    
    // const socket = io(backendUrl);
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

    socket.on('game-data', (data) => {
      console.log('game-data:', data);
      if (data && data.hand && data.hand.game_id) {
        gameIdRef.current = data.hand.game_id; // Պահպանեք gameId-ն
        setPlayers(data.players || []);
        setHand(data.hand || null);
        setLevel(data.level);
        setBlindTime(data.blindTime);
      }
    });

    socket.on('game-update', (data) => {
      console.log('game-update received:', data);
      setPlayers(data.players || []);
      setHand(data.hand || null);
      // Միգուցե թարմացնեք լեվելը և բլայնդի ժամանակը այստեղ, եթե դրանք նույնպես փոխվում են
    });
    

    return () => {
      socket.disconnect();
    };
  }, []);

  const handlePlayerAction = (handId, playerId, actionType, betAmount) => {
    console.log("Hand ID: ", handId);
    console.log("Player ID: ", playerId);
    console.log("Action type: ", actionType);
    console.log("Bet amount: ", betAmount);

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
    const data = {
      blindTime,
      smallBlind,
    }
    console.log('data', data);
    
    socketRef.current?.emit('start-game', data);
  }

  const startNextHand = (winners) => {
    socketRef.current?.emit(
      'next-hand',
      { 
        gameId: gameIdRef.current,
        handId: hand.id,
        winners,
      }
    );
  }

  console.log('players', players);
  console.log('hand', hand);
  
  return (
    <div className='w-full h-full min-h-screen bg-[#D0D1D3] text-black pb-[230px]'>
      <div className='w-full h-18 flex justify-center items-center bg-gray-600'>
        <p className='text-[48px] text-white'>Administrator</p>
      </div>
      
      {
        (hand && players) ? (
          <>
            <div className='max-w-[1110px] m-auto p-10'>
              <Header
                hand={hand}
                blindTime={blindTime}
                level={level}
                winnerPlayers={players.filter(item => item.is_active && item.action !== 'fold')}
                startNextHand={startNextHand}
              />
            </div>
            <div className='w-full p-10 mt-10'>
              <Desk
                players={players}
                hand={hand}
                handlePlayerAction={handlePlayerAction}
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
                  <p>Small blind</p>
                </div>
                <input
                  name='small_blind'
                  type='number'
                  value={smallBlind || ''}
                  className="border border-gray-500 h-8 w-[200px] flex items-center justify-center"
                  onChange={(e) => setSmallBlind(+e.target.value)}
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
