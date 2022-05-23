import React from "react";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";

import enLocaleData from "utils/json/en.json";
import neLocaleData from "utils/json/ne.json";

export interface Props {
	children?: React.ReactNode;
}

const data: { [key: string]: any } = {
	en: enLocaleData,
	ne: neLocaleData,
};

export function flattenMessages(nestedMessages: any, prefix: string = "") {
	return Object.keys(nestedMessages).reduce((messages: any, key: string) => {
		let value = nestedMessages[key];
		let prefixedKey = prefix ? `${prefix}.${key}` : key;

		if (typeof value === "string") {
			messages[prefixedKey] = value;
		} else {
			Object.assign(messages, flattenMessages(value, prefixedKey));
		}
		return messages;
	}, {});
}

export default function LanguageProvider(props: Props) {
	const { locale } = useSelector(({ intl }: any) => ({
		locale: intl.locale,
	}));

	return (
		<IntlProvider
			locale={locale}
			messages={flattenMessages(data[locale])}
			onError={() => null}
		>
			{React.Children.only(props.children)}
		</IntlProvider>
	);
}
