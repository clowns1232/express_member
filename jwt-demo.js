const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const token = jwt.sign({ foo: "bar" }, process.env.PRIVATE_KET);

// token 생성 = jwt 서명을 했다 (페이로드, 나만의 암호키) + SHA256

// 검증
// 검증에 성공하면 페이로드값 확인

const decoded = jwt.verify(token, "shhhh");
console.log(decoded.foo);
