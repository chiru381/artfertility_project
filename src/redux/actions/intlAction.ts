import { SET_CURRENT_LOCALE } from "redux/actionTypes";

export const setCurrentLocale = (locale: string) => ({
	type: SET_CURRENT_LOCALE,
	locale
});
