const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body, param, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const validate = (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json(err.array());
  } else {
    return next();
  }
};

// 로그인
router
  .route("/login")
  .post(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("이메일을 제대로 입력해 주세요."),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("비밀번호를 제대로 입력해주세요"),
      validate,
    ],
    (req, res) => {
      const { email, password } = req.body;
      const sql = `SELECT * FROM users WHERE email = ?`;

      conn.query(sql, email, (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        let loginUser = results[0];
        if (loginUser && loginUser.password == password) {
          // token 발급
          const token = jwt.sign(
            {
              email: loginUser.email,
              name: loginUser.name,
            },
            process.env.PRIVATE_KEY,
            {
              expiresIn: "30m",
              issuer: "taehyeon",
            }
          );

          res.cookie("token", token, {
            httpOnly: true,
          });

          res.status(200).json({
            message: `${loginUser.email}님 로그인 되었습니다.`,
          });
        } else {
          res.status(403).json({
            message: "이메일 또는 비밀번호가 틀렸습니다.",
          });
        }
      });
    }
  );

// 회원가입
router
  .route("/join")
  .post(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("이메일을 제대로 입력해 주세요."),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("비밀번호를 제대로 입력해주세요"),
      body("name")
        .notEmpty()
        .isString()
        .withMessage("이름 제대로 입력해주세요"),
      body("contact")
        .notEmpty()
        .isString()
        .withMessage("연락처 제대로 입력해주세요"),
      validate,
    ],
    (req, res) => {
      const { email, name, password } = req.body;
      const sql = `INSERT INTO users (email, name, password) VALUES (?, ?, ?)`;

      conn.query(sql, [email, name, password], (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }
        res.status(201).json(results);
      });
    }
  );

// 조회 및 삭제
router
  .route("/")
  .get(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("이메일을 제대로 입력해 주세요."),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;
      const sql = `SELECT * FROM users where email = ?`;
      conn.query(sql, email, (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        res.status(200).json(results);
      });
    }
  )
  .delete(
    [
      body("email")
        .notEmpty()
        .isEmail()
        .withMessage("이메일을 제대로 입력해 주세요."),
      validate,
    ],
    (req, res) => {
      let { email } = req.body;
      const sql = `DELETE FROM users WHERE email = ?`;
      conn.query(sql, email, (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).end();
        }

        res.status(200).json(results);
      });
    }
  );

module.exports = router;
