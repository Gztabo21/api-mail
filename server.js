const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config()
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const route = express.Router();
const port = process.env.PORT || 5000;

app.use('/v1', route);

/* nodemailer configuracion */
route.post('/mail',async (req,res)=>{
    const {to,subject,message,cc,bcc} = req.body
    try{
        let result = await main(to,subject,message,cc,bcc).catch(console.error)
        res.status(200).json(result)
    }catch{
        res.status(400).json({'message':'error'})
    }
})
// function principal
// recibe como parametro, correo destino, asunto, mensage, copia, copia oculta.
async function main(to,subject,message,cc,bcc){
    const mailData = {
        from: process.env.USER_MAIL,  // sender address
          to: to,   // list of receivers
          subject: subject,
          cc:cc,// Copia 
          bcc:bcc,// Copia Oculta
          text: message,// text plain
          html:`${message}`, // Html
        };
    
    const transporter = nodemailer.createTransport({
        port: 587,               // true for 465, false for other ports
        host: process.env.HOST_MAIL,
        secure: false,
        auth: {
                user: process.env.USER_MAIL,
                pass: process.env.PASS_MAIL,
             },
             tls: {
                rejectUnauthorized: false
            }
        });
    let info = await transporter.sendMail(mailData)
return({"message":"ok"})

}

/* en configuracion en nodemailer */

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});