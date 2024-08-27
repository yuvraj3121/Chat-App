import mongoose, { isValidObjectId, mongo } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Message } from "../models/message.model.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const receiverId = req.params.receiverId;

  if (!content || content.trim() === "") {
    throw new apiError(400, "Message content is required!");
  }

  if (!receiverId) {
    throw new apiError(400, "Receiver ID is missing!");
  }

  if (!isValidObjectId(receiverId)) {
    throw new apiError(400, "Invalid receiver ID!");
  }

  const findReceiver = await User.findById(receiverId);

  if (!findReceiver) {
    throw new apiError(404, "Receiver does not exist!");
  }

  const newMessage = await Message.create({
    content,
    receiver: receiverId,
    sender: req.user._id,
  });

  if (!newMessage) {
    throw new apiError(500, "Error while sending message!");
  }

  return res
    .status(200)
    .json(new apiResponse(200, newMessage, "Message sent successfully."));
});

const getAllMessages = asyncHandler(async (req, res) => {
  const senderId = req.params.senderId;

  if (!senderId) {
    throw new apiError(400, "Sender ID is missing!");
  }

  if (!isValidObjectId(senderId)) {
    throw new apiError(400, "Invalid sender ID!");
  }

  const findSender = await User.findById(senderId);

  if (!findSender) {
    throw new apiError(404, "Sender does not exist!");
  }

  const allMessages = await Message.aggregate([
    {
      $match: {
        $or: [
          {
            sender: new mongoose.Types.ObjectId(req.user?._id),
            receiver: new mongoose.Types.ObjectId(senderId),
          },
          {
            sender: new mongoose.Types.ObjectId(senderId),
            receiver: new mongoose.Types.ObjectId(req.user?._id),
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senders",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receivers",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        senders: "$senders",
        receivers: "$receivers",
      },
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $project: {
        content: 1,
        senders: 1,
        receivers: 1,
      },
    },
  ]);

  console.log(allMessages);

  if (!allMessages) {
    throw new apiError(404, "No messages found between the users!");
  }

  return res
    .status(200)
    .json(new apiResponse(200, allMessages, "Messages fetched successfully."));
});

const editMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const messageId = req.params.messageId;

  if (!content || content.trim() === "") {
    throw new apiError(400, "Message content is required!");
  }

  if (!messageId) {
    throw new apiError(400, "message ID is missing!");
  }

  if (!isValidObjectId(messageId)) {
    throw new apiError(400, "Invalid message ID!");
  }

  const findMessage = await Message.findById(messageId);

  if (!findMessage) {
    throw new apiError(404, "message does not exist!");
  }

  console.log(req.user?._id);

  if (findMessage.sender.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to edit this message!");
  }

  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    {
      $set: {
        content: content || "",
      },
    },
    {
      new: true,
    }
  );

  if (!updatedMessage) throw new apiError(500, "error while updating message!");

  return res
    .status(200)
    .json(
      new apiResponse(200, updatedMessage, "message updated successfully.")
    );
});

const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId;

  if (!messageId) {
    throw new apiError(400, "message ID is missing!");
  }

  if (!isValidObjectId(messageId)) {
    throw new apiError(400, "Invalid message ID!");
  }

  const findMessage = await Message.findById(messageId);

  if (!findMessage) {
    throw new apiError(404, "message does not exist!");
  }

  if (findMessage.sender.toString() !== req.user._id.toString()) {
    throw new apiError(403, "You are not authorized to edit this message!");
  }

  const deletedMessage = await Message.findByIdAndDelete(messageId);

  if (!deletedMessage) throw new apiError(500, "error while deleting message!");

  return res
    .status(200)
    .json(
      new apiResponse(200, deletedMessage, "message deleted successfully.")
    );
});

const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  if (!userId) throw new apiError(400, "userId is missing!");
  if (!isValidObjectId(userId)) throw new apiError(400, "invalid user Id!");

  const sendChats = await Message.aggregate([
    {
      $match: {
        sender: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receivers",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$receivers",
    },
    {
      $project: {
        content: 1,
        senders: "$receivers",
        createdAt: 1,
        sender: 1,
        receiver: 1,
      },
    },
  ]);

  const receiveChats = await Message.aggregate([
    {
      $match: {
        receiver: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "senders",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$senders",
    },
    {
      $project: {
        content: 1,
        senders: "$senders",
        createdAt: 1,
        sender: 1,
        receiver: 1,
      },
    },
  ]);

  let allChats = [...sendChats, ...receiveChats];

  allChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  let chats = allChats.filter((item, index) => {
    return (
      allChats.findIndex(
        (obj) => obj.senders.username === item.senders.username
      ) === index
    );
  });

  if (!chats.length) throw new apiError(500, "Error while fetching chats!");

  return res
    .status(200)
    .json(new apiResponse(200, chats, "Chats fetched successfully."));
});

export {
  sendMessage,
  getAllMessages,
  editMessage,
  deleteMessage,
  getUserChats,
};
