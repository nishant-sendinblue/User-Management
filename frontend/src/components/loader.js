
import React from 'react'
import {  Triangle } from 'react-loader-spinner'

function Loader() {
  return (
    <div className='loader'>
            <Triangle
                height="100"
                width="300"
                color='#1976d2'
                ariaLabel='loading'
            />
     </div>
  )
}

export default Loader