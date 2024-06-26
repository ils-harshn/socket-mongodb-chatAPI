const CHANNEL_SOCKET_EVENTS = {
  // pre defined
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  // catches
  SEND_DM: "SEND_DM",
  
  // emits
  CONNECTED: "CONNECTED",
  RECEIVE_DM: "RECEIVE_DM",

  // req - res
  REQ_SPACE_LIST: "REQ_SPACE_LIST",
  RES_SPACE_LIST: "RES_SPACE_LIST",

  REQ_CREATE_CONVERSATION: "REQ_CREATE_CONVERSATION",
  RES_CREATE_CONVERSATION: "RES_CREATE_CONVERSATION",

  REQ_CONVERSATION_LIST: "REQ_CONVERSATION_LIST",
  RES_CONVERSATION_LIST: "RES_CONVERSATION_LIST",

  // LOGGER
  LOGGER: "LOGGER",
};

module.exports = CHANNEL_SOCKET_EVENTS;
