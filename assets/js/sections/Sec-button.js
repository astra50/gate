import ProgressBar from '../modules/progress-bar/Progress-bar';
import GateButton from '../modules/gate-button/Gate-button';
import Server from '../modules/server/CentrifugeServer';

import '../../less/helpers/spinners.less'
import Messenger from '../modules/messager/Messager';
import {MESSAGES, PROGRESS_BAR_COLORS} from './sec-button-vars';

const SPINNER = '<div class="lds-roller" style="background: #f5f5f5">' +
    '<div></div><div></div><div></div><div></div>' +
    '<div></div><div></div><div></div><div></div></div>'

const API_URL = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host.replace(/gate/, 'centrifugo')}/connection/websocket`
const API_CHANNEL = 'gate'
const FETCH_URL = location.href


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

function SecButton() {

  const buttonSelector = '#gate-button';
  const {token, initTimer} = {...getInitData()}
  let lastTimer = 0;

  const messenger = new Messenger()

  const progressBar = new ProgressBar(buttonSelector, {
    startColor: PROGRESS_BAR_COLORS.start,
    middleColor: PROGRESS_BAR_COLORS.middle,
    finishColor: PROGRESS_BAR_COLORS.finish,
    size: 180,
    min: 0,
    max: 60,
    start: 60 - initTimer,
    onChangePosition: value => {
      gateBtn.setText(`${60 - Math.round(value)}c.`, '0.3em');
      gateBtn.deactivateButton()
    },
    onComplete: () => {
      gateBtn.setText('Открыть', '0.2em');
      gateBtn.activateButton();
    }
  })

  const gateBtn = new GateButton(buttonSelector, {
    message: SPINNER,
    fontSize: '0.2em',
    size: 170,
    onClick: async () => {
      if (progressBar.isFull) {
        const response = await fetch(FETCH_URL, {method: 'POST'})
        if(response.ok) {
          messenger.createMessage(MESSAGES.onSend.type, MESSAGES.onSend.message)
        } else {
          messenger.createMessage(MESSAGES.onSendError.type, MESSAGES.onSendError.message)
        }
      } else {
        messenger.createMessage(MESSAGES.onCooldown.type, MESSAGES.onCooldown.message)
      }
    },
  })

  const server = new Server({API_URL, API_CHANNEL})

  const changeBarState = async (newValue, animate) => {
    const timeRemain = +newValue;
    await progressBar.stopAnimation();
    progressBar.animationTime = 1;
    await progressBar.setValue(60 - timeRemain, animate);
    progressBar.animationTime = timeRemain;
    await progressBar.setValue(60);
  }

  server.onConnect = async () => {
    await messenger.removeAll();
    await changeBarState(initTimer)
    if (!server.isOnceConnect)
      messenger.createMessage(MESSAGES.onConnect.type, MESSAGES.onConnect.message)
  }
  /***
   *
   * @param {string} data.open response status
   * @param {int} data.remaining_time cooldown time
   * @returns {Promise<void>}
   */
  server.onResponse = async data => {
    switch (data.open) {
      case 'fail':
        messenger.createMessage(MESSAGES.onResponseError.type, MESSAGES.onResponseError.message);
        if (progressBar.isFull) await changeBarState(10);
        break;
      case 'success' :
        messenger.createMessage(MESSAGES.onResponse.type, MESSAGES.onResponse.message)
        await changeBarState(+data.remaining_time || 60)
        break;
      default:
        messenger.createMessage(MESSAGES.onResponseUnknown.type, MESSAGES.onResponseUnknown.message)
    }
  }

  server.onDisconnect = async () => {
    messenger.createMessage(MESSAGES.onDisconnect.type, MESSAGES.onDisconnect.message, 0)
    await progressBar.stopAnimation();
    lastTimer = 60 - progressBar.value;
    progressBar.animationTime = 1;
    await progressBar.setValue(0, false)
    gateBtn.setText(SPINNER);
  }

  server.onReconnect = async () => {
    await messenger.removeAll();
    messenger.createMessage(MESSAGES.onReconnect.type, MESSAGES.onReconnect.message)
    await changeBarState(lastTimer, false)
  }

  server.connect(token);

}

export default SecButton;
