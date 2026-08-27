export type ApplicationStatus =
    | "Saved"
    | "Applied"
    | "Interview"
    | "Technical Assessment"
    | "Final Interview"
    | "Offer"
    | "Rejected";

export type RejectionReason =
    | "No response"
    | "Resume screening"
    | "Experience mismatch"
    | "Technical assessment"
    | "Interview"
    | "Position filled"
    | "Salary"
    | "Other"


export interface Application {
    readonly id: number | string;
    position: string;
    company: string;
    status: ApplicationStatus;
    createdAt: string;
    events: ApplicationEvent[];
    notes: string | null;
    source: string | null;
}

export interface ApplicationEvent {
    id: number | string;
    reason: RejectionReason | null;
    status: ApplicationStatus;
    createdAt: string;
}

export interface ApplicationInput {
    position: string;
    company: string;
    status: ApplicationStatus;
}

export interface ApplicationUpdate {
    id: number | string;
    position: string;
    company: string;
    status: ApplicationStatus;
    rejectionReason?: RejectionReason | null;
    notes?: string | null;
    source?: string | null;
}