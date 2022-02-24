export const GATE_INTERVAL = 30;

export const ENABLE_CLR = `rgb(3, 146, 85)`; // Green
export const DISABLE_CLR = `rgba(255, 0, 0)`; // Red

export const ALERTS = {
  onDisconnect: {
    type: "error",
    alert: "Восстанавливаю связь с воротами...",
  },
  onTryFirstConnect: {
    type: "error",
    alert: "Пытаюсь связаться с воротами",
  },
  onReconnect: {
    type: "info",
    alert: "Мы снова на связи! Жми!",
  },
  onSendError: {
    type: "error",
    alert: "Похоже что-то сломалось, сообщи в чат СНТ",
  },
  onResponse: {
    type: "success",
    alert: "Ворота скоро откроются! Хорошего дня",
  },
  onResponseError: {
    type: "error",
    alert: "Что-то пошло не так, сообщи в чат СНТ",
  },
  onResponseUnknown: {
    type: "info",
    alert: "Кто-то другой что-то нажал",
  },
  onCooldown: {
    type: "warning",
    alert: "Подожди немного, ворота не казенные",
  },
};

export const GATES = [
  {
    name: {
      en: "south",
      ru: "южные",
    },
    uuid: "31a3b0ab-efda-4a1c-badb-6b29d4ace8f5",
  },
  // {
  //   name: {
  //     en: "north",
  //     ru: "северные",
  //   },
  //   uuid: "9c99a98d-a908-4146-9eea-11cf2c4cc725",
  // },
];
