const express = require("express");
const roomRouter = express.Router();
const {
  createRoom,
  getAllRoom,
  getAllRoomById,
  updateRoom,
  getAllRoomAction,
  deleteRoom,
  getDataRoom,
  getAllRoomByClient
} = require("../Controller/rooms/room.controller");

roomRouter.post("/createRoom", createRoom);
roomRouter.get("/getAllRoom", getAllRoom);
roomRouter.get("/getRoomById", getAllRoomById);
roomRouter.patch("/updateRoom", updateRoom);
roomRouter.get("/getAllRoomAction", getAllRoomAction);
roomRouter.delete("/deleteroom", deleteRoom);
roomRouter.get("/dataRoom", getDataRoom)
roomRouter.get('/getAllRoomActionClient',getAllRoomByClient)
// roomRouter.get("/getroom", getAllRoom);
// roomRouter.put("/updateroom", updateRoom);
// roomRouter.get("/getRoomById", getRoomById);

module.exports = roomRouter;
