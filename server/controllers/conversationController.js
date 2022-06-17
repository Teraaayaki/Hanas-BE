import Conversation from "../models/conversationModel.js";

const getConversation = async (senderID, receiverID) => {
  try {
    const existingConversation = await Conversation.find({
      $and: [{ "participants.user": senderID }, { "participants.user": receiverID }],
    });

    if (existingConversation.length > 0) {
      return existingConversation;
    } else {
      const newConversation = await Conversation.create({
        participants: [{ user: senderID }, { user: receiverID }],
      });

      return newConversation;
    }
  } catch (err) {
    return res.status(422).send({ error: "Error inserting new conversation" });
  }
};

export const storeMessage = async (req, res) => {
  const { receiverID, newMessage } = req.body;
  const conversation = getConversation(req.user._id, receiverID);

  delete newMessage._id;

  conversation
    .then((conversation) => {
      conversation[0].messages.push(newMessage);
      conversation[0].save();

      return res.status(200).json({ message: "Successfully inserted new message" });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(422).send({ error: "Error inserting new message" });
    });
};

export const getConversations = async (req, res) => {
  const conversations = await Conversation.find({
    "participants.user": req.user._id,
  }).populate("participants.user");

  conversations.forEach((conversation) => conversation.messages.reverse());

  return res.status(200).json({ conversations });
};

export const getMessages = async (req, res) => {
  const conversation = await Conversation.find({
    "participants.user": req.params.id,
  });

  return res.status(200).json({ messages: conversation[0].messages.reverse() });
};
