export const MESSAGES = {
  onConnect: {
    type: 'info',
    message: 'Соединение с воротами установлено'
  },
  onDisconnect: {
    type: 'error',
    message: 'Нет соединения с воротам, пытаюсь найти контакт...'
  },
  onReconnect: {
    type: 'info',
    message: 'Мы снова на связи! Жми!'
  },
  onSend: {
    type: 'success',
    message: 'Все получилось! Хорошого дня!'
  },
  onSendError: {
    type: 'error',
    message: 'Похоже что-то сломалось, сообщите в чат СНТ'
  },
  onResponse: {
    type: 'info',
    message: 'Похоже ворота сейчас откроются'
  },
  onResponseError: {
    type: 'error',
    message: 'Что-то пошло не так, сообщите в чат СНТ'
  },
  onResponseUnknown: {
    type: 'info',
    message: 'Кто другой что-то нажал'
  },
  onCooldown: {
    type: 'error',
    message: 'Подожди немного, ворота не железные'
  },
}


export const PROGRESS_BAR_COLORS = {
  start: [194, 4, 55],
  middle: [214, 121, 4],
  finish: [3, 146, 85]
}
