//NODEMAILER:

var nodemailer = require('nodemailer');

//Welcome Email 

const sendWelcomeEmail =(email,name)=>{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pvsmeghanait@gmail.com',
          pass: 'VShiv%100'
        }
      });

    var mailOptions = {
        from: 'pvsmeghanait@gmail.com',
        to: email,
        subject: 'Thankyou for joining in',
        text: `Welcome to the App, ${name}.Let me know how you get along with the app`
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}


// Cancellation Email

const sendCancelationEmail =(email,name)=>{

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pvsmeghanait@gmail.com',
          pass: 'VShiv%100'
        }
      });

    var mailOptions = {
        from: 'pvsmeghanait@gmail.com',
        to:email,
        subject: 'Sorry to see you go!!',
        text: `GoodBye, ${name}. Hope will see you back sometime soon `
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

}

module.exports={
    sendWelcomeEmail,
    sendCancelationEmail
}