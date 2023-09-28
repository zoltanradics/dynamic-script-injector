
export function dynamicScriptInjector(baseUrl: string, queryParamObject: any) {
	const timeoutDuration = 2000;
	const constructedUrl = generateUrl(baseUrl, queryParamObject);

	// Create script element
	const scriptElement = document.createElement('script');
	scriptElement.src = constructedUrl;
	scriptElement.async = true;

	// Insert element to the end of the <head> element
	const headElement = document.getElementsByTagName('head');
	headElement[0].insertAdjacentElement('beforeend', scriptElement);

	return new Promise(function (resolve, reject) {
		// Resolve  promise automatically when we ran out of time
		const timeout = setTimeout((event) => {
			resolve(event);
			clearTimeout(timeout);
			console.warn(`${constructedUrl} was loading for too long time.`);
		}, timeoutDuration);

		// Handle when script is loaded successfully
		scriptElement.addEventListener('load', function (event: Event) {
			resolve(event);
			clearTimeout(timeout);
		});

		// Handle when there was an error while loading the script
		scriptElement.addEventListener('error', function (event: Event) {
			reject(event);
			clearTimeout(timeout);
			throw new Error(`Failed to load ${constructedUrl}.`);
		});
	});
}

function generateUrl(baseUrl: string, queryParamsObject: { [key: string]: string }): string {
	const queryString = Object.keys(queryParamsObject).reduce((acc, key) => {
		return `${acc === '' ? '?' : '&'}${key}=${queryParamsObject[key]}`;
	}, '');

	return `${baseUrl}${queryString}`;
}
