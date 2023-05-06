import { createMachine } from "./fsm.js";

/**
 * @type {import("./fsm").StateMachine}
 */
let fsmKopling = null;

/**
 * @type {ITextInstance}
 */
let fsmMobilText = null;

/**
 * @type {ITextInstance}
 */
let fsmStarterText = null;

/**
 * @type {ITextInstance}
 */
let fsmMesinText = null;

/**
 * @type {ITextInstance}
 */
let fsmKoplingText = null;

/**
 * @type {ITextInstance}
 */
let fsmGasText = null;

/**
 * @type {ITextInstance}
 */
let fsmPersnelingText = null;

runOnStartup(async runtime => {
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

/**
 * 
 * @param {IRuntime} runtime 
 */
async function OnBeforeProjectStart(runtime) {
	runtime.addEventListener("tick", () => Tick(runtime));
	runtime.addEventListener("pointerdown", e => OnPointerDown(e, runtime));

	runtime.objects.Text.getAllInstances().forEach(textInstance => {
		switch (textInstance.instVars["id"]) {
			case "fsm_mobil":
				fsmMobilText = textInstance;
				break;
			case "fsm_starter":
				fsmStarterText = textInstance;
				break;
			case "fsm_mesin":
				fsmMesinText = textInstance;
				break;
			case "fsm_kopling":
				fsmKoplingText = textInstance;
				break;
			case "fsm_gas":
				fsmGasText = textInstance;
				break;
			case "fsm_persneling":
				fsmPersnelingText = textInstance;
				break;
		}
	});

	fsmKopling = createMachine({
		initialState: "0",
		states: {
			"0": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmKoplingText.x,
							fsmKoplingText.y + fsmKoplingText.height,
							"fsm_kopling_unpressed_action_1",
							"Injak Kopling",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_kopling_unpressed_action_1");
					}
				},
				transitions: {
					press: {
						target: "1",
					}
				},
			},
			"1": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmKoplingText.x,
							fsmKoplingText.y + fsmKoplingText.height,
							"fsm_kopling_pressed_action_1",
							"Lepas Kopling",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_kopling_pressed_action_1");
					}
				},
				transitions: {
					release: {
						target: "0",
					},
				},
			},
		},
	});
}

/**
 * 
 * @param {IRuntime} runtime 
 */
function Tick(runtime) {
	fsmKoplingText.text = `Kopling ${fsmKopling.value === "0" ? "dilepas" : "diinjak"}`;
}

/**
 * 
 * @param {Event} e 
 * @param {IRuntime} runtime 
 */
function OnPointerDown(e, runtime) {
	const layer = runtime.layout.getLayer(0);
	const [layerX, layerY] = layer.cssPxToLayer(e.clientX, e.clientY);

	for (const inst of runtime.objects.Text.instances()) {
		if (inst.containsPoint(layerX, layerY)) {
			switch (inst.instVars["id"]) {
				case "fsm_kopling_unpressed_action_1":
					fsmKopling.transition("press");
					break;
				case "fsm_kopling_pressed_action_1":
					fsmKopling.transition("release");
					break;
			}

			break;
		}
	}
}

/**
 * 
 * @param {IRuntime} runtime 
 * @param {number} x 
 * @param {number} y 
 * @param {string} id 
 * @param {string} text 
 * @returns 
 */
function createClickableText(runtime, x, y, id, text) {
	const textInstance = runtime.objects.Text.createInstance(0, x, y);

	textInstance.text = text;
	textInstance.instVars["id"] = id;
	textInstance.isBold = true;

	return textInstance;
}

/**
 * 
 * @param {IRuntime} runtime 
 * @param {string} id 
 * @returns 
 */
function destroyTextById(runtime, id) {
	for (const textInstance of runtime.objects.Text.instances()) {
		if (textInstance.instVars["id"] === id) {
			textInstance.destroy();
			return;
		}
	};
}