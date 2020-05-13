import './sharing-button.less'

class SharingButton {

  _link = ''
  _options = {}

  constructor(buttonSelector, userOptions) {

    const options = {
      onShareClick: () => {},
      onCopyClick: () => {}
    }

    this._options = {...options, ...userOptions}

    this._node = document.querySelector(buttonSelector);

    if (!this._node) return

    this._linkNode = this._node.querySelector('.sharing-button__input')
    this._btnNode = this._node.querySelector('.sharing-button__btn')

    this._btnNode.addEventListener('click', ()=> {
      switch (this.mode) {
        case 'begin':
          this._options.onShareClick()
          break
        case 'share':
          this._options.onCopyClick()
          break
        default: return
      }
    })

  }

  set link(val) {
    this._link = val
    this._linkNode.value = val
  }

  get link() {
    return this._link
  }

  get mode() {
    return this._node.classList.contains('share') ? 'share' : 'begin'
  }

  set mode(val) {
    switch (val) {
      case 'share':
        this._node.classList.add('share')
        break
      case 'begin':
        this.link = ''
        this._node.classList.remove('share')
        break
      default: return
    }
  }
}

export default SharingButton
