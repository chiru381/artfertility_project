interface formState {
    [key: string]: any;
}

export function getFormBody(data: formState, ignoreNull: boolean = false) {
    let formData: formState = {};

    Object.keys(data).map(key => {
        if (data[key]?.value) {
            formData[key] = isNaN(data[key].value) ? data[key].value : +data[key].value;
        } else if (Array.isArray(data[key]) && data[key]?.[0]?.value) {
            formData[key] = data[key].map((option: any) => isNaN(option.value) ? option.value : +option.value);
        } else if (key === "firstName" || key === "middleName" || key === "lastName" || key === "nickName") {
            if (data[key]) {
                formData[key] = String(data[key]).toUpperCase();
            }
        } else if (ignoreNull ? data[key] : true) {
            formData[key] = data[key] === undefined ? null : data[key];
        }
    });

    return formData;
}

export function removeNullFromObject(data: formState) {
    let formData: formState = {};

    Object.keys(data).map(key => {
        if (data[key] !== null) {
            formData[key] = data[key] === undefined ? false : data[key];
        }
    });

    return formData;
}

export function getTreatmentPlanFormBody(data: formState) {
    let formBody = {
        ...data,
        height: +(data.height || 0),
        weight: +(data.weight || 0),
        bmi: +(data.bmi || 0),
        typeOfCycle: data.typeOfCycle ? +data.typeOfCycle : 0
    }

    return getFormBody(formBody);
}