import { useEffect, useRef, useState } from 'react';
import { Desk } from './components/Desk';
import { Header } from './components/Header';
import { io } from 'socket.io-client';



const players5 = [
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a1",
    name: "Player 1",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: '-top-[40px] right-[120px]',
    blindClassNames: 'top-[30px] right-[220px]',
    isOnline: false,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a2",
    name: "Player 2",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: 'top-[80px] -right-[100px]',
    blindClassNames: 'top-[110px] right-[60px]',
    isOnline: false,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a3",
    name: "Player 3",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: 'bottom-[80px] -right-[100px]',
    blindClassNames: 'bottom-[110px] right-[60px]',
    isOnline: true,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a4",
    name: "Player 4",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: '-bottom-[30px] right-[120px]',
    blindClassNames: 'bottom-[30px] right-[220px]',
    isOnline: false,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a5",
    name: "Player 5",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: '-bottom-[60px] right-[350px]',
    blindClassNames: 'bottom-[10px] right-[370px]',
    isOnline: false,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a6",
    name: "Player 6",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: '-bottom-[30px] left-[120px]',
    blindClassNames: 'bottom-[30px] left-[220px]',
    isOnline: true,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a7",
    name: "Player 7",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: 'bottom-[80px] -left-[100px]',
    blindClassNames: 'bottom-[110px] left-[60px]',
    isOnline: false,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a8",
    name: "Player 8",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames:  'top-[80px] -left-[100px]',
    blindClassNames: 'top-[110px] left-[60px]',
    isOnline: false,
  },
  {
    id: "630fd8b6-7201-436c-bcf6-b27c54f752a9",
    name: "Player 9",
    amount: 0,
    raiseAmount: 300,
    allInAmount: 5000,
    classNames: '-top-[40px] left-[120px]',
    blindClassNames: 'top-[30px] left-[220px]',
    isOnline: true,
  },
];

function App() {
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState(null);
  const [blindTime, setBlindTime] = useState(25);
  const [level, setLevel] = useState(1);
  const [smallBlind, setSmallBlind] = useState(50);
  const socketRef = useRef(null);
  const gameIdRef = useRef(null);


  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || "https://poker-server-fnun.onrender.com";
  console.log('backendUrl', backendUrl);

  useEffect(() => {
    
    const socket = io(backendUrl);
    // const socket = io(process.env.REACT_APP_BACKEND_BASE_URL || "http://localhost:3030");
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
      });
  };



  const handleStartGame = () => {
    const data = {
      blindTime,
      smallBlind,
    }
    console.log('data', data);
    
    socketRef.current?.emit('start-game', data);
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
