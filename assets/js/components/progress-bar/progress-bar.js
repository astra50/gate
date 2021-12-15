import React from 'react'
import './progress-bar.less'

const ProgressBar = ({rotate, isActive, className=''}) => {
  const enableColor = `rgb(3, 146, 85)`
  const disableColor = `rgba(255, 0, 0)`
  const barColor = 360 == rotate & !isActive ? disableColor : enableColor
  const lineStyle = {
    transform: `rotate(${rotate}deg)`, 
    backgroundColor: barColor,
  }
  const buttonStyle = {
    boxShadow: `${isActive ? enableColor : disableColor } 0px 0px 20px`
  }
  return (
      <div className={`progress-bar ${className} ${rotate > 180 && 'gt50'}`} style={buttonStyle}>
        <div className="_line" style={lineStyle} />
        <div className="_r-mask" style={rotate > 180? {backgroundColor: barColor} : {}} />
      </div>
    )
}

export default ProgressBar;
