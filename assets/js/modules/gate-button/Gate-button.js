import './gate-button.less'

class GateButton {

  _message = ''

  constructor(selector, option={}) {
    const defaultOptions = {
      message: '',
      size: 160,
      fontSize: '0.2em',
      onClick: function() {console.log('click') }
    }

    this._node = document.querySelector(selector);
    if (!this._node) throw new Error('Wrong GateButton selector: ' + selector)

    Object.assign(defaultOptions, option);
    const wrapper = document.createElement('div');
    this._message = defaultOptions.message;

    wrapper.innerHTML = `<div class="_note">
                            <span>${this._message}</span>
                         </div>`;
    this._messageNode = wrapper.querySelector('span');
    wrapper.firstElementChild.addEventListener('click', defaultOptions.onClick)
    this._messageNode.style.fontSize = defaultOptions.fontSize;

    this._node.append(wrapper.firstElementChild);
  }

  setText(val, fontSize = '') {
    this._message = val;
    this._messageNode.textContent = val;
    if (fontSize) {
      this._messageNode.style.fontSize = fontSize;
    }
  }
}

export default GateButton;
