
function buildFormData(formData: any, data: any, parentKey: any = null) {
	if (
		data &&
		typeof data === "object" &&
		!(data instanceof Date) &&
		!(data instanceof File) &&
		!(data instanceof Blob) &&
		!(Array.isArray(data) && !data.length)
	) {
		Object.keys(data).forEach((key) => {
			buildFormData(
				formData,
				data[key],
				parentKey ? `${parentKey}[${key}]` : key
			);
		});
	} else {
        // let value = "";

        // if(data === null) value = ""
        // if(typeof +data == 'number') value = +data;

        let value = data == null ? "" : data;

		formData.append(parentKey,  value);
	}
}

export function jsonToFormData(data :any) {
	const formData = new FormData();

	buildFormData(formData, data);

	return formData;
}
