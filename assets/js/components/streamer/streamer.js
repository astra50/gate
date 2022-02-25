import React, { useRef } from "react";
import "./video-react.css";
import { Player, BigPlayButton, ControlBar } from "video-react";
import {STREAM_DATA} from '../../options';

const Streamer = () => {
  const videoRef = useRef();
  const {ip, port, token, groupID, cameraID} = STREAM_DATA
  const videoUrl = `https://${ip}${port ? ':'+port : ''}/${token}/mp4/${groupID}/${cameraID}/s.mp4`;
  const posterUrl = `https://${ip}${port ? ':'+port : ''}/${token}/jpeg/${groupID}/${cameraID}/s.jpg`;

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
