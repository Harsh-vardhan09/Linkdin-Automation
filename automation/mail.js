import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})


export default async function sendEmail(toEmail, role, jobLink, jobDescription) {

    const roleFromDescription = jobDescription
        ? jobDescription.split('\n')[0].replace(/['"🔥🚨🚀]/g, '').trim()
        : role;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: toEmail,
            subject: `Application for ${roleFromDescription} Position`,
            cc: [
                "quinn@jpitstaffing.com",
                "kim@jpitstaffing.com",
                "harsh.vardhanp0901@gmail.com"
            ],
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                <meta charset="UTF-8" />
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                
                <p>Hello,</p>

                <p>
                    I hope you are doing well.
                </p>

                <p>
                    I came across your post regarding the 
                    <strong>${roleFromDescription}</strong> opportunity and would like to express my interest in the position.
                </p>

                <p>
                    I have experience in <strong>Java</strong>, backend development, REST APIs, and full-stack web development, with a strong focus on building scalable and efficient applications.
                </p>

                <h3 style="margin-bottom: 5px;">Position Details</h3>
                <p style="background: #f4f4f4; padding: 10px; border-radius: 6px;">
                    ${roleFromDescription}
                </p>

                <h3 style="margin-bottom: 5px;">Job Link</h3>
                <p>
                    <a href="${jobLink}" target="_blank" style="color: #2563eb; text-decoration: none;">
                    ${jobLink || 'N/A'}
                    </a>
                </p>

                <p>
                    Please find my resume attached for your consideration.
                    I would appreciate the opportunity to discuss how my skills and experience align with your requirements.
                </p>

                <p>
                    Thank you for your time and consideration.
                </p>

                <br />

                <p>
                    Best regards,<br />
                    <strong>Harsh</strong>
                </p>

                </body>
                </html>
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