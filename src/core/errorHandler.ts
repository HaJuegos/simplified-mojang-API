/**
 * Clase que controla el manejo de errores y situaciones de la API en concreto.
 * @author HaJuegos - 31-03-2026
 * @export
 */
export class CatLogHandler {
    constructor () { }

    /**
     * Metodo principal que convierte y modifica los eventos para cuando hay un error en la API, siendo mas detallada al respecto y con guias.
     * @param {*} e Error en concreto que sucedio.
     * @param {string} ctxName Evento en concreto donde sucedio el error.
     * @param {?string} [registrationTrace] (Opcional) El track en concreto donde haya sucedido el error.
     * @author HaJuegos - 31-03-2026 
     * @public
     * @static
     */
    public static handleError(e: any, ctxName: string, registrationTrace?: string): void {
        const error = e as Error;


        let logMessage = `\n§c=== [CATLOG ERROR] ===§r\n`;

        logMessage += `§eContexto:§r ${ctxName}\n`;
        logMessage += `§cMotivo:§r ${error.message}\n`;

        if (error.message.includes("restricted execution")) {
            logMessage += `§b[TIP]:§r Envuelve tu logica dentro de un 'worldToolsSimplified.setRun()' o usa async.\n`;
        } else if (error.message.includes("early execution")) {
            logMessage += `§b[TIP]:§r Mueve este codigo al evento 'onWorldReady' para asegurarte de que los datos existan.\n`;
        } else if (error.message.includes("Entity being invalid") || error.message.includes("has the Entity been removed")) {
            logMessage += `§b[TIP]:§r La entidad ya fue eliminada del mundo. Verifica si es valida con 'if(entity?.isValid())' antes de intentar algo con ella.\n`;
        }

        const execStack = error.stack?.split('\n').find(line => line.includes('at ') && !line.includes('BaseEventManager') && !line.includes('CatlogErrorHandler') && !line.includes('WorldToolsSimplified'));

        if (execStack) {
            logMessage += `§4[Fallo exacto]:§r ${execStack.trim()}\n`;
        }

        if (registrationTrace) {
            const cleanTrace = registrationTrace
                .split('\n')
                .filter(line => line.includes('at ') && !line.includes('__require') && !line.includes('<anonymous>') && !line.includes('BaseEventManager') && !line.includes('CatlogErrorHandler') && !line.includes('WorldToolsSimplified'))
                .map(line => `  -> ${line.trim()}`)
                .join('\n');

            if (cleanTrace) {
                logMessage += `§a[Origen de la Ejecución]:§r\n${cleanTrace}\n`;
            }
        }

        logMessage += `§c========================§r`;

        console.warn(logMessage);
    }
}