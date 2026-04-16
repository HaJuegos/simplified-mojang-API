import * as vanilla from '@minecraft/vanilla-data';
import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';

import { CatLogHandler } from '../core/errorHandler';
import { CustomFormParams, CustomTimerParam } from '../core/customTypes';

import { beforeEventsSimplified } from './beforeEventsSimplifiedManager';
import { worldToolsSimplified } from './worldToolsSimplifiedManager';
import { afterEventsSimplified } from './afterEventsSimplifiedManager';

/**
 * Clase que contiene todos los metodos de mecanicas universales usadas en sus add-ons.
 * @author HaJuegos - 15-03-2026
 */
class CustomEventsSimplified {
    /**
     * Variable que controla los timers basados en tiempo local por jugador.
     * @type {Map<string, number>}
     * @author HaJuegos - 15-04-2026
     * @private
     */
    private activePlys = new Map<string, number>();

    /**
     * Eventos principales de la clase cuando es llamada o inicializada.
     * @constructor
     */
    constructor () {

    }

    /**
     * Metodo auxiliar que simplifica la logica de la creacion de un formulario UI custom en cuestion.
     * @param {CustomFormParams} formParams Los parametros del formulario en concreto necesarios para crear el formulario.
     * @author HaJuegos - 16-04-2026
     * @public
     * @example
     * ```ts
     * // Esto crea el formulario y luego lo muestra al jugador.
     * const form = customEventsManager.createFormUI({ showPly: player, titleForm: 'Formulario de Prueba' });
     * ```
     */
    public createFormUI(formParams: CustomFormParams): ui.ActionFormData | void {
        const registrationTrace = new Error().stack;

        try {
            const baseForm = new ui.ActionFormData().title(formParams.titleForm);
            const buttonList = formParams.buttonsForm ? (Array.isArray(formParams.buttonsForm) ? formParams.buttonsForm : [formParams.buttonsForm]) : [];

            if (formParams.headerText) {
                baseForm.header(formParams.headerText);
            }

            if (formParams.bodyText) {
                baseForm.body(formParams.bodyText);
            }

            if (formParams.labelText) {
                baseForm.label(formParams.labelText);
            }

            if (formParams.showPly) {
                baseForm.show(formParams.showPly);
            }

            buttonList.forEach((button) => {
                baseForm.button(button.buttomText, button.iconButtomUI);
            });

            return baseForm;
        } catch (e) {
            CatLogHandler.handleError(e, 'createFormUI', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que simplifica la logica de los fast items, cuando usas tu item con tu tecla de interaccion, este cambiara a tu mano secundaria. 
     * @param {(mc.ItemStack[] | string[])} listOfItems La lista de items a validar para este sistema.
     * @author HaJuegos - 15-03-2026
     * @public
     * @example
     * ```ts
     * customEventsManager.fastItemsSystem(['totem']); // Ahora el totem es conciderado un fast item para cambiar a la mano secundaria con un click.
     * ```
     */
    public fastItemsSystem(listOfItems: mc.ItemStack[] | string[]): void {
        beforeEventsSimplified.onUseItem((args) => {
            const ply = args.source;
            const item = args.itemStack;
            const currentSlot = ply.selectedSlotIndex;

            const isItemValid = listOfItems.some((listItem) => {
                if (typeof listItem == "string") {
                    return item.typeId.includes(listItem);
                } else {
                    return item.typeId == listItem.typeId;
                }
            });

            if (isItemValid) {
                args.cancel = true;

                worldToolsSimplified.setRun(() => {
                    const plyInv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container as mc.Container;
                    const plyArmor = ply.getComponent(mc.EntityComponentTypes.Equippable) as mc.EntityEquippableComponent;
                    const itemOffhand = plyArmor.getEquipment(mc.EquipmentSlot.Offhand);

                    if (itemOffhand) {
                        plyArmor.setEquipment(mc.EquipmentSlot.Offhand, item);
                        plyInv.setItem(currentSlot, itemOffhand);
                    } else {
                        plyArmor.setEquipment(mc.EquipmentSlot.Offhand, item);
                        plyInv.setItem(currentSlot, undefined);
                    }

                    ply.playSound('armor.equip_generic');
                });
            }
        });
    };

    /**
     * Metodo auxiliar que simplifica la logica de reducir o dañar items manualmente, esto principalmente se creo para los custom components para la interaccion de items o bloques. Por ej: Para reducir un item a 24 manzanas para pasar a ser 23 manzanas. O dañar un poco un casco de diamante bajando su durabilidad.
     * @param {mc.Player} ply Jugador en cuestion a quien es afectado.
     * @param {mc.ItemStack} item Item en cuestion a eliminar o dañar.
     * @author HaJuegos - 17-03-2026 
     * @public
     * @example
     * ```ts
     * // Esto hara que un item reduzca su stock o sino, sea dañado bajando su durabilidad.
     * customEventsManager.manualDamageItem(player, item);
     * ```
     */
    public manualDamageItem(ply: mc.Player, item: mc.ItemStack): void {
        const registrationTrace = new Error().stack;

        try {
            if (ply.getGameMode() != (mc.GameMode.Adventure || mc.GameMode.Survival)) return;

            const invPly = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container as mc.Container;
            const slot = ply.selectedSlotIndex;
            const newItem = item.clone();

            if (!item.isStackable) {
                const durability = newItem.getComponent(mc.ItemComponentTypes.Durability) as mc.ItemDurabilityComponent;

                durability.damage++;

                if (durability.damage >= durability.maxDurability) {
                    invPly.setItem(slot, undefined);
                    ply.playSound('random.break');
                    return;
                }
            } else {
                if (item.amount <= 1) {
                    invPly.setItem(slot, undefined);
                    return;
                } else {
                    newItem.amount--;
                }
            }

            invPly.setItem(slot, newItem);
        } catch (e) {
            CatLogHandler.handleError(e, 'manualDamageItem', registrationTrace);
        }
    };

    /**
     * Metodo auxiliar que simplifica la logica de detectar en el inventario del jugador, si tiene uno o varios items en concreto de forma explicita o no.
     * @param {mc.Player} plySource Jugador en cuestion.
     * @param {(string | string[] | vanilla.MinecraftItemTypes | vanilla.MinecraftItemTypes[] )} itemsToDetect Item o items a buscar. 
     * @param {boolean?} exactItems (Opcional) Busca explicitamente el nombre del item palabra por palabra. Por defecto esta apagado, entonces buscara items sin importar si tienen diferencias. Por ej: Si se busca 'diamond'; minecraft:diamond y minecraft:diamond_sword serian true.
     * @returns {boolean} Devuelve true en caso de tener ese item, sino, sera false.
     * @author HaJuegos - 18-03-2026
     * @public
     * @example
     * ```ts
     * // Esto es true si el jugador tiene un item llamado totem o mas de forma no explicita.
     * customEventsManager.plyHasItems(player, 'totem');
     * 
     * // Esto es true si el jugador tiene un totem de la inmortalidad de forma explicita.
     * customEventsManager.plyHasItems(player, vanilla.MinecraftItemTypes.TotemOfUndying, true);
     * ```
     */
    public plyHasItems(plySource: mc.Player, itemsToDetect: string | string[] | vanilla.MinecraftItemTypes | vanilla.MinecraftItemTypes[], exactItems: boolean = false): boolean {
        const registrationTrace = new Error().stack;

        try {
            const invPly = plySource.getComponent(mc.EntityComponentTypes.Inventory)?.container as mc.Container;
            const armorPly = plySource.getComponent(mc.EntityComponentTypes.Equippable) as mc.EntityEquippableComponent;
            const targetItems = Array.isArray(itemsToDetect) ? itemsToDetect : [itemsToDetect];

            if (invPly) {
                for (let i = 0; i < invPly.size; i++) {
                    const item = invPly.getItem(i);

                    if (item) {
                        const itemFound = !exactItems ? targetItems.some((target) => item.typeId.includes(target as string)) : targetItems.some((target) => item.typeId == target);

                        if (itemFound) {
                            return true;
                        }
                    }
                }
            }

            if (armorPly) {
                const equipmentSlots = [
                    mc.EquipmentSlot.Head,
                    mc.EquipmentSlot.Chest,
                    mc.EquipmentSlot.Legs,
                    mc.EquipmentSlot.Feet,
                    mc.EquipmentSlot.Offhand
                ];

                for (const slot of equipmentSlots) {
                    const item = armorPly.getEquipment(slot);

                    if (item) {
                        const itemFound = !exactItems ? targetItems.some((target) => item.typeId.includes(target as string)) : targetItems.some((target) => item.typeId == target);

                        if (itemFound) {
                            return true;
                        }
                    }
                }
            }
        } catch (e) {
            CatLogHandler.handleError(e, 'plyHasItems', registrationTrace);
        }

        return false;
    }

    /**
     * Metodo auxiliar que simplifica loa logica al detectar el uso de un totem en un jugaodor, ejecutando los eventos relacionados.
     * @param {(ply: mc.Player) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 19-03-2026
     * @public
     * @example
     * ```ts
     * // Este evento solo se va a ejecutar cuando un jugador usa un totem.
     * customEventsManager.playerUseTotemSystem((args) => {
     *     const ply = args.player;
     *     
     *     console.warn(`${ply.name} ha usado un totem.`);
     * });
     * ```
     */
    public onPlayerUseTotem(callback: (player: mc.Player) => void): void {
        afterEventsSimplified.onHealthEntityChange((args) => {
            const entity = args.entity;
            const newValue = args.newValue;
            const oldValue = args.oldValue;

            if (entity instanceof mc.Player && oldValue <= 0 && newValue >= 1) {
                callback(entity);
            }
        });
    }

    /**
     * Metodo auxiliar que simplifica la logica de randomizar el inventario de un jugador, cambiando totalmente las ubicaciones de los items en el mismo inventario.
     * @param {mc.Player} ply Jugador en cuestion.
     * @author HaJuegos - 30-03-2026
     * @public
     * @example
     * ```ts
     * // Ahora el inventario estara totalmente desordenado. Solo el inventario, no armadura.
     * customEventsManager.randomizeInvPly(player);
     * ```
     */
    public randomizeInvPly(ply: mc.Player): void {
        const registrationTrace = new Error().stack;

        try {
            const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container as mc.Container;
            const validItems: mc.ItemStack[] = [];

            for (let i = 0; i < inv.size; i++) {
                const item = inv.getItem(i);

                if (item) {
                    validItems.push(item);
                    inv.setItem(i, undefined);
                }
            }

            if (validItems.length == 0) return;

            const randomSlots: number[] = Array.from({ length: inv.size }, (_, i) => i);

            for (let i = randomSlots.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));

                [randomSlots[i], randomSlots[j]] = [randomSlots[j], randomSlots[i]];
            }

            for (let i = 0; i < validItems.length; i++) {
                const targetSlot = randomSlots[i];

                inv.setItem(targetSlot, validItems[i]);
            }
        } catch (e) {
            CatLogHandler.handleError(e, 'randomizeInvPly', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que genera un timer basado en tiempo real. Este consiste en minutos iniciales (tambien horas) iniciando el timer guardando los valores en tiempo real en el jugador asignado que va a ver el timer. Devolviendo y ejecutando codigo basado en el timer.
     * @param {CustomTimerParam} paramsTimer Los parametros y eventos a ejecutar mientras el timer se ejecuta.
     * @author HaJuegos - 05-04-2026 
     * @public
     * @example
     * ```ts
     * const paramsTimer: CustomTimerParam = {
     *     sourcePLy: player, // Jugador que tiene el timer
     *     timerID: 'ha:timer_unique', // Identificador unico del timer, por si se usa en mas de una ocasión
     *     initialMns: 2, // Los Minutos iniciales del timer o minutos a mostrar del timer.
     *     forceRestart: true, // (Opcional) Si es necesario en caso de cambio del valor, por ej, nuevos valores de minutos o segundos, pues hace que el timer se reinicie.
     *     
     *     // (Opcional) Eventos relacionales cuando el timer pasa un segundo.
     *     onSecondPass: (ply, timer) => {
     *         console.log(`Ha pasado un segundo, el tiempo ahora esta en ${timer}`);
     *     },
     * };
     * 
     * // Inicia el timer para el jugador en concreto. NOTA: Es un timer interno, no tiene interfaz. Para mostrar el valor del timer, usar los eventos como: onSecondPass.
     * customEventsManager.startTimerLocal(paramsTimer);
     * ```
     */
    public startTimerLocal(paramsTimer: CustomTimerParam): void {
        const registrationTrace = new Error().stack;

        try {
            const { sourcePly, timerId, initialMns, initialHrs, forceRestart, onTimerStarts, onSecondPass, onMinutePass, onHourPass, onTimerEnds } = paramsTimer;

            const mapKey = `${sourcePly.id}_${timerId}`;
            const propKey = timerId;
            let isnewTimer = false;

            if (this.activePlys.has(mapKey)) {
                if (forceRestart) {
                    const oldID = this.activePlys.get(mapKey)!;

                    worldToolsSimplified.stopLoop(oldID);

                    this.activePlys.delete(mapKey);

                    sourcePly.setDynamicProperty(timerId, undefined);
                    isnewTimer = true;
                } else {
                    return;
                }
            }

            const hrsMs = (initialHrs || 0) * 3600000;
            const mnsMs = initialMns * 60000;
            const totalRequestedMs = hrsMs + mnsMs;

            let endTime = sourcePly.getDynamicProperty(propKey) as number | undefined;

            if (endTime == undefined) {
                endTime = Date.now() + totalRequestedMs;
                sourcePly.setDynamicProperty(propKey, endTime);
                isnewTimer = true;
            } else {
                const remainSaved = Math.max(0, endTime - Date.now());
                const savedMinutes = Math.floor(remainSaved / 60000);

                if (Math.abs(savedMinutes - initialMns) >= 1) {
                    endTime = Date.now() + totalRequestedMs;
                    sourcePly.setDynamicProperty(propKey, endTime);
                }
            }

            let lastSecond = -1;
            let lastMinute = -1;
            let lastHour = -1;

            /**
             * Funcion interna auxiliar que formatea el timer para formar el reloj y tambien para ejecutar los eventos relacionados cuando el timer cambia de tiempo. Ya sea minutos, segundos o horas. Por defecto, solo muestra los minutos y segundos, si hay horas en el timer, lo mostrara solo si es necesario. El formato es asi: '00:00:00'.
             * @param {number} remainMs El tiempo pediente para mostrar al jugador.
             * @returns {string} El reloj formateado a mostrar.
             * @author HaJuegos - 05-04-2026
             */
            const formatTime = (remainMs: number) => {
                if (remainMs < 0) remainMs = 0;

                const totalSeconds = Math.floor(remainMs / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                const mStr = minutes.toString().padStart(2, '0');
                const sSrt = seconds.toString().padStart(2, '0');

                let currentTime = `${mStr}:${sSrt}`;

                if ((initialHrs != undefined && initialHrs > 0) || hours > 0) {
                    const hStr = hours.toString().padStart(2, '0');

                    currentTime = `${hStr}:${mStr}:${sSrt}`;
                }

                if (lastSecond != -1) {
                    if (seconds != lastSecond && onSecondPass) {
                        onSecondPass(sourcePly, currentTime);
                    }

                    if (minutes != lastMinute && onMinutePass) {
                        onMinutePass(sourcePly, currentTime);
                    }

                    if (hours != lastHour && onHourPass) {
                        onHourPass(sourcePly, currentTime);
                    }
                }

                lastSecond = seconds;
                lastMinute = minutes;
                lastHour = hours;

                return currentTime;
            };

            const initialRemaining = endTime - Date.now();
            const initialFormat = formatTime(initialRemaining);

            if (isnewTimer && onTimerStarts) {
                onTimerStarts(sourcePly);
            }

            if (onSecondPass) {
                onSecondPass(sourcePly, initialFormat);
            };

            const loopId = worldToolsSimplified.setLoop(() => {
                if (!sourcePly.isValid) {
                    worldToolsSimplified.stopLoop(loopId);

                    this.activePlys.delete(mapKey);

                    return;
                }

                const currentRemaing = endTime! - Date.now();

                if (currentRemaing <= 0) {
                    sourcePly.setDynamicProperty(propKey, undefined);

                    this.activePlys.delete(mapKey);

                    worldToolsSimplified.stopLoop(loopId);

                    if (onTimerEnds) {
                        onTimerEnds(sourcePly);
                    };
                } else {
                    formatTime(currentRemaing);
                }
            }, worldToolsSimplified.convertSecondsToTicks(1));

            this.activePlys.set(mapKey, loopId);
        } catch (e) {
            CatLogHandler.handleError(e, 'customStartTimerLocal', registrationTrace);
        }
    }
}

export const customEventsManager = new CustomEventsSimplified();