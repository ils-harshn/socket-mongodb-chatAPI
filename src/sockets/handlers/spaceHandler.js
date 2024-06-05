const SpaceMember = require("../../models/SpaceMember");

const spaceHandler = (io, socket) => {
  const list = async () => {
    try {
      const memberSpaces = await SpaceMember.find({
        member: socket.user.member._id,
      })
        .populate("space")
        .sort({ createdAt: -1 });
      socket.emit("space:list", memberSpaces);
    } catch (error) {
      console.log(error);
      socket.emit("space:list", []);
    }
  };

  socket.on("space:req:list", list);
};

module.exports = spaceHandler;
