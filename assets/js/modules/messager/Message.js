import './message.less'

class Message {

  constructor(text, parent) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="popup-message" style="display: none">
                            <span>${text}</span>
                        </div>`
    this._node = wrapper.firstElementChild;
    parent.append(this._node)
  }

  async show() {
    this._node.style.display = 'flex';
    await new Promise(resolve => setTimeout(()=>resolve(),50));
    this._node.classList.add('is-show');
    await new Promise(resolve => setTimeout(()=>resolve(),300));

  }

  async hide() {
    this._node.classList.remove('is-show');
    await new Promise(resolve => setTimeout(()=>resolve(),350));
    this._node.style.display = 'none';
  }

  remove () {
    this._node.remove();
  }
}


export class SuccessMessage extends Message{
  constructor(text, parent) {
    super(text, parent);
    this._node.classList.add('success');
  }
}


export class ErrorMessage extends Message{
  constructor(text, parent) {
    super(text, parent);
    this._node.classList.add('error');
  }
}


export class InfoMessage extends Message{
  constructor(text, parent) {
    super(text, parent);
    this._node.classList.add('info');
  }
}

export class WarningMessage extends Message{
  constructor(text, parent) {
    super(text, parent);
    this._node.classList.add('warning');
  }
}

export class DebugMessage extends Message{
  constructor(text, parent) {
    super(text, parent);
    this._node.classList.add('debug');
  }
}
