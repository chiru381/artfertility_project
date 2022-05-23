export function floatNumConv(value: string | number | null | undefined) {
    // return +value % 1 === 0 ? +value : +Number(value).toFixed(2);
    if (value && +value === 0) {
        let v = +value;
        return v.toFixed(2);
    } else {
        return value;
    }
}