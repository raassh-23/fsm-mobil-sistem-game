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
 *      },
 *      conditionalTransitions: [
 *        {
 *          target: string,
 *          condition: {
 *             evaluate: () => boolean,
 *             onFalse?: () => void
 *          },
 *          action?: () => void
 *        }
 *      ],
 *    }
 *  }
 * }} StateMachineDefinition
 */

/**
 * @typedef {{
 *   value: string,
 *   transition: (event: string) => string,
 *   updateConditional: () => boolean
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

            const destinationState = changeState(
                currentStateDefinition, 
                destinationTransition,
                stateMachineDefinition,
            );

            if (!destinationState) {
                return;
            }

            machine.value = destinationState;

            return machine.value;
        },
        updateConditional: function() {
            const currentStateDefinition = stateMachineDefinition.states[this.value];
            const destinationTransitions = currentStateDefinition.conditionalTransitions;

            for (const destinationTransition of destinationTransitions) {
                const destinationState = changeState(
                    currentStateDefinition,
                    destinationTransition,
                    stateMachineDefinition,
                );

                if (!destinationState) {
                    continue;
                }

                machine.value = destinationState;
                return true;
            }

            return false;
        },
    }

    const initialStateDefinition = stateMachineDefinition.states[machine.value];
    initialStateDefinition.actions?.onEnter?.();

    return machine;
}

/**
 * @param {{
 *   target: string,
 *   condition?: {
 *      evaluate: () => boolean,
 *      onFalse?: () => void
 *   },
 *   action?: () => void
 * }} destinationTransition 
 * 
 * @returns {string | null}
 */
function changeState(currentStateDefinition, destinationTransition, stateMachineDefinition) {
    const condition = destinationTransition.condition?.evaluate() ?? true;

    if (!condition) {
        destinationTransition.condition.onFalse?.();
        return null;
    }

    const destinationState = destinationTransition.target;
    const destinationStateDefinition =
        stateMachineDefinition.states[destinationState];

    destinationTransition.action?.();
    currentStateDefinition.actions?.onExit?.();
    destinationStateDefinition.actions?.onEnter?.();

    return destinationState;
}
