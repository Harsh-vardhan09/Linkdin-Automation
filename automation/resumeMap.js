


export const resumeMap = [
    { keywords: ['java'],                                 resume: 'resume_java.pdf' },
    { keywords: ['react', 'frontend', 'node', 'nodejs'],  resume: 'resume_fullstack.pdf' },
    { keywords: ['data analyst', 'data analysis'],        resume: 'resume_data_analyst.pdf' },
    { keywords: ['business analyst'],                     resume: 'resume_ba.pdf' },
    { keywords: ['project manager'],                      resume: 'resume_pm.pdf' },
];


export function getResumeForKeyword(keyword) {
    const lower = keyword.toLowerCase();

    for (const entry of resumeMap) {
        if (entry.keywords.some(k => lower.includes(k))) {
            return `./resume/${entry.resume}`;
        }
    }

    return './resume/resume.pdf'; 
}