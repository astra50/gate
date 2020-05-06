import ProgressBar from '../modules/progress-bar/Progress-bar';
import GateButton from '../modules/gate-button/Gate-button';

const PROGRESS_BAR_START_COLOR = [194, 4, 55];
const PROGRESS_BAR_MIDDLE_COLOR = [214, 121, 4];
const PROGRESS_BAR_FINISH_COLOR = [3, 146, 85];

function SecButton() {
    const buttonSelector = '#gate-button';

    const progressBar = new ProgressBar(buttonSelector, {
      startColor: PROGRESS_BAR_START_COLOR,
      middleColor: PROGRESS_BAR_MIDDLE_COLOR,
      finishColor: PROGRESS_BAR_FINISH_COLOR,
      size: 180,
      min: 0,
      max: 60,
      onChangePosition: value => gateBtn.message = `${60 - Math.round(value)}c.`
    })

    const gateBtn = new GateButton(buttonSelector, {
      message: "Жду ответа ..",
      size: 170,
      onClick: () => console.log('Запрос на сервер'),
    })
}

export default SecButton;
