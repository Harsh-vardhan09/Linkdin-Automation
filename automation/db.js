import fs from "fs";

const File='./data/applied.json'

export function getAppliedEmails(){
    const data=fs.readFileSync(File)
    return JSON.parse(data)
}

export function saveAppliedEmail(email) {
    const emails = getAppliedEmails();
    emails.push(email);
    fs.writeFileSync(File, JSON.stringify(emails, null, 2));
}

export function alreadyAppliedEmail(email){
    const emails=getAppliedEmails();
    return emails.includes(email)
}