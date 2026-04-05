import * as mc from "@minecraft/server";

import { BaseEventManager } from "../core/eventsManager";
import { CatLogHandler } from "../core/errorHandler";

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
     * Metodo auxiliar que programa la ejecucion de una logica para el siguiente tick del juego. Ideal principalmente para los eventos before para saltarse la ejecucion restringida.
     * @param {() => void} callback Los eventos o logica en cuestion a ejecutar. 
     * @returns {Promise<void>} 
     * @author HaJuegos - 15-03-2026
     * @async Es un metodo asincrono, principalmente para terminar el flujo despeus de que ocurra los eventos.
     * @public
     * @systemEvent Metodo que usa los eventos del modulo "system" herramientas auxiliares fuera de los eventos sensores de "world".
     * @example
     * ```ts
     * beforeEventsSimplified.onUseItem((args) => {
     *    const ply = args.source;
     *    const item = args.itemStack;
     *    const plyArmor = ply.getComponent(EntityComponentTypes.Equippable)
     * 
     *    worldToolsSimplified.setRun(() => {
     *        // Esto ya funciona porque pasa despues de un tick y no hay restrinciones.
     *        plyArmor.setEquipment(EquipmentSlot.Offhand, item);
     *    });
     * });
     * ```
     */
    public async setRun(callback: () => void): Promise<void> {
        return new Promise<void>((resolve) => {
            const registrationTrace = new Error().stack;

            const currentRun = mc.system.run(() => {
                try {
                    callback();

                    mc.system.clearRun(currentRun);

                    resolve();
                } catch (e) {
                    CatLogHandler.handleError(e, 'WorldsetRun', registrationTrace);
                    resolve();
                }
            });
        });
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
            const registrationTrace = new Error().stack;

            const currentJob = mc.system.runTimeout(() => {
                try {
                    callback();

                    mc.system.clearRun(currentJob);

                    resolve();
                } catch (e) {

                    CatLogHandler.handleError(e, 'worldSetDelay', registrationTrace);
                    resolve();
                }
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
        const registrationTrace = new Error().stack;

        return mc.system.runInterval(() => {
            try {
                callback();
            } catch (e) {
                CatLogHandler.handleError(e, 'worldSetLoop', registrationTrace);
            }
        }, loopTicks);
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
     * @param {string | mc.RawMessage | (string | mc.RawMessage)[]} message Mensaje o RawMessage en concreto a enviar. 
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
    public sendMessageGlobal(message: string | mc.RawMessage | (string | mc.RawMessage)[]): void {
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
     * Metodo auxiliar que obtiene un objective de scoreboard, en caso de no encontrarlo, pues lo crea. Para devolver el mismo objectivo de forma simplificada.
     * @param {string} idObj ID del objectivo a encontrar o crear en cuestion.
     * @param {?string} [nameDisplayObj] (Opcional) Nombre del objectivo a colocar cuando se cree.
     * @returns {(mc.ScoreboardObjective | undefined)} Devuelve el objectivo si todo salio correcto, sino sera un error. 
     * @author HaJuegos - 31-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * // Esto obtiene y crea el objectivo en caso de no estar creado.
     * const obj = worldToolsSimplified.getOrCreateScorebordObj('conteo', 'Conteo');
     * ```
     */
    public getOrCreateScorebordObj(idObj: string, nameDisplayObj?: string): mc.ScoreboardObjective | undefined {
        const registrationTrace = new Error().stack;

        try {
            const scoreboard = mc.world.scoreboard;
            let obj = scoreboard.getObjective(idObj);

            if (!obj) {
                obj = scoreboard.addObjective(idObj, nameDisplayObj);
            }

            return obj;
        } catch (e) {
            CatLogHandler.handleError(e, 'getOrCreateObj', registrationTrace);
            return;
        }
    }

    /**
     * Metodo auxiliar que obtiene el score de un jugador en concreto de un objective de scoreboard. En caso de que el objective no este creado, se creara. De forma simplificada.
     * @param {mc.Player} targetPly Jugador en concreto a obtener su score.
     * @param {string} idObj ID del objectivo el concreto a obtener el score.
     * @param {?string} [nameDisplayObj] (Opcional) Nombre del objectivo en caso de que el mismo no este creado, a asignar.
     * @returns {(number | undefined)} Devuelve el score total que tiene el jugador si todo esta bien, sino sera un error.
     * @author HaJuegos - 31-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * // Esto crea el objective en caso de no estar creado y luego, obtiene el score que tiene el jugador, en este caso seria 0.
     * const score = worldToolsSimplified.getPlyScoreInObj(ply, 'conteo', 'Conteo');
     * ```
     */
    public getPlyScoreInObj(targetPly: mc.Player, idObj: string, nameDisplayObj?: string): number | undefined {
        const registrationTrace = new Error().stack;

        try {
            const scoreboard = mc.world.scoreboard;
            let obj = scoreboard.getObjective(idObj);

            if (!obj) {
                obj = scoreboard.addObjective(idObj, nameDisplayObj);
            }

            const score = obj.getScore(targetPly) ?? 0;

            return score;
        } catch (e) {
            CatLogHandler.handleError(e, 'getPlyScore', registrationTrace);
            return;
        }
    }

    /**
     * Metodo auxiliar que modifica el score de un jugador en concreto en un ojectivo. En caso de que no este creado el objectivo, se creara automaticamente. De forma simplificada.
     * @param {mc.Player} targetPly Jugador en concreto a modificar.
     * @param {string} idObj ID del objectivo en concreto.
     * @param {('set' | 'add')} changeMode Metodo especifico a modificar del jugador. En caso de set, es que seria un valor no acumulable. Por ej: si antes tenia uno y se establece 2, pues sera 2 sin mas; Caso contrario con add, que es acumulativo y sirve formulas negativas. Por ej: Misma situacion, donde tienes 1 y adicionas 1 mas, pues dara 2.
     * @param {number} newScore El nuevo valor a añadir o cambiar.
     * @param {?string} [nameDisplayObj] (Opcional) Nombre del objectivo en caso de no estar creado.
     * @returns {(number | undefined)} El nuevo score cambiado del jugador si todo sale correcto, sino sera un error.
     * @author HaJuegos - 31-03-2026
     * @public
     * @example
     * ```ts
     * // Este metodo realizara lo siguiente: En caso de que conteo no exista como objectivo, lo crea, luego, establece al jugador en concreto 1 en el objectivo y por ultimo, devuelve dicho valor modificado.
     * const newScore = worldToolsSimplified.changePlyScoreInObj(player, 'conteo', 'set', 1, 'Conteo');
     * ```
     */
    public changePlyScoreInObj(targetPly: mc.Player, idObj: string, changeMode: 'set' | 'add', newScore: number, nameDisplayObj?: string): number | undefined {
        const registrationTrace = new Error().stack;

        try {
            const scoreboard = mc.world.scoreboard;
            let obj = scoreboard.getObjective(idObj);

            if (!obj) {
                obj = scoreboard.addObjective(idObj, nameDisplayObj);
            }

            if (changeMode == 'set') {
                obj.setScore(targetPly, newScore);
            } else {
                obj.addScore(targetPly, newScore);
            }

            return obj.getScore(targetPly) ?? 0;
        } catch (e) {
            CatLogHandler.handleError(e, 'changePlyScore', registrationTrace);
            return;
        }
    };

    /**
     * Metodo auxiliar que muestra un objective creado en concreto, en caso de no estar creado, lo hara; A una zona de la pantalla, ya sea como sidebar o list de forma simplificada. 
     * @param {string} idObj ID del objective en cuestion a obtener o crear.
     * @param {mc.DisplaySlotId} displaySlot Slot donde se establecera el objectivo. 
     * @param {?string} [nameDisplayObj] (Opcional) Nombre del objectivo que tendra en caso de que no este creado.
     * @param {?mc.ObjectiveSortOrder} [order] (Opcional) Orden del mismo objectivo.
     * @author HaJuegos - 31-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * // Esto mostrara a conteo en el sidebar de la pantalla de orden desendente. En caso de no estar creado, lo crea primero.
     * worldToolsSimplified.setObjInDisplay('conteo', mc.DisplaySlotId.Sidebar, 'Conteo', mc.ObjectiveSortOrder.Descending);
     * ```
     */
    public setObjInDisplay(idObj: string, displaySlot: mc.DisplaySlotId, nameDisplayObj?: string, order?: mc.ObjectiveSortOrder): void {
        const registrationTrace = new Error().stack;

        try {
            const scoreboard = mc.world.scoreboard;
            let obj = scoreboard.getObjective(idObj);

            if (!obj) {
                obj = scoreboard.addObjective(idObj, nameDisplayObj);
            }

            scoreboard.setObjectiveAtDisplaySlot(displaySlot, { objective: obj, sortOrder: order });
        } catch (e) {
            CatLogHandler.handleError(e, 'setObjInDisplay', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que limpia los objectives asignados a una parte de la pantallas de forma simplificada.
     * @param {mc.DisplaySlotId} displaySlot El slot a limpiar en cuesiton.
     * @author HaJuegos - 31-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * // Se quita al objective que se mostraba en sidebar.
     * worldToolsSimplified.removeDisplaySlot(mc.DisplaySlotId.Sidebar);
     * ```
     */
    public removeDisplaySlot(displaySlot: mc.DisplaySlotId): void {
        const registrationTrace = new Error().stack;

        try {
            const scoreboard = mc.world.scoreboard;

            scoreboard.clearObjectiveAtDisplaySlot(displaySlot);
        } catch (e) {
            CatLogHandler.handleError(e, 'removeDisplayObj', registrationTrace);
        }
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