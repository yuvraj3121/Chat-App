import { Router } from "express";
import {
  sendMessage,
  getAllMessages,
  editMessage,
  deleteMessage,
  getUserChats,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/send/:receiverId").post(verifyJWT, sendMessage);
router.route("/getMessages/:senderId").get(verifyJWT, getAllMessages);
router.route("/edit/:messageId").patch(verifyJWT, editMessage);
router.route("/delete/:messageId").delete(verifyJWT, deleteMessage);
router.route("/userChats/:userId").get(verifyJWT, getUserChats);

export default router;
