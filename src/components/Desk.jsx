import Ellipse from '@/assets/ellipse.svg';
import { Player } from './Player';
import { Fragment } from 'react';
import { BlindStatuses } from './BlindStatuses';

const playersClassNames = [
  {
    classNames: '-top-[50px] right-[120px]',
    blindClassNames: 'top-[30px] right-[220px]',
  },
  {
    classNames: 'top-[80px] -right-[100px]',
    blindClassNames: 'top-[110px] right-[60px]',
  },
  {
    classNames: 'bottom-[80px] -right-[100px]',
    blindClassNames: 'bottom-[110px] right-[60px]',
  },
  {
    classNames: '-bottom-[50px] right-[120px]',
    blindClassNames: 'bottom-[30px] right-[220px]',
  },
  {
    classNames: '-bottom-[80px] right-[350px]',
    blindClassNames: 'bottom-[10px] right-[370px]',
  },
  {
    classNames: '-bottom-[50px] left-[120px]',
    blindClassNames: 'bottom-[30px] left-[220px]',
  },
  {
    classNames: 'bottom-[80px] -left-[100px]',
    blindClassNames: 'bottom-[110px] left-[60px]',
  },
  {
    classNames:  'top-[80px] -left-[100px]',
    blindClassNames: 'top-[110px] left-[60px]',
  },
  {
    classNames: '-top-[50px] left-[120px]',
    blindClassNames: 'top-[30px] left-[220px]',
  },
];

export const Desk = ({
  players,
  hand,
  handlePlayerAction,
  playerActions,
}) => {
  return (
    <div className='w-full flex items-center justify-center'>
      <div className="relative w-[830px] h-[400px]">
        <img
          src={Ellipse}
          className='w-full h-full'
        />
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='w-full h-full relative'>
            <div className="absolute top-1/2 left-1/2 w-[282px] h-[128px] transform -translate-x-1/2 -translate-y-1/2">
              <p className='text-4xl text-center font-semibold'>{hand.current_round}</p>
              <div className='flex gap-2 mt-2'>
                {
                  hand.current_round !== 'Preflop' ? (
                    <>
                      <div className='w-[50px] h-[80px] bg-[#929398]'></div>
                      <div className='w-[50px] h-[80px] bg-[#929398]'></div>
                      <div className='w-[50px] h-[80px] bg-[#929398]'></div>
                    </>
                  ) : null
                }
                {
                  !['Preflop', 'Flop'].includes(hand.current_round) ? (
                    <>
                      <div className='w-[50px] h-[80px] bg-[#929398]'></div>
                    </>
                  ) : null 
                }
                {
                  !['Preflop', 'Flop', 'Turn'].includes(hand.current_round) ? (
                    <>
                      <div className='w-[50px] h-[80px] bg-[#929398]'></div>
                    </>
                  ) : null 
                }
              </div>
            </div>
            {
              players.map((player, index) => {
                const isDealer = hand.dealer === player.id;
                const isSmallBlind = hand.small_blind === player.id;
                const isBigBlind = hand.big_blind === player.id;
                const currentPlayerTurnId = hand.current_player_turn_id === player.id;
                const classNames = playersClassNames[index];
                return (
                  <Fragment key={player.id}>
                    <BlindStatuses
                      blindClassNames={classNames.blindClassNames}
                      isDealer={isDealer}
                      isSmallBlind={isSmallBlind}
                      isBigBlind={isBigBlind}
                    />
                    <div className={`absolute ${classNames.classNames}`}>
                      {
                        player.is_active ? (
                          <Player
                            index={index}
                            currentRound={hand.current_round}
                            name={player.name}
                            amount={+player.amount}
                            active={player.is_active}
                            action={player.action}
                            actionAmount={+player.action_amount}
                            raiseAmount={+hand.last_raise_amount}
                            allInAmount={+player.amount}
                            currentPlayerTurnId={currentPlayerTurnId}
                            setPlayerAction={(action, amount) => handlePlayerAction(hand.id, player.id, action, amount)}
                            isShowCallButton={player.action_amount !== hand.current_max_bet}
                            playerActions={playerActions}
                          />
                        ) : (
                          <div className={`relative w-[100px] opacity-60`}>
                            <div>
                              <p className="text-xl text-center">{player.name}</p>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </Fragment>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

