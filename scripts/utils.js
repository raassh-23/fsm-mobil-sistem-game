/**
 * 
 * @param {IRuntime} runtime 
 * @param {number} x 
 * @param {number} y 
 * @param {string} id 
 * @param {string} text 
 * @returns 
 */
export function createClickableText(runtime, x, y, id, text) {
	const textInstance = runtime.objects.Text.createInstance(0, x, y);

	textInstance.text = text;
	textInstance.instVars.id = id;
	textInstance.isBold = true;
	textInstance.instVars.clickable = true;

	return textInstance;
}

/**
 * 
 * @param {IRuntime} runtime 
 * @param {string} id 
 * @returns 
 */
export function destroyTextById(runtime, id) {
	for (const textInstance of runtime.objects.Text.instances()) {
		if (textInstance.instVars.id === id) {
			textInstance.destroy();
			return;
		}
	};
}

/**
 * 
 * @param {number} ms 
 * @returns {Promise<void>}
 */
export async function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 
 * @param {ITextInstance} textInstance 
 */
export function shakeText(textInstance) {
	textInstance.behaviors.Sine.isEnabled = true;
	
	wait(500).then(() => {
		textInstance.behaviors.Sine.isEnabled = false;
        textInstance.behaviors.Sine.phase = 0;
	})
}
