import * as mc from '@minecraft/server';
import * as vanilla from '@minecraft/vanilla-data';

import { beforeEventsSimplified } from './beforeEventsSimplifiedManager';
import { worldToolsSimplified } from './worldToolsSimplifiedManager';
import { afterEventsSimplified } from './afterEventsSimplifiedManager';

/**
 * Clase que contiene todos los metodos de mecanicas universales usadas en sus add-ons.
 * @author HaJuegos - 15-03-2026
 */
class CustomEventsSimplified {
    /**
     * Eventos principales de la clase cuando es llamada o inicializada.
     * @constructor
     */
    constructor () {

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
}

export const customEventsManager = new CustomEventsSimplified();