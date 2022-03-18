import express from "express";
import { sqlQuery } from "../mysql.mjs";
// import request from "request";

const router = express.Router();

// request(
//   "https://www.brown77.cn/city/airportList",
//   {
//     json: true,
//   },
//   async (err, res, body) => {
//     if (err) {
//       console.error(err.toString());
//       return;
//     }
//     const sql = `
//     create table airport_list(
//       id int auto_increment primary key,
//       cityName char(50) not null,
//       cityId int not null,
//       firstLetter char(50) not null,
//       airportName char(50) not null
//     ) engine=innodb
//   `;
//     await sqlQuery("drop table if exists airport_list");
//     try {
//       await sqlQuery(sql);
//       body.result.forEach(async (item) => {
//         const { id, cityId, cityName, firstLetter, airportName } = item;
//         const insertSql = `insert into airport_list(id, cityName, cityId, firstLetter, airportName) values(${id}, '${cityName}', ${cityId}, '${firstLetter}', '${airportName}')`;
//         await sqlQuery(insertSql);
//       });
//     } catch (error) {
//       console.error(error.toString());
//     }
//   }
// );

router.get("/airportList", async (req, res) => {
  const sql = `select * from airport_list`;
  try {
    const result = await sqlQuery(sql);
    if (Array.isArray(result) && result.length) {
      result.sort((a, b) => {
        return a.firstLetter - b.firstLetter;
      });
    }
    res.send({
      code: 1,
      message: "请求成功",
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
