import 'dotenv/config'
import { closed, getJobs, login } from './automation/linkdin.js';
import sendEmail from './automation/mail.js';
import { alreadyAppliedEmail, saveAppliedEmail } from './automation/db.js';
import express from 'express'

const app = express()


app.get('/', (req, res) => {
    res.send("this is automation bot")
})

app.post('/api/automated/run', async (req, res) => {
    const keywords = [

        'Java Developer HIRING',
        'React Developer HIRING',
        'Node.js Developer HIRING',
        'BUSINESS ANALYST HIRING',
        'PROJECT MANAGER HIRING',
        'DATA ANALYST HIRING'
    ];

    await login()

    for (const keyword of keywords) {
        console.log(`Searching for ${keyword}`);

        const jobs = await getJobs(keyword);

        console.log(jobs);

        for (const job of jobs) {
            for (const email of job.emails) {

                if (!alreadyAppliedEmail(email)) {
                    console.log(`Sending to ${email}`);

                    await sendEmail(
                        email,
                        keyword
                    );

                    saveAppliedEmail(email);

                } else {

                    console.log(
                        `Already applied to ${email}`
                    );
                }
            }
        }
    }
    closed();
    
})



app.listen('8080', () => {
    console.log('app is running on http://localhost:8080');

})