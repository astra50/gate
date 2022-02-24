import React, { useEffect, useRef } from "react";
import { useCentrifuge, useAlert } from "../../hooks";
import ButtonWithProgress from "../button";
import { ALERTS, GATES } from "../../options";
import Streamer from "../../components/streamer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFlip } from "swiper";
import "./swiper-bundle.css";
import "./button-page.less";

function ButtonPage() {
  const [socketResponse, isConnected, isSocketError] = useCentrifuge();
  const alert = useAlert();
  const errorConnectionAlert = useRef();
  const isOneceConnected = useRef(false);
  let initialSlide = parseInt(localStorage.getItem("activeGateSlide")) | 0;

  useEffect(() => {
    if (!isConnected) {
      if (isOneceConnected.current) {
        errorConnectionAlert.current = alert.error(ALERTS.onDisconnect.alert, {
          timeout: 0,
        });
      }
    }
    if (isConnected) {
      errorConnectionAlert.current && errorConnectionAlert.current.remove();
      isOneceConnected.current && alert.info(ALERTS.onReconnect.alert);
      isOneceConnected.current = true;
    }
  }, [isConnected]);

  const pagination = {
    clickable: true,
    renderBullet(index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  return (
    <div className='button-page'>
      <Streamer />
      <div className='button-page__button'>
        <Swiper
          initialSlide={initialSlide}
          modules={[Navigation, Pagination, EffectFlip]}
          effect={"flip"}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={pagination}
          onSlideChange={({activeIndex}) => localStorage.setItem('activeGateSlide', activeIndex)}
        >
          {GATES.map((gate) => (
            <SwiperSlide key={gate.uuid}>
              <ButtonWithProgress
                gate={gate}
                socketResponse={socketResponse}
                isConnected={isConnected}
                isSocketError={isSocketError}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ButtonPage;
