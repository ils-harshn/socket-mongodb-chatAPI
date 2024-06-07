const Conversation = require("../../models/Conversation");
const CHANNEL_SOCKET_EVENTS = require("../eventTypes/channelSocketEvents.type");

const conversationHandler = (io, socket) => {
  const create = async (data) => {
    const existsingConversation = await Conversation.findOne({
      from: socket.user.member._id,
      to: data._id,
    });

    if (existsingConversation) {
      socket.emit(CHANNEL_SOCKET_EVENTS.RES_CREATE_CONVERSATION, {
        conversation: existsingConversation,
        member: data,
      });
    } else {
      const conversation = await new Conversation({
        from: socket.user.member._id,
        to: data._id,
      });

      await conversation.save();
      socket.emit(CHANNEL_SOCKET_EVENTS.RES_CREATE_CONVERSATION, {
        conversation,
        member: data,
      });
    }

    socket
      .to(data._id.toString())
      .emit(CHANNEL_SOCKET_EVENTS.LOGGER, `U were added in dm!`);
  };

  const get = async () => {
    const latestConversations = await Conversation.find({
      from: socket.user.member._id,
    })
      .sort({ lastUpdate: -1 })
      .limit(10)
      .populate("to");

    socket.emit(
      CHANNEL_SOCKET_EVENTS.RES_CONVERSATION_LIST,
      latestConversations
    );
  };

  socket.on(CHANNEL_SOCKET_EVENTS.REQ_CREATE_CONVERSATION, create);
  socket.on(CHANNEL_SOCKET_EVENTS.REQ_CONVERSATION_LIST, get);
};

module.exports = conversationHandler;
