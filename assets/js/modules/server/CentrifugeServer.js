import Server from './Server';
import Centrifuge from 'centrifuge';

const CHANNEL = "button"

class CentrifugeServer extends Server {
  constructor(url) {
    super();
    this._connection = new Centrifuge(url, {debug: true})
    this._connection.on('connect', (context)=> this.onConnect(context))
    this._connection.on('disconnect', (context)=> this.onDisconnect(context))
  }

  connect(token) {
    this._connection.setToken(token);
    this._connection.connect()
    this._subscribtion = this._connection.subscribe(CHANNEL)
    this._subscribtion.on('publish', (context) => this.onResponse(context.data))
  }

  async send(data) {}

  onConnect(context) {}

  onDisconnect(context) {}

  onResponse(context) {}

}

export default CentrifugeServer;
