export default function extractEmails(text) {
    const regex =
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig;
    return text.match(regex) || [];
}

