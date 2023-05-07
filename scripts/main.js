import { createMachine } from "./fsm.js";
import { createClickableText, destroyTextById, shakeText } from "./utils.js";

/**
 * @typedef {import('./fsm.js').StateMachine} StateMachine
 */

/**
 * @type {StateMachine}
 */
let fsmMobil = null;

/**
 * @type {StateMachine}
 */
let fsmStarter = null;

/**
 * @type {StateMachine}
 */
let fsmMesin = null;

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
				conditionalTransitions: [],
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
				conditionalTransitions: [],
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
				conditionalTransitions: [],
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
				conditionalTransitions: [],
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
				conditionalTransitions: [],
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
				conditionalTransitions: [],
			},
		},
	});

	fsmStarter = createMachine({
		initialState: "0",
		states: {
			"0": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmStarterText.x,
							fsmStarterText.y + fsmStarterText.height,
							"fsm_starter_0_action_1",
							"Masukkan Kunci Starter",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_starter_0_action_1");
					}
				},
				transitions: {
					putKey: {
						target: "1"
					}
				},
				conditionalTransitions: [],
			},
			"1": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmStarterText.x,
							fsmStarterText.y + fsmStarterText.height,
							"fsm_starter_1_action_1",
							"Cabut Kunci Starter",
						);
						createClickableText(
							runtime,
							fsmStarterText.x,
							fsmStarterText.y + fsmStarterText.height * 2,
							"fsm_starter_1_action_2",
							"Putar Kunci Starter",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_starter_1_action_1");
						destroyTextById(runtime, "fsm_starter_1_action_2");
					}
				},
				transitions: {
					takeKey: {
						target: "0",
					},
					turnKey: {
						target: "2",
						condition: {
							evaluate: () => fsmPersneling.value === "0" || fsmKopling.value === "1",
							onFalse: () => {
								shakeText(fsmPersnelingText);
								shakeText(fsmKoplingText);
							},
						},
					},
				},
				conditionalTransitions: [],
			},
			"2": {
				actions: {
					onEnter: () => {
						createClickableText(
							runtime,
							fsmStarterText.x,
							fsmStarterText.y + fsmStarterText.height,
							"fsm_starter_2_action_1",
							"Putar Kunci Starter",
						);
					},
					onExit: () => {
						destroyTextById(runtime, "fsm_starter_2_action_1");
					}
				},
				transitions: {
					turnKey: {
						target: "1",
					}
				},
				conditionalTransitions: [],
			},
		},
	});

	fsmMesin = createMachine({
		initialState: "0",
		states: {
			"0": {
				transitions: {},
				conditionalTransitions: [
					{
						target: "1",
						condition: {
							evaluate: () => fsmStarter.value === "2",
						}
					},
				],
			},
			"1": {
				transitions: {},
				conditionalTransitions: [
					{
						target: "0",
						condition: {
							evaluate: () => fsmStarter.value != "2",
						}
					},
				],
			},
		},
	});

	fsmMobil = createMachine({
		initialState: "0",
		states: {
			"0": {
				transitions: {},
				conditionalTransitions: [
					{
						target: "1",
						condition: {
							evaluate: () => fsmMesin.value === "1",
						},
					},
				],
			},
			"1": {
				transitions: {},
				conditionalTransitions: [
					{
						target: "0",
						condition: {
							evaluate: () => fsmMesin.value === "0",
						},
					},
					{
						target: "2",
						condition: {
							evaluate: () => fsmPersneling.value === "1" && 
										fsmGas.value === "1" && 
										fsmKopling.value === "0",
						},
					}
				],
			},
			"2": {
				transitions: {},
				conditionalTransitions: [
					{
						target: "1",
						condition: {
							evaluate: () => fsmPersneling.value === "0" ||
										fsmGas.value === "0" ||
										fsmKopling.value === "1",
						},
					}
				],
			},
		},
	});
}

/**
 * 
 * @param {IRuntime} runtime 
 */
function Tick(runtime) {
	updateFSM();

	let starterValue = '';

	if (fsmStarter.value === "0") {
		starterValue = "dicabut";
	} else if (fsmStarter.value === "1") {
		starterValue = "dimasukkan";
	} else if (fsmStarter.value === "2") {
		starterValue = "diputar";
	}

	let carValue = '';

	if (fsmMobil.value === "0") {
		carValue = "mati";
	} else if (fsmMobil.value === "1") {
		carValue = "hidup";
	} else if (fsmMobil.value === "2") {
		carValue = "jalan";
	}

	fsmMobilText.text = `Mobil ${carValue}`;
	fsmStarterText.text = `Kunci Starter ${starterValue}`;
	fsmMesinText.text = `Mesin ${fsmMesin.value === "0" ? "mati" : "hidup"}`;
	fsmKoplingText.text = `Kopling ${fsmKopling.value === "0" ? "dilepas" : "diinjak"}`;
	fsmGasText.text = `Gas ${fsmGas.value === "0" ? "dilepas" : "diinjak"}`;
	fsmPersnelingText.text = `Persneling ${fsmPersneling.value === "0" ? "netral" : "masuk gigi"}`;
}

function updateFSM() {
	const fsms = [fsmMobil, fsmStarter, fsmMesin, fsmKopling, fsmGas, fsmPersneling];

	const result = fsms.some(fsm => fsm.updateConditional());;

	if (result) {
		updateFSM();
		return;
	}

	fsms.forEach(fsm => fsm.tick());
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

				case "fsm_starter_0_action_1":
					fsmStarter.transition("putKey");
					break;

				case "fsm_starter_1_action_1":
					fsmStarter.transition("takeKey");
					break;

				case "fsm_starter_1_action_2":
				case "fsm_starter_2_action_1":
					fsmStarter.transition("turnKey");
					break;
			}

			break;
		}
	}
}
