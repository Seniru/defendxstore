require("dotenv").config()
const fs = require("fs")
const path = require("path")
const nodemailer = require("nodemailer")
const logger = require("../utils/logger")

const { EMAIL_SERVICE, EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env

if (!EMAIL_SERVICE || !EMAIL_ADDRESS || !EMAIL_PASSWORD)
    throw new Error(
        "Couldn't find EMAIL_SERVICE, EMAIL_ADDRESS, EMAIL_PASSWORD in your .env configuration",
    )

const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
    },
})

const mailOptions = {
    from: EMAIL_ADDRESS,
    to: "kringehusxd95@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
}

const sendMail = (to, subject, templateName, params = {}) => {
    const templatePath = path.join(__dirname, "../templates", `${templateName}.html`)
    let html = fs.readFileSync(templatePath, "utf-8")

    for (let [k, v] of Object.entries(params)) {
        html = html.replaceAll(`{{${k}}}`, v)
    }

    const mailOptions = {
        from: EMAIL_ADDRESS,
        to,
        subject,
        html,
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            logger.error(error.toString())
        } else {
            logger.info("Email sent: " + info.response)
        }
    })
}

module.exports = { sendMail }
