// http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
function setCaretPosition(el, start, end) {
	el.value = el.value;
	// ^ this is used to not only get "focus", but
	// to make sure we don't have it everything -selected-
	// (it causes an issue in chrome, and having it doesn't hurt any other browser)

	// (el.selectionStart === 0 added for Firefox bug)
	if (el.selectionStart || el.selectionStart === 0) {
		el.focus();
		if (!end || end < start) {
			end = start;
		}
		el.setSelectionRange(start, end);
		return true;
	}

	if (el.createTextRange) {
		const range = el.createTextRange();
		range.move('character', end);
		range.select();
		return true;
	}

	el.focus();
	return false;
}

module.exports = setCaretPosition
