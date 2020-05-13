import ProgressBar from '../modules/progress-bar/Progress-bar';
import GateButton from '../modules/gate-button/Gate-button';
import Server from '../modules/server/CentrifugeServer';

import '../../less/helpers/spinners.less'
import Messenger from '../modules/messager/Messager';
import {MESSAGES, PROGRESS_BAR_COLORS} from './sec-button-vars';
import BackgroundSupervisor
  from '../modules/background-supervisor/BackgroundSupervisor';
import SharingButton from '../modules/sharing-button/Sharing-button';
import SharingModal from '../modules/sharing-button/Sharing-modal';

const SPINNER = '<div class="lds-roller" style="background: #f5f5f5">' +
    '<div></div><div></div><div></div><div></div>' +
    '<div></div><div></div><div></div><div></div></div>'

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

function SecButton() {

  const buttonSelector = '#gate-button';
  const {token, initTimer} = {...getInitData()}
  let isConnected = false;

  const messenger = new Messenger({
    timeout: 10000,
    debug: false
  })

  const progressBar = new ProgressBar(buttonSelector, {
    startColor: PROGRESS_BAR_COLORS.start,
    middleColor: PROGRESS_BAR_COLORS.middle,
    finishColor: PROGRESS_BAR_COLORS.finish,
    size: 180,
    min: 0,
    max: 60,
    start: 60 - initTimer,
    onChangePosition: value => {
      gateBtn.setText(`${60 - Math.round(value)}`, '0.3em');
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
        gateBtn.setText(SPINNER)
        const response = await fetch(SEND_FETCH_URL, {method: 'POST'})
        if(response.ok) {
          gateBtn.setText("OK", '0.3em')
          messenger.createMessage(MESSAGES.onSend.type, MESSAGES.onSend.message)
        } else {
          messenger.createMessage(MESSAGES.onSendError.type, MESSAGES.onSendError.message)
          await changeBarState(50, false)
        }
      } else {
        messenger.createMessage(MESSAGES.onCooldown.type, MESSAGES.onCooldown.message)
      }
    },
  })

  const server = new Server({API_URL, API_CHANNEL, token})

  const changeBarState = async (newValue, animate=true) => {
    const timeRemain = +newValue;
    await progressBar.stopAnimation();
    progressBar.animationTime = 1;
    await progressBar.setValue(60 - timeRemain, animate);
    progressBar.animationTime = timeRemain;
    await progressBar.setValue(60);
  }

  const syncState = async () => {
    let serverTimeRemaining;
    try {
      serverTimeRemaining = await updateGateStatus();
    } catch (e) {
      messenger.createMessage(MESSAGES.onSupervisorError.type, MESSAGES.onSupervisorError.message + e)
      return
    }
    let localTimeRemaining = 60 - progressBar.value
    if (Math.abs(serverTimeRemaining - localTimeRemaining) > 2) {
      console.log("sync complete", localTimeRemaining , '=>', serverTimeRemaining)
      await changeBarState(+serverTimeRemaining)
    }

  }

  server.onConnect = async () => {
    isConnected = true;
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
        if (progressBar.isFull) await changeBarState(10);
        messenger.createMessage(MESSAGES.onResponseError.type, MESSAGES.onResponseError.message);
        break;
      case 'success' :
        messenger.createMessage(MESSAGES.onResponse.type, MESSAGES.onResponse.message)
        await changeBarState(+data.remaining_time)
        break;
      default:
        messenger.createMessage(MESSAGES.onResponseUnknown.type, MESSAGES.onResponseUnknown.message)
    }
  }

  server.onDisconnect = async () => {
    isConnected = false
    messenger.createMessage(MESSAGES.onDisconnect.type, MESSAGES.onDisconnect.message, 0)
    await progressBar.stopAnimation();
    progressBar.animationTime = 1;
    await progressBar.setValue(0, false)
    gateBtn.setText(SPINNER);
  }

  server.onReconnect = async () => {
    isConnected = true
    await messenger.removeAll();
    messenger.createMessage(MESSAGES.onReconnect.type, MESSAGES.onReconnect.message)
    await syncState()
  }

  server.connect();

  const supervisor = new BackgroundSupervisor();

  supervisor.onSelectPage = async () => {
    if (!isConnected) return ;
    if (!progressBar.isRunAnimation) await syncState();
  }

  supervisor.onEvery = async () => {
    if (!isConnected) return ;
    if (progressBar.isRunAnimation) await syncState()
  }

  supervisor.run()

  const sharingModal = new SharingModal('#sharing-popup')
  const sharingButton = new SharingButton('#sharing-button', {
    onShareClick: ()=> {
      sharingModal.show().then(()=> {})
      console.log('открыл')
    },
    onCopy: ()=> {
      messenger.createMessage('success', 'Ссылка скопирована, отправьте ее доверенному человеку')
    },
    onCopyError: ()=> {
      messenger.createMessage('error', 'Ошибка копирования, попробуйте скорировать вручную')
    }
  })

  sharingModal.onSelect = async passObj => {
    let passLink = ''
    try {
      passLink = await getPassLink(passObj.type)
    } catch (e) {
      messenger.createMessage('error', 'Ошибка получения пропуска, сообщите в чат СНТ')
      return
    }
    sharingButton.link = passLink
    sharingButton.mode = 'share'
  }
}

async function getPassLink(passType) {
  return location.href + `/lohpidr-` + passType;
  const response = await fetch(PASS_LINK_FETCH_URL, {method:"GET", headers: {'X-Requested-With': 'XMLHttpRequest'}})
  if (response.ok) {
    const json = await response.json()
    return +json.pass_link
  } else {
    throw new Error(response.toString())
  }
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

export default SecButton;
