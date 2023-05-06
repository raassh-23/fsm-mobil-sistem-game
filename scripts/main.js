import { createMachine } from "./fsm.js";

/**
 * @typedef {import('./fsm.js').StateMachine} StateMachine
 */

/**
 * @type {StateMachine}
 */
let fsmKopling = null;

/**
 * @type {StateMachine}
 */
let fsmGas = null;

/**
 * @type {StateMachine}
 */
let fsmPersneling = null;

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
							"fsm_kopling_0_action_1",
							"Injak Kopling",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_kopling_0_action_1");
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
							"fsm_kopling_1_action_1",
							"Lepas Kopling",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_kopling_1_action_1");
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

	fsmGas = createMachine({
		initialState: "0",
		states: {
			"0": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmGasText.x,
							fsmGasText.y + fsmGasText.height,
							"fsm_gas_0_action_1",
							"Injak Gas",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_gas_0_action_1");
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
							fsmGasText.x,
							fsmGasText.y + fsmGasText.height,
							"fsm_gas_1_action_1",
							"Lepas Gas",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_gas_1_action_1");
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

	fsmPersneling = createMachine({
		initialState: "0",
		states: {
			"0": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmPersnelingText.x,
							fsmPersnelingText.y + fsmPersnelingText.height,
							"fsm_persneling_0_action_1",
							"Pindah gigi",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_persneling_0_action_1");
					}
				},
				transitions: {
					changeGear: {
						target: "1",
						condition: {
							evaluate: () => fsmKopling.value === "1",
							onFalse: () => {
								shakeText(fsmKoplingText);
							},
						},
					}
				},
			},
			"1": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmPersnelingText.x,
							fsmPersnelingText.y + fsmPersnelingText.height,
							"fsm_persneling_1_action_1",
							"Pindah Netral",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_persneling_1_action_1");
					}
				},
				transitions: {
					changeGear: {
						target: "0",
						condition: {
							evaluate: () => fsmKopling.value === "1",
							onFalse: () => {
								shakeText(fsmKoplingText);
							},
						},
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
	fsmGasText.text = `Gas ${fsmGas.value === "0" ? "dilepas" : "diinjak"}`;
	fsmPersnelingText.text = `Persneling ${fsmPersneling.value === "0" ? "netral" : "masuk gigi"}`;
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
				case "fsm_kopling_0_action_1":
					fsmKopling.transition("press");
					break;
				case "fsm_kopling_1_action_1":
					fsmKopling.transition("release");
					break;

				case "fsm_gas_0_action_1":
					fsmGas.transition("press");
					break;
				case "fsm_gas_1_action_1":
					fsmGas.transition("release");
					break;

				case "fsm_persneling_0_action_1":
				case "fsm_persneling_1_action_1":
					fsmPersneling.transition("changeGear");
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

async function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function shakeText(textInstance) {
	textInstance.behaviors.Sine.isEnabled = true;
	
	wait(500).then(() => {
		textInstance.behaviors.Sine.isEnabled = false;
	})
}