import { chromium } from "playwright";
import 'dotenv/config'

let browser;
let context;
let page;

export const login=async()=>{

    browser = await chromium.launch({
        headless: false
    })

     context = await browser.newContext();

     page = await context.newPage();


    await page.goto('https://www.linkedin.com/login');
    await page.locator('input[name="session_key"]')
        .fill(process.env.LINKEDIN_EMAIL);

    await page.locator('input[name="session_password"]')
        .fill(process.env.LINKEDIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    // await page.waitForLoadState("networkidle");

    console.log("LinkedIn login successful");

}

export const getJobs = async (keyword) => {

    const searchUrl = `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(keyword)}`;

    await page.goto(searchUrl)
    await page.waitForTimeout(5000);

    for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 5000);
        await page.waitForTimeout(2000);
    }


    const emails = await page.$$eval(

        'a[href^="mailto:"]',
        links => {
            return links.map(link => {
                return link.href.replace(
                    'mailto:',
                    ''
                );
            });
        }
    );






    console.log("EMAILS:", emails);



    const uniqueEmails =
    [...new Set(emails)];


    const results =
    uniqueEmails.map(email => {

        return {
            role: keyword,
            emails: [email]
        };
    });

    console.log("RESULTS:", results);

    return results;
}


export const closed=async()=>{
    await browser.close()
}