import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import Server from "../modules/server/CentrifugeServer";
import CentrifugeContext from "../context/centrifuge";
import AlertProvider, { types } from "../components/alert";

const API_CHANNEL = "gate";
const API_URL = `${
  location.protocol === "http:" ? "ws" : "wss"
}://${location.host.replace(/gate/, "centrifugo")}/connection/websocket`;

function Main() {
  const { token, initTimer } = { ...getInitData() };
  const server = new Server({ API_URL, API_CHANNEL, token });

  const alertOptions = {
    timeout: 5000,
    type: types.INFO,
  };

  return (
    <CentrifugeContext.Provider value={server}>
      <AlertProvider {...alertOptions}>
        <App />
      </AlertProvider>
    </CentrifugeContext.Provider>
  );
}

ReactDOM.render(<Main />, document.getElementById("root"));

function getInitData() {
  const dataNode = document.querySelector("#init-state");
  const data = {
    initTimer: 0,
    token: "",
  };
  let initData;

  if (dataNode) {
    initData = { ...dataNode.dataset };
    dataNode.remove();
  }
  return Object.assign(data, initData);
}
