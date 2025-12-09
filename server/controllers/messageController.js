// server/controllers/messageController.js
const Message = require("../models/Message");

// 1. ADD MESSAGE
module.exports.addMessage = async (req, res, next) => {
  try {
    const { chatRoomId, sender, message } = req.body;
    
    const data = await Message.create({
      chatRoomId,
      message: message,
      sender: sender, // Sender's User ID
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to database" });
  } catch (ex) {
    next(ex);
  }
};

// 2. GET MESSAGES (History)
module.exports.getMessages = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    
    const messages = await Message.find({ chatRoomId: roomId }).sort({ createdAt: 1 });

    // Format for frontend
    const projectedMessages = messages.map((msg) => {
      return {
        id: msg._id,
        sender: msg.sender,
        message: msg.message,
        time: msg.createdAt
      };
    });
    
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};