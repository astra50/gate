import React, { Component } from "react"
import GateButton from "../gate-button/gate-button"
import ProgressBar from "../progress-bar/progress-bar"
import "./button-page.less"
import Server from "../../modules/server/CentrifugeServer"

const GATE_INTERVAL = 60
const API_URL = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host.replace(/gate/, 'centrifugo')}/connection/websocket`
const API_CHANNEL = 'gate'
const SEND_FETCH_URL = location.href
const UPDATE_FETCH_URL = location.href
const PASS_LINK_FETCH_URL = ''

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


export default class ButtonPage extends Component {

  state ={
    isConnected: false,
    isError: false,
    timeRemaining: 0,
    text: '',
    timeStart: undefined
  }

  get isActive () { 
    return this.state.timeRemaining == 0 & this.state.isConnected & !this.state.isError
  }

  tick() {
    const currentTime = new Date()
    const timeRemaining = parseInt(GATE_INTERVAL- (currentTime - this.state.timeStart)/1000)
    this.setState({ 
      timeRemaining,
      text: timeRemaining 
     })    
  }


  componentDidMount() {
    const {token, initTimer} = {...getInitData()}
    this.server = new Server({API_URL, API_CHANNEL, token})
        
    this.server.onConnect = async () => {
      this.setState({ isConnected: true })
    }
    
    this.server.onResponse = async data => {
      console.log('Response', data)
      switch (data.open) {
        case 'fail':
          this.setState({timeRemaining: 0, text: 'Ошибка', isError: true})         
          break;
        case 'success':
          this.setState({timeRemaining: +data.remaining_time})
          break;
        default:
          console.log('Непонятно');
      }
    }

    if (initTimer > 0) {
      this.intervalID = setInterval(()=> this.tick(), 1000)
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
    console.log('Жму')
    if (this.isActive) {
      const response = await fetch(SEND_FETCH_URL, {method: 'POST'})
      if(response.ok) {
      }  
    }
  }

  render() {
    const rotate = 360 * (1 - this.state.timeRemaining/GATE_INTERVAL)
    const buttonText = this.isActive ? 'Открыть' : this.state.text
    return (
      <div className="button-page">
        <div className="button-page__logo">
          <img src="/img/astra_logo.png" alt="" className="button-page__logo-img" />
        </div>
        <div className="button-page__button"> 
          <GateButton className="button-page__button-note" 
            value={ buttonText } 
            isActive={ this.isActive } 
            onClick={ this.onClickHandler } />
          <ProgressBar className="button-page__progress-bar" 
            rotate={ rotate } 
            isActive={ this.isActive } />
        </div>
      </div>
      )
  };
}
