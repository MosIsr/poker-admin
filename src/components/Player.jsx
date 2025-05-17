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
  isShowCallButton,
  playerActions,
}) => {
  const classNames = [0].includes(index) ? '-top-[80px] left-[120px]' : [1, 2].includes(index) ? 'top-[24px] left-[120px]' : [6, 7].includes(index) ? 'top-[24px] -left-[250px]' : '';

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
            playerActions={ playerActions }
            classNames={classNames}
            raiseAmount={raiseAmount}
            allInAmount={allInAmount}
            setPlayerAction={setPlayerAction}
            isShowCallButton={isShowCallButton}
          />
        )
      }
    </div>
  )
}


const ActionModal = ({
  playerActions,
  classNames,
  setPlayerAction,
}) => {  
  const [newBetAmount, setNewBetAmount] = useState('');
  const [newRaiseAmount, setNewRaiseAmount] = useState('');
  const [newReRaiseAmount, setNewReRaiseAmount] = useState('');

  useEffect(() => {
    setNewBetAmount(playerActions.betMinAmount);
    setNewRaiseAmount(playerActions.raiseMinAmount);
    setNewReRaiseAmount(playerActions.raiseMinAmount);
  }, [playerActions]);

  return (
    <div
      className={`absolute border border-gray-500 bg-custom-gray z-10 mt-1 p-3 space-y-2 ${classNames}`}
    >
      {
        playerActions.isCanFold && (
          <button
            onClick={() => setPlayerAction('fold')}
            className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
          >
            <p>fold</p>
          </button>
        )
      }
      {
        playerActions.isCanCall && (
          <button
            onClick={() => setPlayerAction('call')}
            className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
          >
            <p>call</p>
          </button>
        )
      }
      {
        playerActions.isCanCheck && (
          <button
            onClick={() => setPlayerAction('check')}
            className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
          >
            <p>check</p>
          </button>
        )
      }
      {
        playerActions.isCanBet && (
          <div className="h-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setPlayerAction('bet', newBetAmount)}
              className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
            >
              <p>bet</p>
            </button>
            <input
              name='bet'
              type='number'
              value={newBetAmount || ''}
              min={playerActions.betMinAmount}
              max={playerActions.allInAmount}
              className="border border-gray-500 h-8 w-[100px] bg-[#D0D1D3] px-2 flex items-center justify-center text-center"
              onBlur={(e) => {
                if (e.target.value < playerActions.betMinAmount) {
                  setNewRaiseAmount(playerActions.betMinAmount)
                }
                if (e.target.value > playerActions.allInAmount) {
                  setNewRaiseAmount(playerActions.allInAmount)
                }
              }}
              onChange={(e) => setNewBetAmount(+e.target.value)}
            />
          </div>
        )
      }
      {
        playerActions.isCanRaise && (
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
              value={newRaiseAmount || ''}
              min={playerActions.raiseMinAmount}
              max={playerActions.allInAmount}
              className="border border-gray-500 h-8 w-[100px] bg-[#D0D1D3] px-2 flex items-center justify-center text-center"
              onBlur={(e) => {
                if (e.target.value < playerActions.raiseMinAmount) {
                  setNewRaiseAmount(playerActions.raiseMinAmount)
                }
                if (e.target.value > playerActions.allInAmount) {
                  setNewRaiseAmount(playerActions.allInAmount)
                }
              }}
              onChange={(e) => setNewRaiseAmount(+e.target.value)}
            />
          </div>
        )
      }
      {
        playerActions.isCanReRaise && (
          <div className="h-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setPlayerAction('re-raise', newReRaiseAmount)}
              className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
            >
              <p>re-raise</p>
            </button>
            <input
              name='re-raise'
              type='number'
              value={newReRaiseAmount || ''}
              min={playerActions.raiseMinAmount}
              max={playerActions.allInAmount}
              className="border border-gray-500 h-8 w-[100px] bg-[#D0D1D3] px-2 flex items-center justify-center text-center"
              onBlur={(e) => {
                if (e.target.value < playerActions.raiseMinAmount) {
                  setNewReRaiseAmount(playerActions.raiseMinAmount)
                }
                if (e.target.value > playerActions.allInAmount) {
                  setNewReRaiseAmount(playerActions.allInAmount)
                }
              }}
              onChange={(e) => setNewReRaiseAmount(+e.target.value)}
            />
          </div>
        )
      }
      {
        playerActions.isCanAllIn && (
          <div className="h-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setPlayerAction('all-in', playerActions.allInAmount)}
              className="bg-[#929398] w-[100px] h-8 flex items-center justify-center"
            >
              <p>all-in</p>
            </button>
            <div className="w-[100px] h-8 border border-gray-500 flex items-center justify-center">
              <p className="leading-none">{playerActions.allInAmount}</p>
            </div>
          </div>
        )
      }
    </div>
  )
}

