const router = require("express").Router();
const { addMessage, getMessages } = require("../controllers/messageController");

router.post("/addmsg", addMessage);
router.get("/getmsg/:roomId", getMessages);

module.exports = router;