import Conversation from '../models/conversationModel.js';

// export const storeMessage = async (req, res) => {
//   const { conversation_id, text } = req.body;

//   try {
//     await Message.create({
//       conversation_id,
//       sender: req.user._id,
//       text
//     });

//     return res
//       .status(200)
//       .json({ message: 'Successfully inserted new message' });
//   } catch (err) {
//     return res.status(422).send({ error: 'Error inserting new message' });
//   }
// };

// export const getMessages = async (req, res) => {
//   const { conversation_id } = req.query;

//   const messages = await Message.find({ conversation_id }).populate('sender');

//   return res.status(200).json({ messages });
// };

//FINALLLLLLLLLLLLLLL

// export const storeNewConversation = async (req, res) => {
//   const { receiverID } = req.body;

//   try {
//     const existingConversation = await Conversation.find({
//       $and: [
//         { 'participants.user': req.user._id },
//         { 'participants.user': receiverID }
//       ]
//     });

//     if (existingConversation.length > 0) {
//       return res.status(200).json({ conversation: existingConversation });
//     } else {
//       const newConversation = await Conversation.create({
//         participants: [{ user: req.user._id }, { user: receiverID }]
//       });

//       return res.status(200).json({ conversation: newConversation });
//     }
//   } catch (err) {
//     return res.status(422).send({ error: 'Error inserting new conversation' });
//   }
// };

const getConversation = async (senderID, receiverID) => {
  try {
    const existingConversation = await Conversation.find({
      $and: [
        { 'participants.user': senderID },
        { 'participants.user': receiverID }
      ]
    });

    if (existingConversation.length > 0) {
      return existingConversation;
    } else {
      const newConversation = await Conversation.create({
        participants: [{ user: senderID }, { user: receiverID }]
      });

      return newConversation;
    }
  } catch (err) {
    return res.status(422).send({ error: 'Error inserting new conversation' });
  }
};

export const storeMessage = async (req, res) => {
  const { receiverID, newMessage } = req.body;
  const conversation = getConversation(req.user._id, receiverID);

  delete newMessage._id;

  // const newMessage = {
  //   text: 'First Message',
  //   user: {
  //     _id: '6219f946181bb5ce3322add4',
  //     name: 'Therese S. Alegre'
  //   },
  //   createdAt: new Date()
  // };

  conversation
    .then((conversation) => {
      conversation[0].messages.push(newMessage);
      conversation[0].save();

      return res
        .status(200)
        .json({ message: 'Successfully inserted new message' });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(422).send({ error: 'Error inserting new message' });
    });
};

export const getConversations = async (req, res) => {
  const conversations = await Conversation.find({
    'participants.user': req.user._id
  }).populate('participants.user');

  return res.status(200).json({ conversations });
};
