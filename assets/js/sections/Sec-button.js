import ProgressBar from '../modules/progress-bar/Progress-bar';
import GateButton from '../modules/gate-button/Gate-button';
import Server from '../modules/server/CentrifugeServer';

import '../../less/helpers/spinners.less'

const PROGRESS_BAR_START_COLOR = [194, 4, 55];
const PROGRESS_BAR_MIDDLE_COLOR = [214, 121, 4];
const PROGRESS_BAR_FINISH_COLOR = [3, 146, 85];
const SPINNER = '<div class="lds-roller" style="background: #f5f5f5">' +
    '<div></div><div></div><div></div><div></div>' +
    '<div></div><div></div><div></div><div></div></div>'
const API_URL = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host.replace(/gate/, 'centrifugo')}/connection/websocket`

function SecButton() {
  const buttonSelector = '#gate-button';
  const token = document.querySelector('#centrifugo-token').textContent;

  const progressBar = new ProgressBar(buttonSelector, {
    startColor: PROGRESS_BAR_START_COLOR,
    middleColor: PROGRESS_BAR_MIDDLE_COLOR,
    finishColor: PROGRESS_BAR_FINISH_COLOR,
    size: 180,
    min: 0,
    max: 60,
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
    onClick: () => {
      if (progressBar.isFull) {
        console.log('Запрос на сервер');
      } else {
        console.log('Не готово');
      }
    },
  })

  const server = new Server(API_URL)

  server.onConnect = () => {
    gateBtn.setText('Ура, есть контакт!', '0.13em')
  }

  server.onResponse = async data => {
    const timeRemain = +data.time || 60;
    await progressBar.stopAnimation();
    progressBar.animationTime = 1;
    await (progressBar.setValue(60 - timeRemain));
    progressBar.animationTime = timeRemain;
    await progressBar.setValue(60);
  }

  server.connect(token);
}

export default SecButton;
