type FormDataBody = Record<string, string | number | boolean | File | File[] | null | undefined>;

export function buildFormData(body: FormDataBody): FormData {
	const formData = new FormData();

	Object.entries(body).forEach(([key, value]) => {
		if (value === undefined || value === null) return;

		if (Array.isArray(value)) {
			value.forEach((item) => formData.append(key, item));
		} else if (value instanceof File) {
			formData.append(key, value);
		} else {
			formData.append(key, String(value));
		}
	});

	return formData;
}
