// import chalk from "chalk";
import express from "express";
import { sqlQuery } from "../mysql.mjs";

const router = express.Router();

// const ads = [
//   {
//     id: 1,
//     imgUrl:
//       "https://images3.c-ctrip.com/ztrip/flightbanner/student_authentication/%25E6%259C%25BA%25E7%25A5%25A8%25E9%25A6%2596%25E9%25A1%25B5@3x.png",
//     linkUrl:
//       "https://m.ctrip.com/webapp/train/activity/20200518-ztrip-flight-student-privilege/?isHideNavBar=YES&partner=zhixing",
//   },
//   {
//     id: 2,
//     imgUrl:
//       "https://images3.c-ctrip.com/ztrip/flightbanner/yaoxinyouli/app%25E9%25A6%2596%25E9%25A1%25B5.png",
//     linkUrl:
//       "https://m.ctrip.com/webapp/train/activity/20200713-ztrip-flight-invite-prize?isHideNavBar=YES&partner=zhixing",
//   },
// ];

// const createTable = async () => {
//   try {
//     const createTableSql = `
//     create table if not exists ads (
//       id int auto_increment primary key,
//       imgUrl char(255) not null
//     ) engine=innodb;
//   `;
//     await sqlQuery(createTableSql);
//     let res = await sqlQuery(
//       `select * from ads where imgUrl='${ads[0].imgUrl}'`
//     );
//     if (!res) {
//       ads.forEach(async (ad) => {
//         const insertSql = `
//       insert into ads(id, imgUrl) values(null, '${ad.imgUrl}')
//     `;
//         await sqlQuery(insertSql);
//       });
//     }
//   } catch (err) {
//     chalk.redBright(err);
//   }
// };
// createTable();

router.get("/adventist", async (req, res) => {
  const sql = `
    select * from ads
  `;
  try {
    const result = await sqlQuery(sql);
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
