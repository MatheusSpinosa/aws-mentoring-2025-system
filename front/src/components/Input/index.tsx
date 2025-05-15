import React, { useState } from 'react';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  marginTop?: number;
  register?: any;
}

export function Input({label, marginTop=20, register, ...rest}: IProps) {
  const [focus, setFocus] = useState('')
  return(
    <div 
      onMouseEnter={() => {setFocus('active')}} 
      onMouseOut={() => setFocus('')} 
      className='input-animated' 
      style={{marginTop: marginTop}}
    >
      <input 
        onMouseEnter={() => {setFocus('active')}} 
        onMouseOut={() => setFocus('')} 
        forwardRef={true} className='form_input' placeholder=" " {...register} {...rest} 
      />
      <label 
        onMouseEnter={() => {setFocus('active')}} 
        onMouseOut={() => setFocus('')} 
      className={`form_label ${focus}`} >{label}</label>
    </div>
  )
}