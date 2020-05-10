import {
  DebugMessage,
  ErrorMessage,
  InfoMessage,
  SuccessMessage,
  WarningMessage,
} from './Message';

class Messenger {

  _stack = new Set();

  constructor(userOptions={}) {
    const options = {
      timeout: 5000,
      debug: false
    }
    this._options = {...options, ...userOptions};
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="popup-container">
                            <div class="container">
                            </div>
                         </div>`
    this._node = wrapper.firstElementChild;
    document.body.append(this._node);
  }

  createMessage(type, text, timeout=this._options.timeout, isShow=true) {
    let newMessage;
    switch (type) {
      case 'success':
        newMessage = new SuccessMessage(text, this._node.firstElementChild);
        break;
      case 'error':
        newMessage = new ErrorMessage(text, this._node.firstElementChild);
        break;
      case 'warning':
        newMessage = new WarningMessage(text, this._node.firstElementChild);
        break;
      case 'debug':
        if (!this._options.debug) return undefined;
        newMessage = new DebugMessage(text, this._node.firstElementChild);
        break;
      default:
        newMessage = new InfoMessage(text, this._node.firstElementChild);
    }

    this._stack.add(newMessage);
    if (timeout) setTimeout(()=> this.removeMessage(newMessage), timeout);
    if (isShow) newMessage.show().then();
    return newMessage;
  }

  async removeMessage(message) {
    if(message._node) {
      await message.hide();
      message.remove();
    }
    this._stack.delete(message);
  }

  async removeAll() {
    if (!this._stack.size)
      await Promise.resolve()
    const promises = [];
    for (let message of this._stack) {
      promises.push(new Promise((resolve => this.removeMessage(message).then(resolve))))
    }
    await Promise.all(promises)
  }
}

export default Messenger;


