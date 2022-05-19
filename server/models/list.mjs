import dayjs from "dayjs";
import express from "express";
import { sqlQuery } from "../mysql.mjs";
// import request from "request";

const router = express.Router();

// request(
//   "https://www.brown77.cn/list/singleList",
//   {
//     json: true,
//   },
//   async (err, res, body) => {
//     if (err) {
//       console.error(err.toString());
//       return;
//     }
//     const sql = `
//     create table if not exists flight_list(
//       id int auto_increment primary key,
//       arrTime char(50) not null,
//       airCompanyName char(50) not null,
//       airIcon char(255) not null,
//       price int not null,
//       dptTimeStr char(50) not null,
//       arrTimeStr char(50) not null
//     ) engine=innodb
//   `;
//     await sqlQuery("drop table if exists flight_list");
//     try {
//       await sqlQuery(sql);
//       body.result.forEach(async (item) => {
//         const {
//           id,
//           arrTime,
//           airCompanyName,
//           airIcon,
//           price,
//           dptTimeStr,
//           arrTimeStr,
//         } = item;
//         const insertSql = `insert into flight_list(id, arrTime, airCompanyName, airIcon, price, dptTimeStr, arrTimeStr) values(${id}, '${arrTime}', '${airCompanyName}', '${airIcon}', ${price}, '${dptTimeStr}', '${arrTimeStr}')`;
//         await sqlQuery(insertSql);
//       });
//     } catch (error) {
//       console.error(error.toString());
//     }
//   }
// );

/**
 * 得到两数之间的随机整数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns 整数
 */
const randomPrice = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

router.get("/singleList", async (req, res) => {
  const { dptAirportName, aptCityName, arrAirportName, arrCityName, dptDate } =
    req.query;

  const strSql = `select * from flight_list`;
  try {
    const result = await sqlQuery(strSql);
    const resultList = result.map((item) => {
      return {
        ...item,
        dptAirportName,
        aptCityName,
        arrAirportName,
        arrCityName,
        aptTime: dptDate,
        price: randomPrice(300, 1000),
        dptTimeStr: dayjs(item.dptTime).format("HH:mm"),
        arrTimeStr: dayjs(item.arrTime).format("HH:mm"),
      };
    });
    res.send({
      code: 1,
      message: "请求成功",
      data: resultList,
    });
  } catch (err) {
    res.send({
      code: -1,
      message: "请求失败",
    });
  }
});

export default router;
