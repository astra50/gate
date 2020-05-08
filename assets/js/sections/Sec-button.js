import ProgressBar from '../modules/progress-bar/Progress-bar';
import GateButton from '../modules/gate-button/Gate-button';
import Server from '../modules/server/CentrifugeServer';

import '../../less/helpers/spinners.less'
import Messenger from '../modules/messager/Messager';

const PROGRESS_BAR_START_COLOR = [194, 4, 55];
const PROGRESS_BAR_MIDDLE_COLOR = [214, 121, 4];
const PROGRESS_BAR_FINISH_COLOR = [3, 146, 85];
const SPINNER = '<div class="lds-roller" style="background: #f5f5f5">' +
    '<div></div><div></div><div></div><div></div>' +
    '<div></div><div></div><div></div><div></div></div>'
const API_URL = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host.replace(/gate/, 'centrifugo')}/connection/websocket`
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

  window.m = messenger;

  const progressBar = new ProgressBar(buttonSelector, {
    startColor: PROGRESS_BAR_START_COLOR,
    middleColor: PROGRESS_BAR_MIDDLE_COLOR,
    finishColor: PROGRESS_BAR_FINISH_COLOR,
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
        const response = await fetch(FETCH_URL)
        if(response.ok) {
          messenger.createMessage('success', 'Все получилось! Хорошого дня!')
        } else {
          messenger.createMessage('error', 'Похоже что-то сломалось, сообщите в чат СНТ')
        }
      } else {
        messenger.createMessage('error', 'Подожди немного, ворота не железные')
      }
    },
  })

  const server = new Server(API_URL)

  const changeBarState = async newValue => {
    const timeRemain = +newValue;
    await progressBar.stopAnimation();
    progressBar.animationTime = 1;
    await (progressBar.setValue(60 - timeRemain));
    progressBar.animationTime = timeRemain;
    await progressBar.setValue(60);
  }

  server.onConnect = async () => {
    await changeBarState(initTimer)
    messenger.createMessage('info', 'Соединение с воротами установлено')
  }

  server.onResponse = async data => {
    await changeBarState(+data.time || 60)
    messenger.createMessage('info', 'Похоже ворота сейчас откроются')
  }

  server.onDisconnect = async () => {
    messenger.createMessage('error', 'Нет соединения с воротам, пытаюсь найти контакт...', 0)
    await progressBar.stopAnimation();
    lastTimer = 60 - progressBar.value;
    progressBar.animationTime = 1;
    await progressBar.setValue(0)
    gateBtn.setText(SPINNER);
  }

  server.onReconnect = async () => {
    await messenger.removeAll();
    messenger.createMessage('info', 'Мы снова онлайн! Жми!')
    await changeBarState(lastTimer)
  }

  server.connect(token);

}

export default SecButton;
