const express = require("express");
const roomRouter = express.Router();
const {
  createRoom,
  getAllRoom,
  getAllRoomById,
  updateRoom,
  getAllRoomAction,
  deleteRoom,
} = require("../Controller/rooms/room.controller");

roomRouter.post("/createRoom", createRoom);
roomRouter.get("/getAllRoom", getAllRoom);
roomRouter.get("/getRoomById", getAllRoomById);
roomRouter.patch("/updateRoom", updateRoom);
roomRouter.get("/getAllRoomAction", getAllRoomAction);
roomRouter.delete("/deleteroom", deleteRoom);
// roomRouter.get("/getroom", getAllRoom);
// roomRouter.put("/updateroom", updateRoom);
// roomRouter.get("/getRoomById", getRoomById);

module.exports = roomRouter;
