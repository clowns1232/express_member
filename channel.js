const express = require("express");
const app = express();
app.listen(7777);

let db = new Map();
let id = 1;

app.use(express.json());

app
  .route("/channels")
  // 채널 전체 조회
  .get((req, res) => {
    if (db.size === 0) {
      res.status(200).json({
        message: "채널이 존재하지 않습니다",
      });
      return;
    }
    const channels = [];

    db.forEach((value) => {
      channels.push(value);
    });

    res.status(200).json(channels);
  })
  // 채널 개별 생성
  .post((req, res) => {
    console.log(req.body);

    if (req.body.channelTitle) {
      db.set(id++, req.body);
      res.status(201).json({
        message: `${db.get(id - 1).channelTitle}채널을 응원합니다.`,
      });
      return;
    }

    res.status(400).json({
      message: "요청 값을 제대로 보내주세요.",
    });
  });

app
  .route("/channels/:id")
  // 채널 개별 조회
  .get((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    if (db.get(id)) {
      res.status(200).json(db.get(id));
    } else {
      res.status(200).json({
        message: "채널이 존재하지 않습니다.",
      });
    }
  })
  // 채널 개별 수정
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const channel = db.get(id);
    const oldTtle = channel.channelTitle;

    if (!req.body.channelTitle) {
      res.status(400).json({
        message: `데이터가 제대로 들어오지 않았습니다.`,
      });
    }

    if (channel) {
      let newTitle = req.body.channelTitle;

      channel.channelTitle = newTitle;

      db.set(id, channel);

      res.status(200).json({
        message: `${oldTtle}이(가) ${channel.channelTitle}로 변경되었습니다.`,
      });
    } else {
      res.status(200).json({
        message: "채널이 존재하지 않습니다.",
      });
    }
  })
  // 채널 개별 삭제
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);
    const channel = db.get(id);
    if (channel) {
      db.delete(id);
      res.status(200).json({
        message: `${channel.channelTitle}이 정상적으로 삭제되었습니다`,
      });
    } else {
      res.status(200).json({
        message: "채널이 존재하지 않습니다.",
      });
    }
  });
