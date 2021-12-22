import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import Server from '../modules/server/CentrifugeServer';
import CentrifugeContext from '../context/centrifuge';


const API_CHANNEL = 'gate'
const API_URL = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host.replace(/gate/, 'centrifugo')}/connection/websocket`

function Main ()  {

  const {token, initTimer} = {...getInitData()}
  const server = new Server({API_URL, API_CHANNEL, token})
  return (
    <CentrifugeContext.Provider value={server}>
      <App/>
    </CentrifugeContext.Provider>
  )
}

ReactDOM.render(<Main/>, document.getElementById('root'))

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
