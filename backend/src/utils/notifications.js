const emitNotification = ({ io, type, recipientId, payload }) => {
  if (!io) {
    return;
  }

  io.emit('notification:created', {
    type,
    recipientId,
    channels: ['in-app', 'email', 'sms'],
    payload,
  });
};

module.exports = {
  emitNotification,
};
