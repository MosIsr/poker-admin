import { useEffect, useState } from "react";


export const Player = ({
  index,
  name,
  currentRound,
  amount,
  active,
  raiseAmount,
  allInAmount,
  action,
  actionAmount,
  setPlayerAction,
  currentPlayerTurnId,
}) => {
  console.log('action', action);
  

  useEffect(() => {

  }, [])

  const classNames = [1, 2].includes(index) ? 'top-[80px] -left-[137px]' : '';
  return (
    <div className={`relative w-[100px] ${ action === 'fold' ? 'opacity-60' : 'opacity-100'}`}>
      <div>
        <p className="text-xl text-center">{name}</p>
        <div className="border border-gray-500 h-8 min-w-[100px] flex items-center justify-center">
          <p className="leading-none">{amount}</p>
        </div>
        <div className="h-[20px] flex justify-center">
          {
            action && (
              <>
                <span className="text-md text-black font-bold">{action}</span>
                { actionAmount ? <span className="text-md text-black font-bold ml-2">{actionAmount}</span> : '' }
              </>
            )
          }
        </div>
      </div>
      {
        currentRound !== "Showdown" && currentPlayerTurnId && active && (
          <ActionModal
            classNames={classNames}
            raiseAmount={raiseAmount}
            allInAmount={allInAmount}
            setPlayerAction={setPlayerAction}
          />
        )
      }
    </div>
  )
}


const ActionModal = ({
  classNames,
  raiseAmount,
  allInAmount,
  setPlayerAction,
}) => {
  const [newRaiseAmount, setNewRaiseAmount] = useState(0);

  useEffect(() => {
    setNewRaiseAmount(raiseAmount * 2);
  }, [raiseAmount]);

  console.log('newRaiseAmount', newRaiseAmount);
  
  
  return (
    <div
      className={`absolute border border-gray-500 bg-[#D0D1D3] z-10 mt-1 p-3 space-y-2 ${classNames}`}
    >
      <button
        onClick={() => setPlayerAction('fold')}
        className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
      >
        <p>fold</p>
      </button>
      <button
        onClick={() => setPlayerAction('call', raiseAmount)}
        className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
      >
        <p>call</p>
      </button>
      <button
        onClick={() => setPlayerAction('check')}
        className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
      >
        <p>check</p>
      </button>
      <div className="h-8 flex items-center justify-between gap-3">
        <button
          onClick={() => setPlayerAction('raise', newRaiseAmount)}
          className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
        >
          <p>raise</p>
        </button>
        <input
          name='raise'
          type='number'
          value={newRaiseAmount}
          min={raiseAmount *2}
          max={allInAmount}
          className="border border-gray-500 h-8 w-[100px] bg-[#D0D1D3] px-2 flex items-center justify-center text-center"
          onChange={(e) => setNewRaiseAmount(+e.target.value)}
        />
      </div>
      <div className="h-8 flex items-center justify-between gap-3">
        <button
          onClick={() => setPlayerAction('all-in', allInAmount)}
          className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
        >
          <p>all-in</p>
        </button>
        <div className="w-[100px] h-8 border border-gray-500 flex items-center justify-center">
          <p className="leading-none">{allInAmount}</p>
        </div>
      </div>
    </div>
  )
}

