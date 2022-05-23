import express from "express";
import { sqlQuery } from "../mysql.mjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { userPhone, password, nickName } = req.body;
    const createTableSql = `
    create table if not exists user (
      id int auto_increment,
      userPhone char(11) not null,
      password char(10) not null,
      nickName char(50) not null,
      primary key (id)
    ) engine=innodb;
    `;
    await sqlQuery(createTableSql);
    const sql = `select userPhone from user where userPhone='${userPhone}'`;
    const result = await sqlQuery(sql);
    if (result.length) {
      const userInfoRes = await sqlQuery(
        `select * from user where userPhone='${userPhone}'`
      );
      if (userInfoRes.length && userInfoRes[0].password === password) {
        if (nickName !== userInfoRes[0].nickName) {
          await sqlQuery(
            `update user set nickName='${nickName}' where userPhone='${userPhone}'`
          );
        }
        res.send({
          code: 1,
          message: "登录成功",
          data: {
            userPhone,
            nickName,
          },
        });
      } else {
        res.send({
          code: 2,
          message: "密码错误",
        });
      }
    } else {
      const insertSql = `insert into user(id, userPhone, password, nickName) values(null, '${userPhone}', '${password}', '${nickName}')`;
      await sqlQuery(insertSql);
      res.send({
        code: 1,
        message: "注册并登录成功",
        data: {
          userPhone,
          nickName,
        },
      });
    }
  } catch (err) {
    res.send({
      code: -1,
      message: "请求失败",
      error: err.toString(),
    });
  }
});

export default router;
