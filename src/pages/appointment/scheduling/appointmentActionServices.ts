import { services } from "utils/services";

export function confirmAppointment(bodyData: any, setLoading: any, toastMessage: any, formatMessage: any, onApiCall: any) {
    setLoading(true);
    services.confirmAppointment(bodyData)
        .then((res) => {
            setLoading(false);
            if (res.data?.succeeded) {
                toastMessage(formatMessage({ id: "appointment-confirm-message" }));
                onApiCall();
            } else {
                toastMessage(res.data?.message, 'error');
            }
        })
        .catch((err) => {
            setLoading(false);
            toastMessage(err.message, 'error');
        })
}


export function markPatientArrived(bodyData: any, setLoading: any, toastMessage: any, formatMessage: any, onApiCall: any) {
    setLoading(true);
    services.markPatientArrived(bodyData)
        .then((res) => {
            setLoading(false);
            if (res.data?.succeeded) {
                toastMessage(formatMessage({ id: "mark-patient-arrived-message" }));
                onApiCall();
            } else {
                toastMessage(res.data?.message, 'error');
            }
        })
        .catch((err) => {
            setLoading(false);
            toastMessage(err.message, 'error');
        })
}

export function startConsultation(bodyData: any, setLoading: any, toastMessage: any, formatMessage: any, onApiCall: any) {
    setLoading(true);
    services.startConsultation(bodyData)
        .then((res) => {
            setLoading(false);
            if (res.data?.succeeded) {
                toastMessage(formatMessage({ id: "start-consultation-message" }));
                onApiCall();
            } else {
                toastMessage(res.data?.message, 'error');
            }
        })
        .catch((err) => {
            setLoading(false);
            toastMessage(err.message, 'error');
        })
}

export function endConsultation(bodyData: any, setLoading: any, toastMessage: any, formatMessage: any, onApiCall: any) {
    setLoading(true);
    services.endConsultation(bodyData)
        .then((res) => {
            setLoading(false);
            if (res.data?.succeeded) {
                toastMessage(formatMessage({ id: "end-consultation-message" }));
                onApiCall();
            } else {
                toastMessage(res.data?.message, 'error');
            }
        })
        .catch((err) => {
            setLoading(false);
            toastMessage(err.message, 'error');
        })
}