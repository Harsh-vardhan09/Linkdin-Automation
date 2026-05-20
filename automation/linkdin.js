import { chromium } from "playwright";
import 'dotenv/config'

let browser;
let context;
let page;

export const login = async () => {

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

export const login2 = async () => {

    context = await chromium.launchPersistentContext(
        "C:/Users/Dell/AppData/Local/Google/Chrome/User Data",
        {
            channel: "chrome",
            headless: false,
        }
    );


    const pages = context.pages();

    if (pages.length) {
        await pages[0].close();
    }

    page = await context.newPage();

    await page.goto("https://www.linkedin.com/feed/");
};


export const getJobs = async (keyword) => {
    const searchUrl =
        `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(keyword + ' -hotlist')}&datePosted=past-24h&sortBy=date_posted`;

    await page.goto(searchUrl);
    await page.waitForTimeout(5000);

    for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 5000);
        await page.waitForTimeout(2000);
    }

    
    const emails = await page.$$eval(
        'a[href^="mailto:"]',
        links => links.map(link => link.href.replace('mailto:', ''))
    );

    
    const links = await page.$$eval(
        'a[href*="/posts/"], a[href*="/jobs/view/"]',
        anchors => anchors.map(a => a.href)
    );

    
    const posts = await page.$$eval(
        '[data-testid="expandable-text-box"]',
        els => els.map(el => el.innerText.trim())
    );

    const uniqueEmails = [...new Set(emails)];
    const uniqueLinks = [...new Set(links)];
    const uniquePosts = [...new Set(posts)];

    const results = uniqueEmails.map((email, index) => ({
        role: keyword,
        email,
        jobLink: uniqueLinks[index] || null,
        jobDescription: uniquePosts[index] || null
    }));

    console.log("RESULTS:", results);
    return results;
};


export const closed = async () => {
    await browser.close()
}