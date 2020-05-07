import Server from './Server';
import Centrifuge from 'centrifuge';

const CHANNEL = "button"

class CentrifugeServer extends Server {

  constructor(url) {
    super();
    this._connection = new Centrifuge(url, {debug: true})
    this._connection.on('disconnect', (context)=> this.onDisconnect(context))
  }

  connect(token) {
    this._connection.setToken(token);
    this._connection.connect()
    this._subscribtion = this._connection.subscribe(CHANNEL)
    this._subscribtion.on('subscribe', (context) => {
      if (this.isOnceConnect) {
        this.onReconnect(context)
      } else {
        this.onConnect(context)
      }
      this.isOnceConnect = true;
    })
    this._subscribtion.on('publish', (context) => this.onResponse(context.data))
  }

  disconnect(){
    this._connection.disconnect();
  }

  async send(data) {}

  onConnect(context) {}

  onDisconnect(context) {}

  onResponse(context) {}

  onReconnect(context) {}

}

export default CentrifugeServer;
