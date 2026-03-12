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