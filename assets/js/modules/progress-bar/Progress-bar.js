class ProgressBar {

  _value = 0
  _animationTime = 1000
  isCancelAnimation = false
  isAnimation = false

  constructor(selector, option={}) {
    const defaultOptions = {
      start: 0,
      max: 100,
      min: 0,
      startColor: [255, 0, 0],
      middleColor: [255, 255, 0],
      finishColor: [0, 128, 0],
      message: 'message'
    };
    const wrapper = document.createElement('div');

    this._options = Object.assign(defaultOptions, option)

    wrapper.innerHTML = `<div class="circle-button">
                             <div class="_line"></div>
                             <div class="_r-mask"></div>
                         </div>`
    this._node = wrapper.firstChild;
    this._lineNode = this._node.querySelector('._line')
    this._maskNode = this._node.querySelector('._r-mask')
    document.querySelector(selector).append(this._node);
    this._node.style.boxShadow = `0 0 20px rgba(${defaultOptions.startColor.join(', ')}`
    this.value = defaultOptions.start;
  }

  set animationTime(val) {
    this._animationTime = val * 1000;
  }

  get animationTime() {
    return this._animationTime / 1000;
  }

  set value(val) {
    const {max, min} = {...this._options}
    val = val > max ? max : val;
    val = val < min ? min : val;
    this._changeBarPosition(val).then(()=> {
      this.isAnimation = false;
      this.isCancelAnimation = false;
    });
  }

  get value() {
    return this._value;
  }

  stopAnimation() {
    if(this.isAnimation) this.isCancelAnimation = true;
  }

  _changeColor(value) {
    const {max, min, startColor, middleColor, finishColor} = {...this._options};
    let colorForSet = [];

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

  async _changeBarPosition (newValue) {
    const {min, max} = {...this._options},
        oldValue = this.value;
    let   steps = (Math.abs(newValue - oldValue)) * 10;

    const animation = step => new Promise(resolve => {
      setTimeout(()=> {
        let stepValue = oldValue + (newValue - oldValue) / steps * step,
            deg = 360 * stepValue / (max - min);
        this._value = stepValue;
        this._lineNode.style.transform = `rotate(${deg}deg)`;
        this._node.classList.toggle('gt50', deg >= 180);
        this._changeColor(stepValue)
        resolve();
      }, this._animationTime/steps)
    })

    this.isAnimation = true;
    for (let i = 1; i <= steps; i++) {
      if (this.isCancelAnimation) return Promise.resolve();
      await animation(i);
    }
  }
}

export default ProgressBar
