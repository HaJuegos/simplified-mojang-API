import * as mc from "@minecraft/server";

import { BaseEventManager } from "../core/eventsManager";
import { CatLogHandler } from "../core/errorHandler";
import { CustomFloatingTextParams } from "../core/customTypes";

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
     * @param {mc.Entity | mc.Player | string} targetEntity Target en concreto a obtener su score.
     * @param {string} idObj ID del objectivo el concreto a obtener el score.
     * @param {?string} [nameDisplayObj] (Opcional) Nombre del objectivo en caso de que el mismo no este creado, a asignar.
     * @returns {number} Devuelve el score total que tiene el jugador si todo esta bien, sino siempre sera 0.
     * @author HaJuegos - 31-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * // Esto crea el objective en caso de no estar creado y luego, obtiene el score que tiene el jugador, en este caso seria 0.
     * const score = worldToolsSimplified.getPlyScoreInObj(ply, 'conteo', 'Conteo');
     * ```
     */
    public getScoreInObj(targetEntity: mc.Player | mc.Entity | string, idObj: string, nameDisplayObj?: string): number {
        const registrationTrace = new Error().stack;

        try {
            const scoreboard = mc.world.scoreboard;
            let obj = scoreboard.getObjective(idObj);

            if (!obj) {
                obj = scoreboard.addObjective(idObj, nameDisplayObj);
            }

            if (!obj.hasParticipant(targetEntity)) {
                return 0;
            }

            const score = obj.getScore(targetEntity) ?? 0;

            return score;
        } catch (e) {
            CatLogHandler.handleError(e, 'getPlyScore', registrationTrace);
            return 0;
        }
    }

    /**
     * Metodo auxiliar que modifica el score de un jugador en concreto en un ojectivo. En caso de que no este creado el objectivo, se creara automaticamente. De forma simplificada.
     * @param {mc.Entity | mc.Player | string} targetEntity Target en concreto a modificar.
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
    public changeScoreInObj(targetEntity: mc.Player | mc.Entity | string, idObj: string, changeMode: 'set' | 'add', newScore: number, nameDisplayObj?: string): number | undefined {
        const registrationTrace = new Error().stack;

        try {
            const scoreboard = mc.world.scoreboard;
            let obj = scoreboard.getObjective(idObj);

            if (!obj) {
                obj = scoreboard.addObjective(idObj, nameDisplayObj);
            }

            if (changeMode == 'set') {
                obj.setScore(targetEntity, newScore);
            } else {
                obj.addScore(targetEntity, newScore);
            }

            return obj.getScore(targetEntity) ?? 0;
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

    /**
     * Metodo auxiliar que obtiene los datos de una propiedad dinamica en concreto guardado en el mundo.
     * @param {string} idProperty ID de la propiedad en concreto.
     * @returns {(string | number | boolean | mc.Vector3 | undefined)} Los datos guardados en la propiedad, en caso de no estar creada, sera undefined.
     * @remarks Este valor depende del UUID de tu add-on. Es decir, si hay dos add-ons en el mundo y los dos deciden guardar la misma propiedad, sera diferente en ambos. Por ej: Add-on1 guarda la propiedad y Add-on2 lo consulta, sera undefined pq solo existe en el Add-on1.
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.getWorldDynamicProperty('ha:property'); // "string" | undefined.
     * ```
     */
    public getWorldDynamicProperty(idProperty: string): string | number | boolean | mc.Vector3 | undefined {
        return mc.world.getDynamicProperty(idProperty);
    }

    /**
     * Metodo auxiliar que obtiene todos los IDs de propiedades dinamicas guardadas en el mundo.
     * @returns {string[]} El array de todos los IDs registrados, en caso de no haber ninguno, estara vacio.
     * @remarks Este valor depende del UUID de tu add-on. Es decir, si hay dos add-ons en el mundo y los dos deciden guardar la misma propiedad, sera diferente en ambos. Por ej: Add-on1 guarda la propiedad y Add-on2 lo consulta, sera undefined pq solo existe en el Add-on1.
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.getAllWorldDynamicPropertiesIDs(); // ['ha:test','ha:test2','ha:test3'].
     * ```
     */
    public getAllWorldDynamicPropertiesIDs(): string[] {
        return mc.world.getDynamicPropertyIds();
    }

    /**
     * Metodo auxiliar que obtiene los datos de una propiedad dinamica guardada en una entidad en concreto.
     * @param {(mc.Entity | mc.Player)} targetEntity Entidad en cuestion a consultar.
     * @param {string} idProperty ID en cuestion de la propiedad a consultar.
     * @returns {(string | number | boolean | mc.Vector3 | undefined)} Devuelve el tipo de dato guardado en la propiedad, en caso de no existir, sera undefined.
     * @remarks Este valor depende del UUID de tu add-on. Es decir, si hay dos add-ons en el mundo y los dos deciden guardar la misma propiedad, sera diferente en ambos. Por ej: Add-on1 guarda la propiedad y Add-on2 lo consulta, sera undefined pq solo existe en el Add-on1.
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.getEntityDynamicProperty(entity, 'ha:test'); // "string" | undefined.
     * ```
     */
    public getEntityDynamicProperty(targetEntity: mc.Entity | mc.Player, idProperty: string): string | number | boolean | mc.Vector3 | undefined {
        return targetEntity.getDynamicProperty(idProperty);
    };

    /**
     * Metodo auxiliar que obtiene todos los IDs de propiedades dinamicas en una entidad en concreto.
     * @param {(mc.Entity | mc.Player)} targetEntity Entidad en concreto a consultar.
     * @returns {string[]} Devuelve un Array con todos los IDs, en caso de no haber ninguno, sera vacio.
     * @remarks Este valor depende del UUID de tu add-on. Es decir, si hay dos add-ons en el mundo y los dos deciden guardar la misma propiedad, sera diferente en ambos. Por ej: Add-on1 guarda la propiedad y Add-on2 lo consulta, sera undefined pq solo existe en el Add-on1.
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.getEntityDynamicPropertiesIDs(entity); // ['ha:test1','ha:test2','ha:test3']
     * ```
     */
    public getEntityDynamicPropertiesIDs(targetEntity: mc.Entity | mc.Player): string[] {
        return targetEntity.getDynamicPropertyIds();
    };

    /**
     * Metodo auxiliar que activa globalmente musica para todos los jugadores.
     * @param {string} idMusic ID de la musica a reproducir.
     * @param {?mc.MusicOptions} [options] (Opcional) Las condiciones para hacer sonar la musica.
     * @returns {void}
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.startGlobalMusic('music.pigstep');
     * ```
     */
    public startGlobalMusic(idMusic: string, options?: mc.MusicOptions): void {
        const registrationTrace = new Error().stack;

        try {
            mc.world.playMusic(idMusic, options);
        } catch (e) {
            CatLogHandler.handleError(e, 'startGlobalMusic', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que detiene la musica global del mundo.
     * @returns {void}
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * worldToolsSimplified.stopGlobalMusic();
     * ```
     */
    public stopGlobalMusic(): void {
        const registrationTrace = new Error().stack;

        try {
            mc.world.stopMusic();
        } catch (e) {
            CatLogHandler.handleError(e, 'stopGlobalMusic', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que obtiene o crea un area persistente en el mundo. Un /tickingarea, basado en las configuraciones de la misma, este es asincrono debido a que debe esperar la carga de chunks requeridas y los calculos que hace el juego para crear el radio. 
     * @param {string} idArea ID del area a crear o obtener.
     * @param {mc.TickingAreaOptions} options Parametros para la creacion del area en caso de no existir.
     * @returns {Promise<mc.TickingArea | undefined>} Si todo sale bien, devuelve el area correctamente en caso de modificarlo, sino, sera undefined.
     * @author HaJuegos - 18-07-2026
     * @public
     * @async
     * @example
     * ```ts
     * // Esto crea una area persistente en el mundo y si todo sale bien, devuelve el tipo para modificarlo. En caso de ya existsir, pues no se crea.
     * worldToolsSimplified.getOrCreateTickingArea('ha:area_persistente', {
     *     dimension: Dimension,
     *     to: { x: 0, y: 0, z: 0 },
     *     from: { x: 0, y: 10, z: -10 }
     * });
     * ```
     */
    public async getOrCreateTickingArea(idArea: string, options: mc.TickingAreaOptions): Promise<mc.TickingArea | undefined> {
        const registrationTrace = new Error().stack;

        try {
            let area = mc.world.tickingAreaManager.getTickingArea(idArea);

            if (!area) {
                await mc.world.tickingAreaManager.createTickingArea(idArea, options);

                area = mc.world.tickingAreaManager.getTickingArea(idArea);
            }

            return area as mc.TickingArea;
        } catch (e) {
            CatLogHandler.handleError(e, 'getOrCreateTickingArea', registrationTrace);
            return;
        }
    }

    /**
     * Metodo auxiliar que elimina un area persistente del mundo creado previamente.
     * @param {(string | mc.TickingArea)} idArea Area en concreto a eliminar o tambien su ID.
     * @returns {void}
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * // Esto elimina dicha area, si existe, sino, pues no hace nada.
     * worldToolsSimplified.deletedTickingArea('ha:area_persistente');
     * ```
     */
    public deletedTickingArea(idArea: string | mc.TickingArea): void {
        const registrationTrace = new Error().stack;

        try {
            mc.world.tickingAreaManager.removeTickingArea(idArea);
        } catch (e) {
            CatLogHandler.handleError(e, 'deletedTickingArea', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que permite la creacion de textos flotantes custom en el mundo, con mucha personalizacion.
     * @param {CustomFloatingTextParams} params Todos los parametros requeridos para la creacion de un texto flotante.
     * @returns {mc.TextPrimitive} Si todo sale bien, devuelve el mismo texto flotante previamente creado para su modificacion.
     * @author HaJuegos - 18-07-2026
     * @public
     * @example
     * ```ts
     * // Esto crea un texto flotante llamado "Hola soy un texto".
     * const floatText = worldToolsSimplified.setAndGetFloatingText({
     *     text: { rawtext: [{ text: 'Hola soy un texto' }] },
     *     dimension: Dimension,
     *     alwaysVisible: true,  // Siempre sera visible para todos a través de bloques.
     *     location: { x: 0, y: 0, z: 0 },
     *     rotation: { x: 0, y: 0, z: 0 },
     *     duration: 1000,
     *     scale: 1
     * });
     * ```
     */
    public setAndGetFloatingText(params: CustomFloatingTextParams): mc.TextPrimitive | undefined {
        const registrationTrace = new Error().stack;

        try {
            const floatTxt = new mc.TextPrimitive(params.location, params.text);

            floatTxt.depthTest = !params.alwaysVisible;

            if (params.attachedTo) {
                floatTxt.attachedTo = params.attachedTo;
            }

            if (params.scale != undefined) {
                floatTxt.scale = params.scale;
            }

            if (params.duration != undefined) {
                floatTxt.timeLeft = params.duration;
            }

            if (params.rotation) {
                floatTxt.rotation = params.rotation;
                floatTxt.useRotation = true;
            }

            if (params.toPlys) {
                floatTxt.visibleTo = Array.isArray(params.toPlys) ? params.toPlys : [params.toPlys];
            }

            if (params.color) {
                const finalColor = (typeof params.color == 'string') ? worldToolsSimplified.convertHexToRGBA('finalColor') : params.color;

                floatTxt.color = finalColor;
            }

            if (params.backGroundColor) {
                const finalColor = (typeof params.backGroundColor == 'string') ? worldToolsSimplified.convertHexToRGBA('finalColor') : params.backGroundColor;

                floatTxt.backgroundColorOverride = finalColor;
            }

            mc.world.primitiveShapesManager.addText(floatTxt, params.dimension);

            return floatTxt;
        } catch (e) {
            CatLogHandler.handleError(e, 'setAndGetFloatingText', registrationTrace);
            return;
        }
    }
}

export const worldToolsSimplified = new WorldToolsSimplified();