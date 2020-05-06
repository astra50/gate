import './gate-button.less'

class GateButton {

  constructor(selector, option={}) {
    const defaultOptions = {
      message: 'TEST MSG',
      size: 160,
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

    this._node.append(wrapper.firstElementChild);
  }

  set message(val) {
    this._message = val;
    this._messageNode.textContent = val;
  }

  get message() {
    return this._message;
  }

}

export default GateButton;
