import React, { Component } from "react"
import GateButton from "../button/gate-button"
import ProgressBar from "../button/gate-button/progress-bar"
import "./button-page.less"
import Server from "../../modules/server/CentrifugeServer"

const GATE_INTERVAL = 60
const API_URL = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host.replace(/gate/, 'centrifugo')}/connection/websocket`
const API_CHANNEL = 'gate'
const SEND_FETCH_URL = location.href
const UPDATE_FETCH_URL = location.href

const ENABLE_CLR = `rgb(3, 146, 85)` // Green
const DISABLE_CLR = `rgba(255, 0, 0)` // Red

function getInitData() {
  const dataNode = document.querySelector('#init-state');
  const data = {
    initTimer: 0,
    token: ''};
  let  initData;

  if (dataNode) {
   initData = {...dataNode.dataset}
   dataNode.remove();
  }
  return Object.assign(data, initData);
}

async function updateGateStatus() {
  const response = await fetch(UPDATE_FETCH_URL, {method:"GET", headers: {'X-Requested-With': 'XMLHttpRequest'}})
  if (response.ok) {
    const json = await response.json()
    return +json.remaining_time
  } else {
    throw new Error(response.toString())
  }
}

export default class ButtonPage extends Component {

  state ={
    isConnected: false,
    isError: false,
    timeRemaining: 0,
    text: '',
    timeStart: undefined
  }

  get isActive () { 
    return this.state.timeRemaining == 0 & this.state.isConnected
  }

  get isConnected() {
    return this.state.isConnected
  }

  get isError() {
    return this.state.isError
  }

  get text() {
    return this.isActive ? 'Открыть' : this.state.text
  }

  startTimer (initTime) {
    const tick = () => {
      const currentTime = new Date()
      const timeRemaining = parseInt(initTime - (currentTime - this.state.timeStart)/1000)
      this.setState({ 
        timeRemaining,
        text: timeRemaining 
       })    
    }
    clearInterval(this.intervalID)
    if(initTime > 0) {
      this.setState({timeStart: new Date(), timeRemaining: initTime})
      this.intervalID = setInterval(()=> tick(), 1000)
    } else {
      this.setState({ 
        timeRemaining: 0
       }) 
    }
  }
 
  initCentrifuge(token) {
    const server = new Server({API_URL, API_CHANNEL, token})
    // Centrifuge on connect
    server.onConnect = async () => {
      this.setState({ isConnected: true })
    }
    // Centrifuge on receive data
    server.onResponse = async data => {
      console.log('Response', data)
      switch (data.open) {
        case 'fail':
          this.setState({text: 'Ошибка', isError: true})
          this.startTimer(0)         
          break;
        case 'success':
          this.setState({isError: false})
          this.startTimer(+data.remaining_time)
          break;
        default:
          console.log('Непонятно');
      }
    }
    // Centrifuge on diconnect
    server.onDisconnect = async () => {
      this.setState({isConnected: false, text: 'Соединение...'})
      this.startTimer(0)
    }
    // Centrifuge on reconnect
    server.onReconnect = async () => {
      this.setState({isConnected: true})
      let timeRemaining;
      try {
        timeRemaining = await updateGateStatus()
        this.setState({isError: false})
        this.startTimer(timeRemaining)
      } catch(e) {
        this.setState({ isError: true, text: 'Ошибка' })
        this.startTimer(0)
      }
    }
    return server
  }


  componentDidMount() {
    const {token, initTimer} = {...getInitData()}
    this.server = this.initCentrifuge(token)
    if (initTimer > 0) {
      this.startTimer(+initTimer)
    }
    this.server.connect()
  }

  componentDidUpdate() {
    if (this.state.timeRemaining == 0) {
      clearInterval(this.intervalID)
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalID)
  }

  onClickHandler = async () => {
    if (this.isActive) {
      try {
          const response = await fetch(SEND_FETCH_URL, {method: 'POST'})
        if(response.ok) {
          this.setState({text: 'OK', isError: false})
        } else {
          this.setState({isError: true})
          this.startTimer(10)
        }  
      } catch (Error) {
        this.setState({isError: true})
        this.startTimer(10)
      }
    }
  }

  get colors() {
    const colors = {
      bar: ENABLE_CLR,
      shadow: ENABLE_CLR
    }
    if (this.isConnected & this.isActive & !this.isError) {
      colors.bar = ENABLE_CLR
      colors.shadow = ENABLE_CLR
    } else if (!this.isConnected | this.isError) {
      colors.bar = DISABLE_CLR
      colors.shadow = DISABLE_CLR
    } else if (!this.isActive & this.isConnected & !this.isError) {
      colors.bar = ENABLE_CLR
      colors.shadow = DISABLE_CLR
    }
    return colors
  }

  render() {
    const rotate = 360 * (1 - this.state.timeRemaining/GATE_INTERVAL)
    return (
      <div className="button-page">
        <div className="button-page__logo">
          <img src="/img/astra_logo.png" alt="" className="button-page__logo-img" />
        </div>
        <div className="button-page__button"> 
          <GateButton className="button-page__button-note" 
            value={ this.text } 
            isActive={ this.isActive } 
            onClick={ this.onClickHandler } />
          <ProgressBar className="button-page__progress-bar"
            colors={ this.colors } 
            rotate={ rotate } 
            isActive={ this.isActive } />
        </div>
      </div>
      )
  };
}
