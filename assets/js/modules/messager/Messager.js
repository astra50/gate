import {ErrorMessage, InfoMessage, SuccessMessage} from './Message';

class Messenger {

  _stack = new Set();

  constructor(userOptions={}) {
    const options = {
      timeout: 5000,
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

  createMessage(type, text, timeout=this._options.timeout) {
    let newMessage;
    switch (type) {
      case 'success':
        newMessage = new SuccessMessage(text, this._node.firstElementChild);
        break;
      case 'error':
        newMessage = new ErrorMessage(text, this._node.firstElementChild);
        break;
      default:
        newMessage = new InfoMessage(text, this._node.firstElementChild);
    }

    this._stack.add(newMessage);
    if (timeout) {
      setTimeout(()=> this.removeMessage(newMessage), timeout)
    }
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
    const promises = [];
    for (let message of this._stack) {
      promises.push(new Promise((resolve => this.removeMessage(message).then(resolve))))
    }
    await Promise.all(promises)
  }
}

export default Messenger;


