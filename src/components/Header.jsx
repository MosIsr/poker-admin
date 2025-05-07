import React, { useState } from 'react';

export const Header = ({
  hand,
  blindTime,
  level,
  winnerPlayers,
}) => {
  const [winners, setWinners] = useState([]);
  console.log('winnerPlayers', winnerPlayers);
  console.log('hand.current_round', hand.current_round);

  const handleWinner2 = (id, amount) => {
    console.log('id, amount', id, amount);
    
    const changedWinner = { id, amount };
    const changedWinners = winners.length ? winners.map(item => {
      if(item.id === id) {
        return changedWinner;
      }
      return item;
    }) : changedWinner;

    setWinners(changedWinners);
  }

  const handleWinner = (id, amount) => {
    console.log('id, amount', id, amount);

    const changedWinner = { id, amount };
    const changedWinners = winners.map(item => {
      if (item.id === id) {
        return changedWinner;
      }
      return item;
    });

    // If the winner is not already in the winners array, add it
    if (!winners.some(item => item.id === id)) {
      setWinners([...winners, changedWinner]);
    } else {
      setWinners(changedWinners);
    }
  }
  
  return (
    <div className="flex w-full gap-16">
      <div className="w-1/3 flex flex-col gap-2">
        <Item
          label='Blind time'
          value={blindTime}
          isMin
        />
        <Item
          label='Level'
          value={level}
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
      <div className="w-1/3 flex flex-col gap-2">
        <Item
          label='Pot'
          value={hand.pot_amount}
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
                        id={player.id}
                        label={player.name}
                        value={currentWinner?.amount}
                        onChange={handleWinner}
                      />
                    )
                  })
                }
              </div>
            </div>
          )
        }
      </div>
      <div className="w-1/3 h-[100px] flex items-center gap-3">
        <button
          className="bg-[#00A54F] w-[200px] leading-[34px] p-4 rounded-md disabled:opacity-60"
          disabled={hand.current_round !== "Showdown"}
        >
          <p className="text-[36px]">Next Hand</p>
        </button>
        <p className="text-[60px] leading-[60px] ">{hand.level}</p>
      </div>
    </div>
  )
}

const WinnersItem = ({
  id,
  label,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center text-2xl gap-3">
      <div className="w-[100px]">
        <p>{label}</p>
      </div>
      <div className="items-center text-2xl gap-3">
        <input
          name={label}
          type='number'
          value={value}
          className="border border-gray-500 h-8 w-[100px] flex items-center justify-center"
          onChange={(e) => onChange(id, +e.target.value)}
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