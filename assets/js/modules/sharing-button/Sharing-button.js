import './sharing-button.less'

class SharingButton {

  _link = ''
  _options = {}

  constructor(buttonSelector, userOptions) {

    const options = {
      onShareClick: () => {},
      onCopy: () => {},
      onCopyError: () => {}
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
          this._copyToClipboard()
          break
        default: return
      }
    })
  }

  _copyToClipboard() {
    this._linkNode.disabled = false

    try {
      this._linkNode.select();
      document.execCommand('copy')
      this._options.onCopy()
    } catch (e) {
      this._options.onCopyError(e)
    }

    this._linkNode.disabled = true
  }

  /***
   *
   * @param {string} val set url
   */
  set link(val) {
    this._link = val.toString()
    this._linkNode.value = val.toString()
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
