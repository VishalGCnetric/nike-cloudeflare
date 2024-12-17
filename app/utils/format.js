function formatNumber(number) {
	return Number(number).toLocaleString();
}

function cx(...classNames) {
	return classNames.filter(Boolean).join(' ');
}

export { formatNumber, cx };
