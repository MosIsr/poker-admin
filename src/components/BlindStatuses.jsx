

export const BlindStatuses = ({
  blindClassNames,
  isDealer,
  isSmallBlind,
  isBigBlind,
}) => {
  return (
    <div className={`absolute ${blindClassNames}`}>
      {
        isDealer && (
          <div className='w-[50px] h-[50px] rounded-full bg-[#EBABA8] flex items-center justify-center'>
            <p className='text-[44px] font-light leading-[32px]'>D</p>
          </div>
        )
      }
      {
        isSmallBlind && (
          <div className='w-[50px] h-[50px] rounded-full bg-[#CFCC74] flex items-center justify-center'>
            <p className='text-[32px] font-light leading-[32px]'>SB</p>
          </div>
        )
      }
      {
        isBigBlind && (
          <div className='w-[50px] h-[50px] rounded-full bg-[#F2E611] flex items-center justify-center'>
            <p className='text-[32px] font-light leading-[32px]'>BB</p>
          </div>
        )
      }
    </div>
  )
}
