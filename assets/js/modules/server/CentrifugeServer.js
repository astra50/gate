import Server from './Server';
import Centrifuge from 'centrifuge';


class CentrifugeServer extends Server {

  constructor(options) {
    super();
    this._options = {...options}
    this._connection = new Centrifuge(this._options.API_URL, {debug: false})
    this._connection.on('disconnect', (context)=> this.onDisconnect(context))
  }

  connect(token) {
    this._connection.setToken(token);
    this._connection.connect()

    this._subscribtion = this._connection.subscribe(this._options.API_CHANNEL)
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
