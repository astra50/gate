import './progress-button.less'

class ProgressBar {

  id = 0
  _value = 0
  _animationTime = 1000
  _isAnimation = false
  _isCancelAnimation = false

  constructor(selector, option={}) {
    const defaultOptions = {
      start: 0,
      max: 100,
      min: 0,
      startColor: [255, 0, 0],
      middleColor: [255, 255, 0],
      finishColor: [0, 128, 0],
      size: 200,
      animationTime: 1000,
      colorThenMin: true,
      onChangePosition: () => {},
      onComplete: () => {},
    };

    this._options = Object.assign(defaultOptions, option)

    this._node = document.querySelector(selector);

    if (!this._node) throw new Error('Wrong ProgressBar selector: ' + selector);

    this._lineNode = document.createElement('div');
    this._lineNode.classList.add('_line');

    this._maskNode = document.createElement('div');
    this._maskNode.classList.add('_r-mask');

    this._node.append(this._lineNode);
    this._node.append(this._maskNode);

    this._node.style.boxShadow = `0 0 20px rgba(${defaultOptions.startColor.join(', ')}`;
    this._node.style.fontSize = `${defaultOptions.size}px`;

    this._onChangePosition = () => defaultOptions.onChangePosition(this.value)
    this._onComplete = () => defaultOptions.onComplete(this.value)
    this.setValue(this._options.start, false)
        .then(()=> this._isAnimation = false);
  }

  set animationTime(val) {
    this._animationTime = val * 1000;
  }

  get animationTime() {
    return this._animationTime / 1000;
  }

  get isRunAnimation() {
    return this._isAnimation;
  }

  get isFull() {
    return this.value === this._options.max
  }

  get isEmpty() {
    return this.value === this._options.min
  }

  async setValue(val, animation=true) {
    const {max, min} = {...this._options}
    val = val > max ? max : val;
    val = val < min ? min : val;

    if(this._isAnimation) {
      console.error('Animation in process');
      await Promise.resolve();
    }

    await this._changeBarPosition(val, animation)

  }

  get value() {
    return this._value;
  }

  async stopAnimation() {
    this._isCancelAnimation = true;
    while (this._isAnimation) {
      await new Promise(resolve => setTimeout(()=>resolve(), 0))
    }
    this._isCancelAnimation = false;
  }

  _changeColor(value) {
    const {max, min, startColor, middleColor, finishColor} = {...this._options};
    let colorForSet;

    const calcColor = (pValue, firstColor, secondColor) => {
      return [0, 0, 0].map((val, i) =>
          Math.floor(firstColor[i] + (secondColor[i] - firstColor[i]) * pValue))
    }

    if (value <= (max - min) / 2){
      colorForSet = calcColor(value/(max/2), startColor, middleColor);
    } else {
      colorForSet = calcColor(value/(max/2) - 1, middleColor, finishColor);
    }

    this._maskNode.style.backgroundColor = `rgba(${colorForSet.join(', ')})`;
    this._lineNode.style.backgroundColor = `rgba(${colorForSet.join(', ')})`;
    this._node.style.boxShadow = `0 0 20px rgba(${colorForSet.join(', ')}`;
    return colorForSet;
  }

  async _changeBarPosition (newValue, animate) {
    const {min, max} = {...this._options},
          oldValue = animate ? this.value : newValue;
    const newNormalizeValue = Math.round(newValue/(max - min) * 100),
          oldNormalizeValue = Math.round(oldValue/(max - min) * 100);

    let steps = (Math.abs(newNormalizeValue - oldNormalizeValue)) * 2 || 1;

    const animation = step => new Promise(resolve => {
      setTimeout(()=> {
        let stepValue = oldValue + (newValue - oldValue) / steps * step,
            deg = 360 * stepValue / (max - min);
        this._lineNode.style.transform = `rotate(${deg}deg)`;
        this._node.classList.toggle('gt50', deg >= 180);
        this._changeColor(stepValue)
        this._onChangePosition();
        this._value = stepValue;

        if (this.isFull) {
          this._onComplete(this.value)
        }
        if (this.isEmpty && this._options.colorThenMin) {
          const colorForSet = this._options.startColor;
          this._node.style.backgroundColor = `rgba(${colorForSet.join(', ')})`;
        } else {
          this._node.style.backgroundColor = ""
        }
        resolve();
      }, this._animationTime/steps)
    })

    this._isAnimation = true;
    for (let i = 1; i <= steps; i++) {
      await animation(i);
      if (this._isCancelAnimation) {
        break
      }
    }
    this._isAnimation = false;
  }
}

export default ProgressBar
