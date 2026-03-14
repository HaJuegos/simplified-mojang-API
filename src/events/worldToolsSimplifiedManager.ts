import * as mc from "@minecraft/server";
import { BaseEventManager } from "../core/eventsManager";

/**
 * Clase principal que otorga simplificaciones de las llamadas de world y sus utilidades de sus llamadas y/o variables.
 * @class WorldToolsSimplified
 * @author HaJuegos - 12-03-2026
 */
class WorldToolsSimplified {
    private scriptEventManager: BaseEventManager<mc.ScriptEventCommandMessageAfterEvent>;

    /**
     * Eventos que se inicializan cuando la clase es llamada o inicializada.
     * @constructor
     */
    constructor () {
        this.scriptEventManager = new BaseEventManager<mc.ScriptEventCommandMessageAfterEvent>(mc.system.afterEvents.scriptEventReceive, 'ScriptEventSensor');
    }

    /**
     * Metodo auxiliar que establece una serie de eventos con un pequeño retraso determinado. Luego de terminar el retraso, elimina la tarea para no dejarlo en memoria.
     * @param {() => void} callback Los eventos en cuestion a ejecutar.
     * @param {number} ticksDelay Los tiempos en ticks que se tardara para ejecutarse.
     * @returns {Promise<void>} 
     * @author HaJuegos - 13-03-2026
     * @async Es un metodo asincrono, debido a que se limpia despues de la ejecucion.
     * @public
     * @systemEvent Metodo que usa los eventos del modulo "system" herramientas auxiliares fuera de los eventos sensores de "world".
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
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
     * @public
     * @systemEvent Metodo que usa los eventos del modulo "system" herramientas auxiliares fuera de los eventos sensores de "world".
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
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
     * @public
     * @systemEvent Metodo que usa los eventos del modulo "system" herramientas auxiliares fuera de los eventos sensores de "world".
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
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
     * Metodo auxiliar que maneja la logica de los eventos cuando se ejecuta el comando scriptevent.
     * @param {((args: mc.ScriptEventCommandMessageAfterEvent) => void)} callback La logica del evento en concreto.
     * @author HaJuegos - 14-03-2026
     * @public
     * @systemEvent Metodo que usa los eventos del modulo "system" herramientas auxiliares fuera de los eventos sensores de "world".
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * worldToolsSimplified.listenerScriptEvents((args) => {
     *   console.warn(`Se ha ejecutado el comando /scriptevent con el ID ${args.id}`)
     * });
     * ```
     */
    public listenerScriptEvents(callback: ((args: mc.ScriptEventCommandMessageAfterEvent) => void)): void {
        this.scriptEventManager.register(callback);
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

    /**
     * Metodo auxiliar que convierte un color hexadecimal a RGB.
     * @param {string} hexcolor El color hexadecimal (ej. "#00000F").
     * @returns {mc.RGB} El objeto RGB correspondiente.
     * @author HaJuegos - 14-03-2026
     * @public
     * @example
     * ```ts
     * const rgb = worldToolsSimplified.convertHexToRGB("#FF0000"); // { red: 255, green: 0, blue: 0 }
     * ```
     */
    public convertHexToRGB(hexcolor: string): mc.RGB {
        const hex = hexcolor.replace('#', '');

        if (hex.length != 6) {
            throw new Error('El color hexadecimal no debe ser mas de 6 digitos');
        }

        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        return { red: r, green: g, blue: b };
    }

    /**
     * Metodo auxiliar que convierte un color hexadecimal a RGBA.
     * @param {string} hexcolor El color hexadecimal (ej. "#00000FFF" para 8 dígitos, o "#00000F" asumiendo a=255).
     * @returns {mc.RGBA} El objeto RGBA correspondiente.
     * @author HaJuegos - 14-03-2026
     * @public
     * @example
     * ```ts
     * const rgba = worldToolsSimplified.convertHexToRGBA("#FF0000FF"); // { red: 255, green: 0, blue: 0, alpha: 255 }
     * const rgba2 = worldToolsSimplified.convertHexToRGBA("#FF0000"); // { red: 255, green: 0, blue: 0, alpha: 255 }
     * ```
     */
    public convertHexToRGBA(hexcolor: string): mc.RGBA {
        const hex = hexcolor.replace('#', '');
        let r: number, g: number, b: number, a: number;

        if (hex.length == 6) {
            r = parseInt(hex.substr(0, 2), 16);
            g = parseInt(hex.substr(2, 2), 16);
            b = parseInt(hex.substr(4, 2), 16);
            a = 255;
        } else if (hex.length == 8) {
            r = parseInt(hex.substr(0, 2), 16);
            g = parseInt(hex.substr(2, 2), 16);
            b = parseInt(hex.substr(4, 2), 16);
            a = parseInt(hex.substr(6, 2), 16);
        } else {
            throw new Error('El color hexadecimal alpha debe ser 6 o 8 digitos');
        }

        return { red: r, green: g, blue: b, alpha: a };
    }
}

export const worldToolsSimplified = new WorldToolsSimplified();