const express = require("express");
const app = express();

app.listen(7777);
app.use(express.json());

const usersRouter = require("./routers/users");
const channelRouter = require("./routers/channel");

app.use("/users", usersRouter);
app.use("/channels", channelRouter);
