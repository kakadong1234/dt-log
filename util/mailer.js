/**
 * Created by zy8 on 2017/5/25.
 */
const nodemailer = require('nodemailer');
const { MAILER } = require('../config')
// const MAILER = {
//     HOST: 'smtp.qq.com',
//     PORT: 25,
//     USER: '2407112055@qq.com',   // QQ: 469731821 PASS: 1234Abcd Available from May-5
//     PASS: 'sxw000393',
//     NICK_NAME: '播播侠日志统计',
//
//     RECEIVERS: [
//         'songxiaowei@ehousechina.com',
//     ],
// };


const transporter = nodemailer.createTransport({
    host: MAILER.HOST,
    port: MAILER.PORT,
    auth: {
        user: MAILER.USER,
        pass: MAILER.PASS,
    }
})

module.exports = {

    /**
     * send rich text mail
     * @param mailOptions
     */
    send(mailOptions ) {
        transporter.sendMail(mailOptions, (err, info) => {
            const title = err ? 'MAIL ALARM FAIL:   ' : 'ALARM MAIL SENT:   ';
            console.log(title);
        })
    },
}