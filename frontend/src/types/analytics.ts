export type ApplicationStatusCount = {
    status: string;
    _count: {
        _all: number;
    };
};

export type RejectionReasonCount = {
    reason: string;
    count: number;
}

export type Analytics = {
    totalApplications: number;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
    rejectRate: number;
    applicationStatuses: ApplicationStatusCount[];
    rejectionReasons: RejectionReasonCount[];
}