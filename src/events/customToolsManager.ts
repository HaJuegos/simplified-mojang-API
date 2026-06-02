import * as vanilla from '@minecraft/vanilla-data';
import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';

import { CustomFormParams, CustomTimerParam, LockItemsInvParams, ManualDamageItemParams } from '../core/customTypes';
import { CatLogHandler } from '../core/errorHandler';

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
    constructor () { }

    /**
     * Metodo auxiliar que simplifica la logica de la creacion de un formulario UI custom en cuestion.
     * @param {CustomFormParams} formParams Los parametros del formulario en concreto necesarios para crear el formulario.
     * @returns {Promise<ui.ActionFormData | void>} Se devuelve el mismo formulario creado en caso de que todo este bien.
     * @author HaJuegos - 16-04-2026
     * @async Este metodo es asincrono debido a las acciones que puede realizar el usuario cuando se muestre o no el formulario. Principalmente para los eventos.
     * @public
     * @example
     * ```ts
     * // Esto crea el formulario y luego lo muestra al jugador. Y al momento de abrir el formulario en el jugador, se manda un log.
     * const form = this.createCustomClassicFormUI(
     *      {
     *          titleForm: 'Formulario de Prueba',
     *          showPly: {
     *              targetPly: player,
     *              onShow: (ply) => {
     *                  console.log(`${ply.name} abrio el formulario.`);
     *              }
     *          }
     *      }
     *  );
     * ```
     */
    public async createCustomClassicFormUI(formParams: CustomFormParams): Promise<ui.ActionFormData | void> {
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

            buttonList.forEach((button) => {
                baseForm.button(button.buttomText, button.iconButtomUI);
            });

            if (formParams.showPly) {
                const targetInfo = formParams.showPly;
                const ply = targetInfo.targetPly;

                if (targetInfo.onCreate) {
                    targetInfo.onCreate(ply);
                }

                try {
                    const action = await baseForm.show(ply);

                    if (action.canceled) {
                        if (targetInfo.onClose) {
                            targetInfo.onClose(ply, action.cancelationReason as ui.FormCancelationReason);
                        }
                    } else {
                        if (targetInfo.onClickBtn && action.selection != undefined) {
                            targetInfo.onClickBtn(ply, action.selection);
                        }
                    }
                } catch (e) {
                    if (targetInfo.onErrForm) {
                        targetInfo.onErrForm(ply, ui.FormCancelationReason.UserBusy);
                    }
                }
            }

            return baseForm;
        } catch (e) {
            CatLogHandler.handleError(e, 'createCustomClassicFormUI', registrationTrace);
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
     * Metodo auxiliar que simplifica la logica de dañar un item o reducir un stack de items en un inventario de un jugador en concreto, dependiendo el caso.
     * @param {ManualDamageItemParams} params Los parametros necesarios para este metodo.
     * @author HaJuegos - 17-03-2026 
     * @public
     * @example
     * ```ts
     * // Esto hara que un item en la mano reduzca su stock o sea dañado bajando su durabilidad. Dependiendo el tipo de item.
     * customEventsManager.manualDamageItem({ ply: player, item: item });
     * ```
     */
    public manualDamageItem(params: ManualDamageItemParams): void {
        const registrationTrace = new Error().stack;

        try {
            const {
                ply,
                item,
                specificInv = 'inv',
                specificAmount = 1,
                specificDamageDurability = 1,
                specificSlot = ply.selectedSlotIndex
            } = params;

            const actualGm = ply.getGameMode();

            if (actualGm != mc.GameMode.Adventure && actualGm != mc.GameMode.Survival) return;

            const newItem = item.clone();
            let broke = false;

            if (!item.isStackable) {
                const durability = newItem.getComponent(mc.ItemComponentTypes.Durability);

                if (durability) {
                    const finalDurability = durability.damage + specificDamageDurability;

                    if (finalDurability >= durability.maxDurability) {
                        broke = true;

                        ply.playSound('random.break');
                    } else {
                        durability.damage = finalDurability;
                    }
                }
            } else {
                if (newItem.amount <= specificAmount) {
                    broke = true;
                } else {
                    newItem.amount -= specificAmount;
                }
            }

            if (specificInv == 'armor') {
                const armorInv = ply.getComponent(mc.EntityComponentTypes.Equippable) as mc.EntityEquippableComponent;

                armorInv.setEquipment(specificSlot as mc.EquipmentSlot, broke ? undefined : newItem);
            } else {
                const plyInv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container as mc.Container;

                plyInv.setItem(specificSlot as number, broke ? undefined : newItem);
            }
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
     * Metodo auxiliar que simplifica la logica al detectar el uso de un totem, ejecutando los eventos relacionados.
     * @param {(entity: mc.Entity | mc.Player) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 19-03-2026
     * @public
     * @example
     * ```ts
     * // Este evento solo se va a ejecutar cuando una entidad o jugador usa un totem.
     * customEventsManager.onEntityUseTotem((entity) => { 
     *     console.warn(`${entity.typeId} ha usado un totem.`);
     *     console.warn(`${entity.name} ha usado un totem.`);
     * });
     * ```
     */
    public onEntityUseTotem(callback: (entity: mc.Entity | mc.Player) => void): void {
        afterEventsSimplified.onHealthEntityChange((args) => {
            const entity = args.entity;
            const newValue = args.newValue;
            const oldValue = args.oldValue;

            if (oldValue <= 0 && newValue >= 1) {
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

    /**
     * Metodo auxiliar que fuerza la eliminacion y dropeo de un item en concreto de un slot del inventario de un jugador.
     * @param {mc.Player} ply Jugador en concreto a conciderar.
     * @param {(number | number[])} slots El o los slots en concreto a cambiar eliminar.
     * @param {?mc.ItemStack} itemToRemplace (Opcional) Un item a poner en su lugar al item a dropear o eliminar.
     * @param {?(string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[])} whitelistItems (Opcional) Lista de items que no se pueden dropear o eliminar en este sistema.
     * @returns {void}
     * @author HaJuegos - 18-05-2026
     * @public
     * @example
     * ```ts
     * // Cuando este evento se ejecute, los items de los slots "0,1,2,3" seran dropeados y eliminados del jugador. (Si hay items en esos slots)
     * customEventsManager.dropItemsPly(ply, [0,1,2,3]);
     * ```
     */
    public dropItemsPly(ply: mc.Player, slots: number | number[], itemToRemplace?: mc.ItemStack, whitelistItems?: string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[]): void {
        const registrationTrace = new Error().stack;

        try {
            const coords = ply.location;
            const dime = ply.dimension;
            const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container as mc.Container;
            const finalSlots = Array.isArray(slots) ? slots : [slots];

            for (const slot of finalSlots) {
                const item = inv.getItem(slot);
                let whitelisted = false;

                if (item && whitelistItems) {
                    whitelisted = whitelistItems.some(wItem => {
                        const id = typeof wItem == 'string' ? wItem : wItem.typeId;

                        return id == item.typeId;
                    });
                }

                if (whitelisted) continue;

                if (item) {
                    const spawnCoords = { x: coords.x, y: coords.y + 1, z: coords.z };
                    const itemEntity = dime.spawnItem(item, spawnCoords);
                    const force = 0.5;
                    const randomX = (Math.random() - 0.5) * force;
                    const randomZ = (Math.random() - 0.5) * force;

                    itemEntity.applyImpulse({ x: randomX, y: force, z: randomZ });
                }

                if (itemToRemplace) {
                    inv.setItem(slot, itemToRemplace);
                } else if (item) {
                    inv.setItem(slot, undefined);
                }
            }
        } catch (e) {
            CatLogHandler.handleError(e, 'dropItemsPly', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que fuerza la eliminacion y dropeo de un item en concreto de un slot del equipamento de un jugador.
     * @param {mc.Player} ply Jugador en concreto a conciderar.
     * @param {(mc.EquipmentSlot | mc.EquipmentSlot[])} slots El o los slots en concreto a cambiar eliminar.
     * @param {?mc.ItemStack} itemToRemplace (Opcional) Un item a poner en su lugar al item a dropear o eliminar.
     * @param {?(string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[])} whitelistItems (Opcional) Lista de items que no se pueden dropear o eliminar en este sistema.
     * @returns {void}
     * @author HaJuegos - 18-05-2026
     * @public
     * @example
     * ```ts
     * // Cuando este evento se ejecute, los items de los slots "Helmet, Chestplate y Leggings" seran dropeados y eliminados del jugador. (Si hay items en esos slots)
     * customEventsManager.dropArmorsPly(ply, [mc.EquipmentSlot.Head, mc.EquipmentSlot.Chest, mc.EquipmentSlot.Legs]);
     * ```
     */
    public dropArmorsPly(ply: mc.Player, slots: mc.EquipmentSlot | mc.EquipmentSlot[], itemToRemplace?: mc.ItemStack, whitelistItems?: string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[]): void {
        const registrationTrace = new Error().stack;

        try {
            const coords = ply.location;
            const dime = ply.dimension;
            const armorInv = ply.getComponent(mc.EntityComponentTypes.Equippable) as mc.EntityEquippableComponent;
            const finalSlots = Array.isArray(slots) ? slots : [slots];

            for (const slot of finalSlots) {
                const item = armorInv.getEquipment(slot);
                let whitelisted = false;

                if (item && whitelistItems) {
                    whitelisted = whitelistItems.some(wItem => {
                        const id = typeof wItem == 'string' ? wItem : wItem.typeId;

                        return id == item.typeId;
                    });
                }

                if (whitelisted) continue;

                if (item) {
                    const spawnCoords = { x: coords.x, y: coords.y + 1, z: coords.z };
                    const itemEntity = dime.spawnItem(item, spawnCoords);
                    const force = 0.5;
                    const randomX = (Math.random() - 0.5) * force;
                    const randomZ = (Math.random() - 0.5) * force;

                    itemEntity.applyImpulse({ x: randomX, y: force, z: randomZ });
                }

                if (itemToRemplace) {
                    armorInv.setEquipment(slot, itemToRemplace);
                } else if (item) {
                    armorInv.setEquipment(slot, undefined);
                }
            }
        } catch (e) {
            CatLogHandler.handleError(e, 'dropArmorsPly', registrationTrace);
        }
    }

    /**
     * Metodo auxiliar que permite el cambio de estado y propiedades a uno o varios items de uno o varios inventarios a un jugador en concreto. Simplificando los lockMode de los items.
     * @param {LockItemsInvParams} params Los parametros en concreto para integrar.
     * @returns {void}
     * @author HaJuegos - 19-05-2026
     * @public
     * @example
     * ```ts
     * const params: LockItemsInvParams = {
     *      ply: source, // Jugador en concreto
     *      invType: 'inv', // Inventario a cambiar
     *      lockMethod: mc.ItemLockMode.Inventory, // Tipo de bloqueo a realizar a los items
     *      keepInDeath: true, // Se asigna la propiedad 'keepInDeath' adicionalmente
     *      itemsSelection: {
     *          randomSlots: {
     *              minSlots: 1,
     *              maxSlots: 4
     *          }
     *      }
     *  }
     * 
     * customEventsManager.lockItemsPly(params)
     * ```
     */
    public lockItemsPly(params: LockItemsInvParams): void {
        const registrationTrace = new Error().stack;

        try {
            const { ply, invType, lockMethod, keepInDeath, itemsSelection } = params;
            const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container as mc.Container;
            const armorInv = ply.getComponent(mc.EntityComponentTypes.Equippable) as mc.EntityEquippableComponent;

            let selectItems: { type: 'inv' | 'armor', slot: number | mc.EquipmentSlot, item: mc.ItemStack; }[] = [];

            /**
             * Funcion auxiliar que valida si se debe quitar el bloqueo de los items o no, dependiendo el argumento del metodo.
             * @param {mc.ItemLockMode} currentLock El bloqueo actual del item a analizar. 
             * @param {mc.ItemLockMode} targetLock El bloqueo a asignar al item.
             * @returns {boolean} Devuelve un boolean dependiendo el caso para desbloquear o bloquear. Dependiendo el argumento del metodo.
             * @author HaJuegos - 19-05-2026
             */
            const validChange = (currentLock: mc.ItemLockMode, targetLock: mc.ItemLockMode): boolean => {
                return currentLock != targetLock;
            };

            /**
             * Funcion auxiliar que valida si un item no debe ser afectado por este sistema, dependiendo el argumento del metodo.
             * @param {mc.ItemStack} item Item en cuestion a validar. 
             * @returns {boolean} Devuelve un boolean dependiendo el caso para usar o no este item en el sistema.
             * @author HaJuegos - 19-05-2026
             */
            const checkWhitelist = (item: mc.ItemStack): boolean => {
                if (!itemsSelection.whitelistItems) return false;

                return itemsSelection.whitelistItems.some(wItem => {
                    const id = typeof wItem == 'string' ? wItem : wItem.typeId;

                    return id == item.typeId;
                });
            };

            if (invType == 'inv' || invType == 'both') {
                const slots = itemsSelection.specificSlots ? itemsSelection.specificSlots as number[] : Array.from({ length: inv.size }, (_, i) => i);

                for (const slot of slots) {
                    const item = inv.getItem(slot);

                    if (item && !checkWhitelist(item) && validChange(item.lockMode, lockMethod)) {
                        selectItems.push({ type: 'inv', slot: slot, item: item });
                    }
                }
            }

            if (invType == 'armor' || invType == 'both') {
                const allSlots = [mc.EquipmentSlot.Head, mc.EquipmentSlot.Chest, mc.EquipmentSlot.Legs, mc.EquipmentSlot.Feet, mc.EquipmentSlot.Offhand];
                const slots = itemsSelection.specificSlots ? itemsSelection.specificSlots as mc.EquipmentSlot[] : allSlots;

                for (const slot of slots) {
                    const item = armorInv.getEquipment(slot);

                    if (item && !checkWhitelist(item) && validChange(item.lockMode, lockMethod)) {
                        selectItems.push({ type: 'armor', slot: slot, item: item });
                    }
                }
            }

            if (itemsSelection.randomSlots) {
                const { minSlots, maxSlots } = itemsSelection.randomSlots;
                const selecTotal = Math.floor(Math.random() * (maxSlots - minSlots + 1)) + minSlots;

                selectItems.sort(() => Math.random() - 0.5);
                selectItems = selectItems.slice(0, selecTotal);
            }

            for (const itemData of selectItems) {
                const { type, slot, item } = itemData;

                item.lockMode = lockMethod;

                if (keepInDeath != undefined) {
                    item.keepOnDeath = keepInDeath;
                }

                if (type == 'inv') {
                    inv.setItem(slot as number, item);
                } else {
                    armorInv.setEquipment(slot as mc.EquipmentSlot, item);
                }
            }
        } catch (e) {
            CatLogHandler.handleError(e, 'lockItemsPly', registrationTrace);
        }
    }
}

export const customEventsManager = new CustomEventsSimplified();