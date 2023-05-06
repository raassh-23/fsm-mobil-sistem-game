/**
 * @typedef {{
 *  initialState: string,
 *  states: {
 *    [key: string]: {
 *      actions?: {
 *        onEnter?: (() => void),
 *        onExit?: (() => void)
 *      },
 *      transitions: {
 *        [key: string]: {
 *          target: string,
 *          condition?: {
 *             evaluate: () => boolean,
 *             onFalse?: () => void
 *          },
 *          action?: () => void
 *        }
 *      }
 *    }
 *  }
 * }} StateMachineDefinition
 */

/**
 * @typedef {{
 *   value: string,
 *   transition: (event: string) => string
 * }} StateMachine
 */

/**
 * 
 * @param {StateMachineDefinition} stateMachineDefinition 
 * @returns {StateMachine}
 */
export function createMachine(stateMachineDefinition) {
    /**
     * @type {StateMachine}
     */
    const machine = {
        value: stateMachineDefinition.initialState,
        transition: function(event) {
            const currentStateDefinition = stateMachineDefinition.states[this.value];
            const destinationTransition = currentStateDefinition.transitions[event];

            if (!destinationTransition) {
                return;
            }

            const condition = destinationTransition.condition?.evaluate() ?? true;

            if (!condition) {
                destinationTransition.condition?.onFalse?.();
                return;
            }

            const destinationState = destinationTransition.target;
            const destinationStateDefinition =
                stateMachineDefinition.states[destinationState];

            destinationTransition.action?.();
            currentStateDefinition.actions?.onExit?.();
            destinationStateDefinition.actions?.onEnter?.();

            machine.value = destinationState;

            return machine.value;
        },
    }

    const initialStateDefinition = stateMachineDefinition.states[machine.value];
    initialStateDefinition.actions?.onEnter?.();

    return machine;
}
