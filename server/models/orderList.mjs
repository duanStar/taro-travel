import express from "express";
import { sqlQuery } from "../mysql.mjs";

const router = express.Router();

router.post("/orderList", async (req, res) => {
  try {
    const { userPhone, orderInfo } = req.body;
    const { dptCityName, arrCityName, dptTimeStr, aptTime, price } = orderInfo;
    const createTableSql = `
    create table if not exists orderList (
      id int auto_increment,
      userPhone char(11) not null,
      dptCityName char(50) not null,
      arrCityName char(50) not null,
      dptTimeStr char(50) not null,
      aptTime char(50) not null,
      price decimal not null,
      primary key (id)
    ) engine=innodb;
    `;
    await sqlQuery(createTableSql);
    const insetSql = `insert into orderList(id, userPhone, dptCityName, arrCityName, dptTimeStr, aptTime, price) values (null, '${userPhone}', '${dptCityName}', '${arrCityName}', '${dptTimeStr}', '${aptTime}', '${price}')`;
    await sqlQuery(insetSql);
    res.send({
      code: 1,
      message: "预定成功~",
    });
  } catch (err) {
    res.send({
      code: -1,
      message: "请求失败",
      error: err.toString(),
    });
  }
});

router.post("/getOrderList", async (req, res) => {
  try {
    const { userPhone } = req.body;
    const querySql = `select * from orderList where userPhone=${userPhone} order by id desc`;
    const result = await sqlQuery(querySql);
    res.send({
      code: 1,
      message: "查询成功",
      data: result,
    });
  } catch (err) {
    res.send({
      code: -1,
      message: "请求失败",
      error: err.toString(),
    });
  }
});

export default router;
