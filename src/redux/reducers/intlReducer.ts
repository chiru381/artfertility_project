import { SET_CURRENT_LOCALE } from "redux/actionTypes";
import { IntlActionType, IntlReducerType } from "utils/types";

export const initialState = {
	locale: "en",
};

export function intlReducer(state = initialState, action: IntlActionType): IntlReducerType {
	switch (action.type) {
		case SET_CURRENT_LOCALE: {
			return { ...state, locale: action.locale };
		}

		default:
			return state;
	}
}