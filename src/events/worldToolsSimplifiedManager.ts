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
     * @public
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
     * @public
     */
    public setLoop(callback: () => void, loopTicks: number): number {
        return mc.system.runInterval(callback, loopTicks);
    };

    /**
     * Metodo auxiliar que detiene un proceso looping creado previamente por medio de su ID generado en memoria.
     * @param {number} runID ID del proceso generado.
     * @author HaJuegos - 13-03-2026
     * @public
     */
    public stopLoop(runID: number): void {
        mc.system.clearRun(runID);
    }

    /**
     * Metodo auxiliar que envia un mensaje global al mundo en formato string o rawmessage.
     * @public
     * @param {(string | mc.RawMessage)} message Mensaje o RawMessage en concreto a enviar. 
     * @author HaJuegos - 12-03-2026
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
     */
    public convertTicksToSeconds(ticks: number): number {
        return ticks / mc.TicksPerSecond;
    }
}

export const worldToolsSimplified = new WorldToolsSimplified();