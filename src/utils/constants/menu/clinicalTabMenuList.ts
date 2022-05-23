interface TabListState {
    label: string;
    to: string;
}

export const clinicalTabMenuList: TabListState[] = [
    { label: "Overview", to: '/overview' },
    { label: "Vitals", to: '/vitals/summary' },
    { label: "Anamnesis", to: '/anamnesis' },
    { label: "Request/Result", to: '/request-result' },
    { label: "Diagnosis", to: '/diagnosis' },
    { label: "Treatment Plan", to: '/treatment-plan' },
    { label: "Prescription", to: '/prescription' },
    { label: "Stimulation", to: '/stimulation' },
    { label: "Surgery", to: '/surgery' },
    { label: "IVF Lab", to: '/ivf-lab' },
    { label: "Genomics Lab", to: '/genomics-lab' },
    { label: "Follow Up Notes", to: '/follow-up-notes' },
    { label: "Consents", to: '/consent' },
    { label: "Outcome", to: '/outcome' },
    { label: "Reports", to: '/reports' },
]