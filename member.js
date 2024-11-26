const express = require("express");
const app = express();
app.listen(7777);

const db = new Map();
let id = 1;

// middleware
app.use(express.json());

const checkId = (userId) => {
  let loginObj = {};
  db.forEach((user) => {
    if (user.userId === userId) {
      loginObj = user;
      return;
    }
  });

  return loginObj;
};

const isEmpty = (obj = {}) => {
  return Object.keys(obj).length === 0;
};

// 로그인
app.post("/login", (req, res) => {
  const { userId, password } = req.body;
  const loginUserObj = checkId(userId);
  console.log(loginUserObj);

  if (isEmpty(loginUserObj)) {
    res.status(200).json({
      message: "해당 ID가 없습니다.",
    });
  } else {
    if (loginUserObj.password === password) {
      res.status(200).json({
        message: `${loginUserObj.name}님 환영합니다.`,
      });
    } else {
      res.status(200).json({
        message: "password가 틀렸습니다",
      });
    }
  }
});

// 회원가입
app.post("/join", (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "입력 값을 다시 확인해주세요." });
    return;
  }

  db.set(id, {
    id,
    ...req.body,
  });
  id += 1;

  res.status(201).json({
    message: `${db.get(id - 1).name}님 환영합니다.`,
  });
});

// 회원 개별 조회
app.route("/users/:id").get((req, res) => {
  const { id } = req.params;

  const user = db.get(parseInt(id));

  if (user === undefined) {
    res.status(200).json({ message: "회원 정보가 없습니다." });
    return;
  }

  res.status(200).json(user);
});

// 회원 개별 탈퇴
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const user = db.get(parseInt(id));

  if (user === undefined) {
    res.status(200).json({ message: "회원 정보가 없습니다." });
    return;
  }

  db.delete(parseInt(id));

  res.status(200).json({
    message: `${user.name}님 다음에 또 뵙겠습니다`,
  });
});
