const nodemailer = require('nodemailer')

let simpleEmail = async () => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'truongminhdat789@gmail.com' ,// generated ethereal user
        pass: 'wgeavuzahijohagg', // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Booking care 👻" <foo@example.com>', // sender address
      to: dataSend.email, // list of receivers
      subject: "Thông tin đặt lịch khám bệnh", // Subject line
      text: "Hello world?", // plain text body
    });
  };
  // let buildLanguage = (dataSend) => {
  //   let result = "";
  
  //     result = `
    
  //     <div>Xin chân thành cảm ơn</div>
  //     `; // html body`
  //   return result;
  // };
  module.exports = {
    simpleEmail
  }