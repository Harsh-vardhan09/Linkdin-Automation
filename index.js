import 'dotenv/config'
import { closed, getJobs, login, login2 } from './automation/linkdin.js';  
import sendEmail from './automation/mail.js';
import { alreadyAppliedEmail, saveAppliedEmail } from './automation/db.js';
import { getResumeForKeyword } from './automation/resumeMap.js';  
import express from 'express'

const app = express()

app.get('/', (req, res) => {
    res.send("this is automation bot")
})

app.post('/api/automated/run', async (req, res) => {


    const keywords = [
        'Java Developer HIRING -hotlist',
        'React Developer HIRING -hotlist',
        'Node.js Developer HIRING -hotlist',
        'BUSINESS ANALYST HIRING -hotlist',
        'PROJECT MANAGER HIRING -hotlist',
        'DATA ANALYST HIRING -hotlist'
    ];

    try {

        await login();

        for (const keyword of keywords) {

            console.log(`Searching for: ${keyword}`);

            
            const jobs = await getJobs(keyword);

            console.log(jobs);

           
            const resumePath = getResumeForKeyword(keyword);
            console.log(`Using resume: ${resumePath} for keyword: ${keyword}`);

            for (const job of jobs) {

                if (!job.email) continue;

                if (!alreadyAppliedEmail(job.email)) {

                    console.log(`Sending to ${job.email}`);

                    await sendEmail(
                        job.email,
                        job.role || keyword,
                        job.jobLink,
                        job.jobDescription,
                        resumePath          
                    );

                    saveAppliedEmail(job.email);

                } else {
                    console.log(`Already applied to ${job.email}`);
                }
            }
        }
        closed()

        res.json({ success: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
});


app.listen('8080', () => {
    console.log('app is running on http://localhost:8080');
})