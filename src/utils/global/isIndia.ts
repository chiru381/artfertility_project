const DEPLOYMENT_COUNTRY = process.env.REACT_APP_DEPLOYMENT_COUNTRY;

export function isIndia(){
    return DEPLOYMENT_COUNTRY === "INDIA";
}

export function isUAE(){
    return DEPLOYMENT_COUNTRY === "UAE";
}