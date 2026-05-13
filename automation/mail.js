import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})


export  default async function sendEmail(toEmail, role) {

    try {

        await transporter.sendMail({

            from: process.env.GMAIL_USER,
            to: process.env.ACM_MAIL,
            cc: "quinn@jpitstaffing.com,kim@jpitstaffing.com",
            subject: `Application for ${role} Role`,

            text: `
                Hello sir,

                I came across your hiring post for the ${role} position and I am interested in applying.
                I have experience in Java, backend development, APIs, and full-stack development.
                Please find my resume attached for consideration.
                Looking forward to hearing from you.

                Best Regards
                Harsh
            `,

            attachments: [
                {
                    filename: 'resume.pdf',
                    path: './resume/resume.pdf'
                }
            ]
        });

        console.log(`Email sent to ${toEmail}`);

    } catch (error) {

        console.log('Email error:', error.message);
    }
}


