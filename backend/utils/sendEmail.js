const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_host,
        port: process.env.SMPT_Port, 
        secure: true,
        service : process.env.SMPT_Service,
        auth :{
            user :process.env.SMPT_userMail,
            pass: process.env.SMPT_userPassword
        }
    })

    const mailOptions = {
        from: process.env.SMPT_userMail,
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    await transporter.sendMail(mailOptions);

} ;

module.exports = sendEmail ;