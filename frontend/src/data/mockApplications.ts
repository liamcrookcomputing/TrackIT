import type { Application } from "../types/applications";

export const mockApplications: Application[] = [
    {
        id: 1,
        position: "Frontend Developer",
        company: "Google",
        status: "Applied",
        createdAt: "2026-08-18T09:00:00.000Z",
        notes: "Applied through the Google careers portal.",
        source: "Google Careers",
        events: [
            {
                id: 101,
                status: "Applied",
                createdAt: "2026-08-18T09:00:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 2,
        position: "Software Engineer",
        company: "Amazon",
        status: "Interview",
        createdAt: "2026-08-10T11:30:00.000Z",
        notes: "Phone interview completed. Waiting for next steps.",
        source: "LinkedIn",
        events: [
            {
                id: 201,
                status: "Applied",
                createdAt: "2026-08-10T11:30:00.000Z",
                reason: null
            },
            {
                id: 202,
                status: "Interview",
                createdAt: "2026-08-20T14:00:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 3,
        position: "Junior Developer",
        company: "Meta",
        status: "Technical Assessment",
        createdAt: "2026-08-05T08:45:00.000Z",
        notes: "Technical assessment received. Due next week.",
        source: "Meta Careers",
        events: [
            {
                id: 301,
                status: "Applied",
                createdAt: "2026-08-05T08:45:00.000Z",
                reason: null
            },
            {
                id: 302,
                status: "Technical Assessment",
                createdAt: "2026-08-22T10:15:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 4,
        position: "Graduate Software Engineer",
        company: "Atlassian",
        status: "Saved",
        createdAt: "2026-08-24T12:00:00.000Z",
        notes: "Interesting graduate position. Need to tailor resume before applying.",
        source: "Atlassian Careers",
        events: [
            {
                id: 401,
                status: "Saved",
                createdAt: "2026-08-24T12:00:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 5,
        position: "Full Stack Developer",
        company: "Canva",
        status: "Final Interview",
        createdAt: "2026-07-28T09:30:00.000Z",
        notes: "Final interview scheduled with the engineering manager.",
        source: "Canva Careers",
        events: [
            {
                id: 501,
                status: "Applied",
                createdAt: "2026-07-28T09:30:00.000Z",
                reason: null
            },
            {
                id: 502,
                status: "Interview",
                createdAt: "2026-08-03T13:00:00.000Z",
                reason: null
            },
            {
                id: 503,
                status: "Final Interview",
                createdAt: "2026-08-21T15:30:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 6,
        position: "Backend Engineer",
        company: "Microsoft",
        status: "Offer",
        createdAt: "2026-07-15T10:00:00.000Z",
        notes: "Offer received. Reviewing salary and benefits.",
        source: "Microsoft Careers",
        events: [
            {
                id: 601,
                status: "Applied",
                createdAt: "2026-07-15T10:00:00.000Z",
                reason: null
            },
            {
                id: 602,
                status: "Interview",
                createdAt: "2026-07-25T11:00:00.000Z",
                reason: null
            },
            {
                id: 603,
                status: "Final Interview",
                createdAt: "2026-08-10T09:00:00.000Z",
                reason: null
            },
            {
                id: 604,
                status: "Offer",
                createdAt: "2026-08-23T16:00:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 7,
        position: "Software Developer",
        company: "REA Group",
        status: "Applied",
        createdAt: "2026-07-20T08:00:00.000Z",
        notes: "Applied for the software development team.",
        source: "SEEK",
        events: [
            {
                id: 701,
                status: "Applied",
                createdAt: "2026-07-20T08:00:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 8,
        position: "Graduate Developer",
        company: "SEEK",
        status: "Rejected",
        createdAt: "2026-07-12T14:00:00.000Z",
        notes: "Application was rejected after resume screening.",
        source: "SEEK",
        events: [
            {
                id: 801,
                status: "Applied",
                createdAt: "2026-07-12T14:00:00.000Z",
                reason: null
            },
            {
                id: 802,
                status: "Rejected",
                createdAt: "2026-07-19T10:30:00.000Z",
                reason: "Resume screening"
            }
        ]
    },

    {
        id: 9,
        position: "Cloud Engineer",
        company: "NAB",
        status: "Applied",
        createdAt: "2026-08-01T09:15:00.000Z",
        notes: "Cloud infrastructure and AWS focused position.",
        source: "NAB Careers",
        events: [
            {
                id: 901,
                status: "Applied",
                createdAt: "2026-08-01T09:15:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 10,
        position: "DevOps Engineer",
        company: "ANZ",
        status: "Technical Assessment",
        createdAt: "2026-07-30T10:45:00.000Z",
        notes: "Assessment submitted. Waiting for feedback.",
        source: "LinkedIn",
        events: [
            {
                id: 1001,
                status: "Applied",
                createdAt: "2026-07-30T10:45:00.000Z",
                reason: null
            },
            {
                id: 1002,
                status: "Technical Assessment",
                createdAt: "2026-08-12T13:30:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 11,
        position: "Mobile App Developer",
        company: "Xero",
        status: "Interview",
        createdAt: "2026-08-06T11:00:00.000Z",
        notes: "Initial interview went well. Waiting for technical interview.",
        source: "Xero Careers",
        events: [
            {
                id: 1101,
                status: "Applied",
                createdAt: "2026-08-06T11:00:00.000Z",
                reason: null
            },
            {
                id: 1102,
                status: "Interview",
                createdAt: "2026-08-18T14:30:00.000Z",
                reason: null
            }
        ]
    },

    {
        id: 12,
        position: "Graduate Software Engineer",
        company: "CommBank",
        status: "Applied",
        createdAt: "2026-07-25T08:30:00.000Z",
        notes: "Graduate program application submitted.",
        source: "CommBank Careers",
        events: [
            {
                id: 1201,
                status: "Applied",
                createdAt: "2026-07-25T08:30:00.000Z",
                reason: null
            }
        ]
    }
];