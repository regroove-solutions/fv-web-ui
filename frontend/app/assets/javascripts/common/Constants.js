export const STATE_UNAVAILABLE = 0 // component is loading (eg: getting data) or busy (eg: submitting data)
export const STATE_DEFAULT = 1 // initial, loaded state, eg: displaying a form
export const STATE_ERROR = 2 // component is not happy, ie: form validation (not .js errors)
export const STATE_SUCCESS = 3 // component is happy, ie: form submitted
export const STATE_ERROR_BOUNDARY = 4 // component has triggered a .js error or is completely messed up
