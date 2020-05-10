export const MESSAGES = {
  onConnect: {
    type: 'debug',
    message: 'Соединение с воротами установлено'
  },
  onDisconnect: {
    type: 'error',
    message: 'Восстанавливаю связь с воротами...'
  },
  onReconnect: {
    type: 'info',
    message: 'Мы снова на связи! Жми!'
  },
  onSend: {
    type: 'debug',
    message: 'Все получилось! Хорошего дня!'
  },
  onSendError: {
    type: 'error',
    message: 'Похоже что-то сломалось, сообщи в чат СНТ'
  },
  onResponse: {
    type: 'success',
    message: 'Ворота скоро откроются! Хорошего дня'
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
    type: 'warning',
    message: 'Подожди немного, ворота не казенные'
  },
  onSupervisorError: {
    type: 'debug',
    message: 'Supervisor: '
  },

}


export const PROGRESS_BAR_COLORS = {
  start: [194, 4, 55],
  middle: [214, 121, 4],
  finish: [3, 146, 85]
}
