export const MESSAGES = {
  onConnect: {
    type: 'info',
    message: 'Соединение с воротами установлено'
  },
  onDisconnect: {
    type: 'error',
    message: 'Какие-то проблемы с Интернетом, пытаюсь найти контакт...'
  },
  onReconnect: {
    type: 'info',
    message: 'Мы снова на связи! Жми!'
  },
  onSend: {
    type: 'success',
    message: 'Все получилось! Хорошего дня!'
  },
  onSendError: {
    type: 'error',
    message: 'Похоже что-то сломалось, сообщи в чат СНТ'
  },
  onResponse: {
    type: 'info',
    message: 'Похоже ворота сейчас откроются'
  },
  onResponseError: {
    type: 'error',
    message: 'Что-то пошло не так, сообщи в чат СНТ'
  },
  onResponseUnknown: {
    type: 'info',
    message: 'Кто-то другой что-то нажал'
  },
  onCooldown: {
    type: 'error',
    message: 'Подожди немного, ворота не казенные'
  },
}


export const PROGRESS_BAR_COLORS = {
  start: [194, 4, 55],
  middle: [214, 121, 4],
  finish: [3, 146, 85]
}
