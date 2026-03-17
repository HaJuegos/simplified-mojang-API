import * as mc from '@minecraft/server';
import { beforeEventsSimplified } from './beforeEventsSimplifiedManager';
import { worldToolsSimplified } from './worldToolsSimplifiedManager';

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
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
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
}

export const customEventsManager = new CustomEventsSimplified();