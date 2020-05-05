class ProgressBar {

  _value = 0

  constructor(selector, option={}) {
    const defaultOptions = {
      start: 0,
      max: 100,
      min: 0,
      startColor: [255, 0, 0],
      middleColor: [255, 255, 0],
      finishColor: [0, 128, 0]
    }
    this._node = document.querySelector(selector);

    this._options = Object.assign(defaultOptions, option)
    this._currentColor = [...this._options.startColor];
    this._barNode = this._node.querySelector('.bar')
    this._fillNode = this._node.querySelector('.fill')
    this.value = defaultOptions.start;
  }

  set value(val) {
    const {max, min} = {...this._options}
    val = val > max ? max : val;
    val = val < min ? min : val;
    this._changeBarPosition(val);
    this._currentColor = this._changeColor(val);
    this._value = val;
  }

  get value() {
    return this._value;
  }

  _changeColor(value) {
    const {max, min, startColor, middleColor, finishColor} = {...this._options};
    let colorForSet = [];

    const calcColor = (pValue, firstColor, secondColor) => {
      return [0, 0, 0].map((val, i) =>
          Math.floor(firstColor[i] + (secondColor[i] - firstColor[i]) * (1 - pValue)))
    }

    if (value <= (max - min) / 2){
      colorForSet = calcColor(1 - value/(max/2), startColor, middleColor);
    } else {
      colorForSet = calcColor(value/(max/2) - 1, middleColor, finishColor);
    }

    this._fillNode.style.borderColor = `rgba(${colorForSet.join(', ')})`;
    this._barNode.style.borderColor = `rgba(${colorForSet.join(', ')})`;
    return colorForSet;
  }

  _changeBarPosition (value) {
    const {min, max} = {...this._options}
    const deg = 360 * value / (max - min)
    this._node.classList.toggle('gt50', deg > 180)
    setTimeout(()=> this._barNode.style.transform = `rotate(${deg}deg)`, 0)
    ;
  }

}

const gr = new ProgressBar('#gate-button')

console.log(gr)

// gr.value = 10;

// setTimeout(()=>gr.value=25, 1000)
// setTimeout(()=>gr.value=75, 2000)
// setTimeout(()=>gr.value=35, 3000)
// window.gr = gr
