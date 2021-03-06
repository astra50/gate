class SharingModal {

  constructor(selector) {
    this._node = document.querySelector(selector)

    if (!this._node) return

    this._isOpen = false
    if (this._node.firstElementChild.childElementCount) {
      const items = this._node.firstElementChild.children
      const modal = this
      for (let item of items) {
        let itemObj = new SharingItem(item.firstElementChild, () => {
          if (itemObj.type === 0) {
            modal.close();
            return;
          }
          modal.close()
          modal.onSelect(itemObj)
        })
      }
    }
  }

  async show() {
    this._isOpen = true
    this._node.classList.add('is-inited')
    await new Promise((resolve)=> setTimeout(()=> resolve(), 300))
    this._node.classList.add('is-active')
  }

  async close() {
    this._isOpen = false
    this._node.classList.remove('is-active')
    await new Promise((resolve)=> setTimeout(()=> resolve(), 300))
    this._node.classList.remove('is-inited')
  }

  onSelect() {}

}

class SharingItem {

  constructor(node, onClick) {
    this.type = +node.dataset.type
    node.addEventListener('click', () => onClick(this))
  }

}

export default SharingModal

