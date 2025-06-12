import React, { useEffect, useState } from 'react';

export const Header = ({
  hand,
  blindTime,
  level,
  winnerPlayers,
  inActivePlayers,
  startNextHand,
  onEndGame,
}) => {
  const [winners, setWinners] = useState([]);
  const [reBuyPlayers, setReBuyPlayers] = useState([]);
  const [newLevel, setNewLevel] = useState(level);
  const [winnersError, setWinnersError] = useState('');


  useEffect(() => {
    setNewLevel(level);
  }, [level]);

  useEffect(() => {
    if (winnerPlayers?.length === 1) {
      setWinners([{
        id: winnerPlayers[0].id,
        amount: +hand.pot_amount + +hand.ante,
      }])
    } else {
      const winnersData = [];
      winnerPlayers.forEach(element => {
        winnersData.push(
          {
            id: element.id,
            amount: 0,
          }
        )
      });
      setWinners(winnersData);
    }
  }, [winnerPlayers]);

  const handleWinner = (id, amount) => {
    const changedWinner = { id, amount };
    const changedWinners = winners.map(item => {
      if (item.id === id) {
        return changedWinner;
      }
      return item;
    });

    if (!winners.some(item => item.id === id)) {
      setWinners([...winners, changedWinner]);
    } else {
      setWinners(changedWinners);
    }
  }

  const handleReBuyChange = (playerId, value) => {
    let data = [];
    if(reBuyPlayers.includes(playerId)) {
      data = reBuyPlayers.filter(player => player.id === playerId);
    } else {
      data = [ ...reBuyPlayers, playerId];
    }
    setReBuyPlayers(data);
  }

  const handleNextHand = () => {
    const totalAmount = winners.reduce((sum, item) => sum + item.amount, 0);
    const expectedTotal = +hand.pot_amount + +hand.ante;
    if (totalAmount !== expectedTotal) {
      setWinnersError('Please enter correct winner amounts');
      return;
    }
    if(winners.length === winnerPlayers.length) {
      startNextHand(winners, newLevel, reBuyPlayers);
      setWinners([]);
      setReBuyPlayers([]);
    }
  }

  
  
  return (
    <div className="flex w-full gap-16 mb-10">
      <div className="w-1/4 flex flex-col gap-2">
        <Item
          label='Blind time'
          value={blindTime}
          isMin
        />
        <WinnersItem
          label='Level'
          classNames='w-[150px]'
          minValue={1}
          value={newLevel || ''}
          onChange={setNewLevel}
        />
        <Item
          label='SB'
          value={hand.small_blind_amount}
        />
        <Item
          label='BB'
          value={hand.big_blind_amount}
        />
      </div>
      <div className="w-1/4 flex flex-col gap-2">
        <Item
          label='Pot'
          value={hand.pot_amount}
        />
        <Item
          label='Ante'
          value={hand.ante}
        />
        {
          hand.current_round === "Showdown" && (
            <div>
              <div className="w-[200px] text-3xl my-2">
                <p>Winners</p>
              </div>
              <div className='flex flex-col gap-2'>
                {
                  winnerPlayers?.map((player) => {
                    const currentWinner = winners?.find(item => item.id === player.id);
                    return (
                      <WinnersItem
                        key={player.id}
                        label={player.name}
                        value={currentWinner?.amount || 0}
                        onChange={(value) => {
                          handleWinner(player.id, value);
                          if (!!winnersError) {
                            setWinnersError('');
                          }
                        }}
                      />
                    )
                  })
                }
              </div>
              {
                !!winnersError && (
                  <p className='text-red-500 text-xl'>{winnersError}</p>
                )
              }
            </div>
          )
        }
      </div>
      <div className="w-1/4 h-[100px] flex flex-col gap-3">
        <div className=" h-[100px] flex items-center gap-3">
          <button
            className="bg-[#00A54F] w-[200px] leading-[34px] p-4 rounded-md disabled:opacity-60"
            disabled={hand.current_round !== "Showdown"}
            onClick={handleNextHand}
          >
            <p className="text-[36px]">Next Hand</p>
          </button>
          <p className="text-[60px] leading-[60px] ">{hand.level}</p>
        </div>
        <div className=" h-[100px] flex items-center">
          <button
            className="bg-red-500 w-[200px] leading-[34px] p-4 rounded-md"
            onClick={onEndGame}
          >
            <p className="text-white text-[36px]">End Game</p>
          </button>
        </div>
      </div>
      {
        !!inActivePlayers?.length && (
          <div className='w-1/4'>
            <div className='mb-5'>
              <p className='text-3xl'> Re Buy Players</p>
            </div>
            {
              inActivePlayers.map((item) => {
                const checked = reBuyPlayers.includes(item.id);

                return (
                  <ReBuyItem
                    key={item.id}
                    label={item.name}
                    value={checked}
                    onChange={(value) => handleReBuyChange(item.id, value)}
                  />
                )
              })
            }
          </div>
        )
      }
    </div>
  )
}

const WinnersItem = ({
  classNames,
  label,
  minValue,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center text-2xl gap-3">
      <div className={`w-[100px] ${classNames}`}>
        <p>{label}</p>
      </div>
      <div className="items-center text-2xl gap-3">
        <input
          name={label}
          type='number'
          value={value}
          min={minValue}
          className="border border-gray-500 h-8 w-[100px] text-center pl-3 flex items-center justify-center"
          onChange={(e) => onChange(+e.target.value)}
        />
      </div>
    </div>
  )
}

const Item = ({
  label,
  value,
  isMin = false,
}) => {
  return (
    <div className="flex items-center text-2xl gap-3">
      <div className="w-[150px]">
        <p>{label}</p>
      </div>
      <div className="border border-gray-500 h-8 min-w-[100px] flex items-center justify-center">
        <p className="leading-none">{value}</p>
      </div>
      {
        isMin && (
          <p>min</p>
        )
      }
    </div>
  )
}

const ReBuyItem = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div class="flex items-center mb-4">
      <input
        id="default-checkbox"
        type="checkbox"
        value={value}
        onChange={(e) => onChange(e.target.checked)}
        className="w-8 h-8 checked:bg-[#00A54F] text-[#00A54F] bg-gray-100 border-gray-300 rounded-sm focus:ring-green-500"
      />
      <label
        htmlFor="default-checkbox"
        className="ms-2 text-xl font-medium text-gray-900"
      >{label}</label>
    </div>
  )
}
