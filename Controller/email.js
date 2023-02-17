const nodemailer = require("nodemailer");
let sendEmail = async (dataSend) => {
  let linkResetToken = (dataSend) => {
    let result = "";

    result = `
      <h3>Xin chào bạn</h3>
      <p>Bạn nhận được email này vì muốn reset lại password</p>
     
      <div>Xin chân thành cảm ơn</div>
      <p>${dataSend.email}</p>
      <a>${dataSend.link}</a>
      `; // html body`

    return result;
  };
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Booking care 👻" <foo@example.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: linkResetToken(dataSend),
  });
};
module.exports = {
  sendEmail,
};
