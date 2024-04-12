import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_USERNAME,
    pass: process.env.GOOGLE_AUTH_KEY
  }
})

export const sendVerificationEmail = (userEmail, token) => {
  console.log('userAuth:: ', {
    auth: {
      user: process.env.GOOGLE_USERNAME,
      pass: process.env.GOOGLE_AUTH_KEY
    }
  })
  const mailOptions = {
    from: process.env.GOOGLE_USERNAME,
    to: userEmail,
    subject: 'Verify Your Account',
    html: `<p>
      Verify your account by clicking <a href="https://localhost:5555/user/verify-account?token=${token}" > here </a>
    </p>`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending mail:: ', error)
    } else {
      console.log('Sent mail:: ', info.response)
    }
  })
}