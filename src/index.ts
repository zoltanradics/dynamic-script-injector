
export function dynamicScriptInjector(baseUrl: string, queryParamObject: { [key: string]: string }): Promise<void> {
	const timeoutDuration = 2000;
	const constructedUrl = generateUrl(baseUrl, queryParamObject);

	// Create script element
	const scriptElement = document.createElement('script');
	scriptElement.src = constructedUrl;
	scriptElement.async = true;

	// Insert element to the end of the <head> element
	const headElement = document.getElementsByTagName('head')[0];
	if (!headElement) {
		return Promise.reject(new Error('No <head> element found in document'));
	}
	headElement.insertAdjacentElement('beforeend', scriptElement);

	return new Promise(function (resolve, reject) {
		// Resolve  promise automatically when we ran out of time
		const timeout = setTimeout(() => {
			cleanup();
			resolve();
			console.warn(`${constructedUrl} was loading for too long time.`);
		}, timeoutDuration);

		const cleanup = () => {
			clearTimeout(timeout);
			scriptElement.removeEventListener('load', onLoad);
			scriptElement.removeEventListener('error', onError);
		};

		// Handle when script is loaded successfully
		const onLoad = function (event: Event) {
			cleanup();
			resolve();
		};

		// Handle when there was an error while loading the script
		const onError = function (event: Event) {
			cleanup();
			reject(new Error(`Failed to load ${constructedUrl}.`));
		};

		scriptElement.addEventListener('load', onLoad);
		scriptElement.addEventListener('error', onError);
	});
}

function generateUrl(baseUrl: string, queryParamsObject: { [key: string]: string }): string {
	const keys = Object.keys(queryParamsObject);

	// If no query params to add, return baseUrl as-is
	if (keys.length === 0) {
		return baseUrl;
	}

	// Determine the first separator based on whether baseUrl already has query params
	const firstSeparator = baseUrl.includes('?') ? '&' : '?';

	const queryString = keys.reduce((acc, key, index) => {
		const encodedKey = encodeURIComponent(key);
		const encodedValue = encodeURIComponent(queryParamsObject[key]);
		const separator = index === 0 ? firstSeparator : '&';
		return `${acc}${separator}${encodedKey}=${encodedValue}`;
	}, '');

	return `${baseUrl}${queryString}`;
}
