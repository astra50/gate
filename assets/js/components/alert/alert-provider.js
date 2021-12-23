import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import AlertContext from "../../context/alert";
import types from "./types";
import "./alert.less";
import { CSSTransition, TransitionGroup } from "react-transition-group/";

function* idGenerator() {
  let id = 1000;
  while (true) yield `alert_id_${id++}`;
}

const getId = idGenerator();

function AlertProvider({ children, timeout, type }) {
  const [alerts, setAlerts] = useState([]);
  const root = useRef(null);
  const alertContext = useRef(null);
  const alertTimersId = useRef([]);
  useEffect(() => {
    const node = document.createElement("div");
    node.id = "alerts";
    document.body.appendChild(node);
    root.current = node;
    setAlerts([]);
  }, []);

  const remove = useCallback((alert) => {
    setAlerts((prevAlerts) => prevAlerts.filter(({ id }) => id != alert.id));
  }, []);

  const removeAll = useCallback(() => {
    alertTimersId.current.forEach((timer) => clearTimeout(timer));
    alertContext.current.alerts.forEach(remove);
  }, [remove]);

  const show = useCallback(
    (message = "", options = {}) => {
      const alertOptions = {
        type,
        timeout,
        ...options,
      };
      const alert = {
        id: getId.next().value,
        message,
        ...alertOptions,
      };
      alert.remove = () => remove(alert);
      if (alert.timeout) {
        const timerId = setTimeout(() => {
          alert.remove();
          alertTimersId.current.splice(
            alertTimersId.current.indexOf(timerId),
            1
          );
        }, alert.timeout);
        alertTimersId.current.push(timerId);
      }
      setAlerts((prevState) => [...prevState, alert]);
      return alert;
    },
    [remove]
  );

  const info = useCallback(
    (message = "", options = {}) => {
      options.type = types.INFO;
      return show(message, options);
    },
    [show]
  );

  const error = useCallback(
    (message = "", options = {}) => {
      options.type = types.ERROR;
      return show(message, options);
    },
    [show]
  );

  const success = useCallback(
    (message = "", options = {}) => {
      options.type = types.SUCCESS;
      return show(message, options);
    },
    [show]
  );

  const warning = useCallback(
    (message = "", options = {}) => {
      options.type = types.WARNING;
      return show(message, options);
    },
    [show]
  );

  const debug = useCallback(
    (message = "", options = {}) => {
      options.type = types.DEBUG;
      return show(message, options);
    },
    [show]
  );

  alertContext.current = {
    alerts,
    show,
    removeAll,
    info,
    error,
    success,
    warning,
    debug,
  };

  return (
    <AlertContext.Provider value={alertContext}>
      {children}
      {root.current &&
        createPortal(
          <div className='alert__container container'>
            <TransitionGroup component={null}>
              {alerts.map((alert) => (
                <CSSTransition
                  timeout={500}
                  key={alert.id}
                  classNames='alert__item'
                >
                  <div className={`alert__item ${alert.type}`}>
                    <span>{alert.message}</span>
                  </div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>,
          root.current
        )}
    </AlertContext.Provider>
  );
}

export default AlertProvider;
