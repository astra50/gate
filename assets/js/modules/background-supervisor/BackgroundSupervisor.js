import Visibility from 'visibilityjs'

class BackgroundSupervisor {

  _listeners = []

  constructor(userOption) {
    const option = {
      visibilityCheckTime: 1000,
      visibilityEveryTime: 10 * 1000,
    }
    this._options = {...option, ...userOption}

    localStorage.setItem('lastTimeOnline', new Date().getTime().toString())
  }

  run() {
    const updateLastOnline = async () =>{
      const prevTime = +localStorage.getItem('lastTimeOnline'),
            currentTime = new Date().getTime();

      if (currentTime - prevTime > 4000) await this.onSelectPage();

      localStorage.setItem('lastTimeOnline', new Date().getTime().toString())
    }

    const onVisible =  Visibility.every(this._options.visibilityCheckTime, async () => await updateLastOnline())
    const onEvery =  Visibility.every(this._options.visibilityEveryTime, async () => await this.onEvery())
    this._listeners.push(onEvery, onVisible)
  }

  async onSelectPage() { }

  async onEvery() {}

  stopWatch() {
    this._listeners.forEach(l => Visibility.stop(l))
  }

}

export default BackgroundSupervisor;
