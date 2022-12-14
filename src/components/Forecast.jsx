import React from 'react'
import {IconUrl} from '../services/weatherService'

function Forecast({title, items}) {
  return (
    <div>
        <div className='flex items-center justify-start mt-6 '>
            <p className='text-white font-bold uppercase'>{title}</p>
        </div>
        <hr className='my-2'/>
        <div className='flex flex-row items-center justify-between text-white'>

          {items.map((item, index) => (
            <div className='flex flex-col items-center justify-center' key={index}>
                <p className='text-sm font-light'>{item.title}</p>

                <img 
                src={IconUrl(item.icon)} 
                alt="icon"  
                className='w-12 my-1'/>

                <p className='font-medium'>{`${item.temp.toFixed()}°`}</p>
            </div>
          ))}

        </div>
    </div>
  )
}

export default Forecast