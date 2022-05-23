interface TextBoxinputRulesParams {
	required?: boolean;
	maxLength?: number;
	minLength?: number;
	type?: 'text' | 'number' | 'numberWithDecimal' | 'email' | 'contact' | 'landline' | 'textWithSpace' | 'textWithNumber' | 'numberWithSpecialCharacter' | 'textWithNumberWithoutZeroLeading' | 'passwordPolicy' | 'textWithNumberSpecialCharacter' | 'textInCapsWithSpace';
	min?: number;
	max?: number;
}

export const regExp = {
	text: /^[a-zA-Z]+$/,
	textWithSpace: /^[-a-zA-Z-()]+(\s+[-a-zA-Z-()]+)*$/,
	textWithNumber: /^[a-zA-Z0-9_ ]+$/,
	email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
	contact: /^(98|97|96|95|94|93|92)([0-9]{8})$/,
	number: /^[1-9][0-9]*$/,
	numberWithDecimal: /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/,
	numberWithSpecialCharacter: /^[0-9#$%^&*()@!-/.,]*$/,
	landline: /^01[0-9]+$/,
	textWithNumberWithoutZeroLeading: /^[a-zA-Z1-9_ ][a-zA-Z0-9_ ]*$/,
	textWithNumberSpecialCharacter: /^[a-zA-Z0-9#$%^&*()@!-/.,]*$/,
	passwordPolicy: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,50}$/,
	textInCapsWithSpace: /^[A-Z\s]+$/,
};

export const validationRule = {
	textbox: (inputRules: TextBoxinputRulesParams) => {
		let rule: { [key: string]: any } = {};

		if (inputRules.required) {
			rule = {
				...rule,
				required: true,
			};
		}

		if (inputRules.maxLength) {
			rule = {
				...rule,
				maxLength: {
					value: inputRules.maxLength,
					message: `Maximum ${inputRules.maxLength} characters`,
				},
			};
		}

		if (inputRules.minLength) {
			rule = {
				...rule,
				minLength: {
					value: inputRules.minLength,
					message: `Minimum ${inputRules.minLength} characters`,
				},
			};
		}

		if (inputRules.min) {
			rule = {
				...rule,
				min: {
					value: inputRules.min,
					message: `Minimum value is ${inputRules.min}`,
				},
			};
		}

		if (inputRules.max) {
			rule = {
				...rule,
				max: {
					value: inputRules.max,
					message: `Maximum value is ${inputRules.max}`,
				},
			};
		}

		if (inputRules.type === 'text') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be alphabets',
				},
			};
		}

		if (inputRules.type === 'textWithSpace') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be alphabets with only space in middle',
				},
			};
		}

		if (inputRules.type === 'textWithNumber') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be valid',
				},
			};
		}

		if (inputRules.type === 'email') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Invalid email address',
				},
			};
		}

		if (inputRules.type === 'contact') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Invalid Contact Number',
				},
			};
		}

		if (inputRules.type === 'landline') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Invalid Landline Number',
				},
			};
		}

		if (inputRules.type === 'number') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be Numeric',
				},
			};
		}

		if (inputRules.type === 'numberWithDecimal') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be Numeric with two decimal',
				},
			};
		}

		if (inputRules.type === 'numberWithSpecialCharacter') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be numeric|special character',
				},
			};
		}

		if (inputRules.type === 'passwordPolicy') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Incorrect Passowrd format',
				},
			};
		}
		if (inputRules.type === 'textWithNumberSpecialCharacter') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be valid',
				},
			};
		}
		if (inputRules.type === 'textInCapsWithSpace') {
			rule = {
				...rule,
				pattern: {
					value: regExp[inputRules.type],
					message: 'Must be capital latters',
				},
			};
		}

		return rule;
	},
};
