import React, { useRef } from "react";
import "./video-react.css";
import { Player, BigPlayButton, ControlBar } from "video-react";

const streamData = {
  ip: "192.168.10.5",
  port: 8085,
  token: "K4Llci2QyzvgIGqVZAgapEOEA3ukZ1",
  groupID: "296kqQ3jTb",
  cameraID: "astra_gabage",
};

const Streamer = () => {
  const videoRef = useRef();

  const videoUrl = `http://${streamData.ip}:${streamData.port}/${streamData.token}/mp4/${streamData.groupID}/${streamData.cameraID}/s.mp4`;
  const posterUrl = `http://${streamData.ip}:${streamData.port}/${streamData.token}/jpeg/${streamData.groupID}/${streamData.cameraID}/s.jpg`;

  return (
    <div className='button-page__stream'>
      <Player ref={videoRef} preload='none' src={videoUrl} poster={posterUrl}>
        <BigPlayButton position='center' />
        <ControlBar autoHide={true} autoHideTime={1000} />
      </Player>
    </div>
  );
};

export default Streamer;
