import Conversation from "../models/conversationModel.js";
import { createNotification } from "./notificationController.js";

const getConversation = async (senderID, receiverID) => {
  try {
    const existingConversation = await Conversation.find({
      $and: [
        { "participants.user": senderID },
        { "participants.user": receiverID },
      ],
    });

    console.log("Existing Conversation", existingConversation);

    if (existingConversation.length > 0) {
      console.log("Has conversation");
      return existingConversation[0];
    } else {
      console.log("Has no conversation yet");
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
      console.log("Conversation", conversation);
      conversation.messages.push(newMessage);
      conversation.save();

      createNotification({
        causer: req.user,
        notifiedUserID: receiverID,
        type: "Message",
        route: "Messages",
      });

      return res
        .status(200)
        .json({ message: "Successfully inserted new message" });
    })
    .catch((err) => {
      console.log("error inserting new mesage");
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
    $and: [
      { "participants.user": req.params.id },
      { "participants.user": req.user._id },
    ],
  });

  return res
    .status(200)
    .json({ messages: conversation[0]?.messages.reverse() });
};
