const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

router.use(express.json());

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json(err.array());
  } else {
    return next();
  }
};

const notFoundChannel = (res) => {
  res.status(200).json({
    message: "채널 정보를 찾을 수 없습니다.",
  });
};

router
  .route("/")
  .get(
    [
      body("userId").notEmpty().isInt().withMessage("userId를 확인하세요."),
      validate,
    ],
    (req, res) => {
      const { userId } = req.body;
      const sql = `SELECT * FROM. channels WHERE user_id = ?`;

      conn.query(sql, userId, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.length) {
          res.status(200).json(results);
        } else {
          notFoundChannel(res);
        }
      });
    }
  )
  // 채널 개별 생성
  .post(
    [
      body("userId").notEmpty().isInt().withMessage("userId를 확인하세요."),
      body("name").notEmpty().isString().withMessage("name를 확인하세요."),
      validate,
    ],
    (req, res) => {
      const { name, userId } = req.body;
      const sql = "INSERT INTO channels (name, user_id) VALUES (?, ?)";
      const values = [name, userId];

      conn.query(sql, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        res.status(201).json(results);
      });
    }
  );

router
  .route("/channels/:id")
  // 채널 개별 조회
  .get(
    [
      param("id").notEmpty().withMessage("id를 넣어주세요."),
      body("name").notEmpty().isString().withMessage("채널명 오류"),
      validate,
    ],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);
      const { name } = req.body;

      const sql = "UPDATE channels SET name = ? WHERE = ?";
      const values = [name, id];

      conn.query(sql, values, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.affectedRows === 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  )
  // 채널 개별 수정
  .put(
    [param("id").notEmpty().withMessage("채널 id 필요"), validate],
    (req, res) => {}
  )
  // 채널 개별 삭제
  .delete(
    [param("id").notEmpty().withMessage("id를 넣어주세요.")],
    (req, res) => {
      let { id } = req.params;
      id = parseInt(id);

      const sql = "DELETE FROM channels WHERE id = ?";

      conn.query(sql, id, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        if (results.affectedRows === 0) {
          return res.status(400).end();
        } else {
          res.status(200).json(results);
        }
      });
    }
  );

module.exports = router;
