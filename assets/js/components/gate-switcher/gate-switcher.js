import React from "react";
import { GATES } from "../../options";
import "./gate-switcher.less";

const GateSwitcher = ({ activeUuid, handelSwitchGate }) => {
  return (
    <div className='button-page__gates'>
      <div className='gates-container'>
        {GATES.map((gate) => (
          <div
            key={gate.uuid}
            className={`gates__item ${
              activeUuid == gate.uuid && "gates__item--active"
            }`}
            onClick={() => handelSwitchGate(gate.uuid)}
          >
            {gate.name.ru}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GateSwitcher;
