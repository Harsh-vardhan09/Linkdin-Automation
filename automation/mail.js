import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})


function cleanJobDescription(text) {
    if (!text) return text;

    return text
        .split('\n')
        .map(line => line.replace(/#\w+/g, '').trim())
        .filter(line => {
            const l = line.toLowerCase();
            if (l.startsWith('apply now')) return false;
            if (l.startsWith('apply here')) return false;
            if (l.includes('repost to help')) return false;
            if (l === '… more' || l === '... more') return false;
            return line.trim() !== '';
        })
        .join('\n');
}

export default async function sendEmail(toEmail, role, jobLink, jobDescription, resumePath = './resume/resume.pdf') {

    const cleanedDescription = cleanJobDescription(jobDescription);  

    const roleFromDescription = cleanedDescription
        ? cleanedDescription.split('\n')[0].replace(/['\"🔥🚨🚀]/g, '').trim()
        : role;

    const skillLabel = role
        .replace(/-hotlist/gi, '')
        .replace(/HIRING/gi, '')
        .trim();

    const subject = `Submission "SkillSet: ${skillLabel}" Local to "${process.env.CANDIDATE_LOCATION || 'Current Location'}"`;

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: toEmail,
            cc: [
                process.env.CANDIDATE_EMAIL || '',
                'quinn@jpitstaffing.com',
            ].filter(Boolean),
            bcc: 'kim@jpitstaffing.com',
            subject,
            html: `
                <!DOCTYPE html>
                <html>
                <head><meta charset="UTF-8" /></head>
                <body style="font-family: Arial, sans-serif; line-height: 1.8; color: #333;">

                <p>Hi,</p>
                <p>Hope you are doing well,</p>
                <p>Kindly find attached resume and below details:</p>

                <table style="border-collapse: collapse; margin-bottom: 16px;">
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Full Name:</strong></td>       <td>${process.env.CANDIDATE_NAME || ''}</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Email Address:</strong></td>   <td>${process.env.CANDIDATE_EMAIL || ''}</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Phone:</strong></td>           <td>${process.env.CANDIDATE_PHONE || ''}</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>LinkedIn:</strong></td>        <td>${process.env.CANDIDATE_LINKEDIN || ''}</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Current Location:</strong></td><td>${process.env.CANDIDATE_LOCATION || ''}</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Open to Relocate:</strong></td><td>Yes</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Work Authorization:</strong></td><td>${process.env.CANDIDATE_WORK_AUTH || ''}</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Availability:</strong></td>    <td>Immediate</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Total Experience:</strong></td><td>${process.env.CANDIDATE_EXPERIENCE || ''}</td></tr>
                    <tr><td style="padding: 2px 16px 2px 0;"><strong>Salary:</strong></td>          <td>${process.env.CANDIDATE_SALARY || ''}</td></tr>
                </table>

                <p>
                    <strong>Job Link:</strong>
                    <a href="${jobLink}" target="_blank" style="color: #2563eb;">${jobLink || 'N/A'}</a>
                </p>

                <h4 style="margin-bottom: 4px;">Job Description:</h4>
                <p style="background: #f4f4f4; padding: 10px; border-radius: 6px; white-space: pre-wrap;">${cleanedDescription || roleFromDescription}</p>

                <br/>

                <p>
                    Regards,<br/>
                    <strong>${process.env.SENDER_NAME || 'Your Name'}</strong><br/>
                    ${process.env.TEAM_LEAD_EMAIL || 'quinn@jpitstaffing.com'}
                </p>

                </body>
                </html>
            `,
            attachments: [
                {
                    filename: resumePath.split('/').pop(),
                    path: resumePath
                }
            ]
        });

        console.log(`✅ Email sent to ${toEmail} | Resume: ${resumePath}`);

    } catch (error) {
        console.log(error.message);
    }
}