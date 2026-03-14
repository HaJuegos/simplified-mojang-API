import * as mc from "@minecraft/server";

/**
 * Clase principal que otorga simplificaciones de las llamadas de world y sus utilidades de sus llamadas y/o variables.
 * @class WorldToolsSimplified
 * @author HaJuegos - 12-03-2026
 */
class WorldToolsSimplified {
    /**
     * Eventos que se inicializan cuando la clase es llamada o inicializada.
     * @constructor
     */
    constructor () { }

    /**
     * Metodo auxiliar que establece una serie de eventos con un pequeño retraso determinado. Luego de terminar el retraso, elimina la tarea para no dejarlo en memoria.
     * @param {() => void} callback Los eventos en cuestion a ejecutar.
     * @param {number} ticksDelay Los tiempos en ticks que se tardara para ejecutarse.
     * @returns {Promise<void>} 
     * @author HaJuegos - 13-03-2026
     * @async Es un metodo asincrono, debido a que se limpia despues de la ejecucion.
     * @systemEvent Este metodo usa los eventos system donde posiblemente puede ser beforeEvent, permitiendo la ejecucion antes de que pase.
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.setDelay(() => {
     *    console.warn('Este evento se ejecutara despues de 5 segundos');
     * } worldToolsSimplified.convertSecondsToTicks(5))
     * ```
     */
    public async setDelay(callback: () => void, ticksDelay: number): Promise<void> {
        return new Promise<void>((resolve) => {
            const currentJob = mc.system.runTimeout(() => {
                callback();

                mc.system.clearRun(currentJob);

                resolve();
            }, ticksDelay);
        });
    };

    /**
     * Metodo auxiliar que establece una serie de eventos en concreto que se mantendran en loop.
     * @param {() => void} callback Los eventos en concreto.
     * @param {number} loopTicks El numero en ticks que se repetira este loop.
     * @returns {number} Devuelve el ID de la memoria, del proceso loop creado.
     * @author HaJuegos - 13-03-2026
     * @systemEvent Este metodo usa los eventos system donde posiblemente puede ser beforeEvent, permitiendo la ejecucion antes de que pase.
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.setLoop(() => {
     *    console.warn('Este evento se ejecutara cada 1 segundo');
     * } worldToolsSimplified.convertSecondsToTicks(1))
     * ```
     */
    public setLoop(callback: () => void, loopTicks: number): number {
        return mc.system.runInterval(callback, loopTicks);
    };

    /**
     * Metodo auxiliar que detiene un proceso looping creado previamente por medio de su ID generado en memoria.
     * @param {number} runID ID del proceso generado.
     * @author HaJuegos - 13-03-2026
     * @systemEvent Este metodo usa los eventos system donde posiblemente puede ser beforeEvent, permitiendo la ejecucion antes de que pase.
     * @public
     * @example
     * ```ts
     * // Se crea el evento primero, generado su ID en memoria.
     * const idLoop = worldToolsSimplified.setLoop(() => {
     *   console.warn('este evento se esta repitiendo cada 1 segundo');
     * } worldToolsSimplified.convertSecondsToTicks(1))
     * 
     * // Con el ID generado en memoria, lo usamos para detenerlo cuando queramos.
     * worldToolsSimplified.stopLoop(idLoop);
     * ```
     */
    public stopLoop(runID: number): void {
        mc.system.clearRun(runID);
    }

    /**
     * Metodo auxiliar que envia un mensaje global al mundo en formato string o rawmessage.
     * @public
     * @param {(string | mc.RawMessage)} message Mensaje o RawMessage en concreto a enviar. 
     * @author HaJuegos - 12-03-2026
     * @example
     * ```ts
     * // Este es un mensaje simple
     * worldToolsSimplified.sendMessageGlobal('hola soy un mensaje');
     * 
     * // Este es un mensaje RawText
     * worldToolsSimplified.sendMessageGlobal({ rawtext: 'chat.test.message' });
     * ```
     */
    public sendMessageGlobal(message: string | mc.RawMessage): void {
        mc.world.sendMessage(message);
    }

    /**
     * Metodo auxiliar que convierte segundos a ticks de forma simple.
     * @public
     * @param {number} seconds Los segundos a convertir.
     * @returns {number} Los ticks convertidos.
     * @author HaJuegos - 12-03-2026
     * @example
     * ```ts
     * // 15 segundos son 300 ticks (20 ticks por segundo)
     * const ticks = worldToolsSimplified.convertSecondsToTicks(15); // 300
     * ```
     */
    public convertSecondsToTicks(seconds: number): number {
        return mc.TicksPerSecond * seconds;
    }

    /**
     * Metodo auxiliar que convierte ticks a segundos de forma simple.
     * @public
     * @param {number} ticks Los ticks a convertir.
     * @returns {number} Los segundos convertidos.
     * @author HaJuegos - 12-03-2026
     * @example
     * ```ts
     * // 300 ticks son 15 segundos (20 ticks por segundo)
     * const seconds = worldToolsSimplified.convertTicksToSeconds(300); // 15
     * ```
     */
    public convertTicksToSeconds(ticks: number): number {
        return ticks / mc.TicksPerSecond;
    }
}

export const worldToolsSimplified = new WorldToolsSimplified();