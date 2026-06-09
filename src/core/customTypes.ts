import * as mc from "@minecraft/server";
import * as vanilla from "@minecraft/vanilla-data";
import * as ui from "@minecraft/server-ui";

/**
 * Todos los argumentos disponibles para especificar la funcionalidad de dañar un item o reducir su cantidad.
 * @interface ManualDamageItemParams
 * @author HaJuegos - 20-05-2026
 */
interface ManualDamageItemParams {
    /**
     * Jugador en concreto que es afectado.
     * @type {mc.Player}
     */
    ply: mc.Player;

    /**
     * Item en concreto que es afectado. Dependiendo el tipo, baja de durabilidad o baja el stack.
     * @type {mc.ItemStack}
     */
    item: mc.ItemStack;

    /**
     * (Opcional, por defecto estara 'inv') El tipo de inventario a consultar y cambiar el item afectado.
     * @type {?('inv' | 'armor')}
     */
    specificInv?: 'inv' | 'armor';

    /**
     * (Opcional, por defecto, sera el slot de la mano) El slot en especifico a afectar su respectivo item.
     * @type {?(number | mc.EquipmentSlot)}
     */
    specificSlot?: number | mc.EquipmentSlot;

    /**
     * (Opcional, por defecto sera 1) La cantidad especifica a reducir el item si es el caso.
     * @type {?number}
     */
    specificAmount?: number;

    /**
     * (Opcional, por defecto sera 1) La cantidad de daño especifica a la durabilidad del item si es el caso.
     * @type {?number}
     */
    specificDamageDurability?: number;
}

/**
 * Todos los parametros disponibles para la seleccion de bloqueo especifico para los items.
 * @interface LockItemsInvParams
 * @author HaJuegos - 18-05-2026
 */
interface LockItemsInvParams {
    /**
     * Jugador en concreto a considerar.
     * @type {mc.Player}
     */
    ply: mc.Player;

    /**
     * El tipo de inventario a afectar en concreto.
     * @type {('inv' | 'armor' | 'both')}
     */
    invType: 'inv' | 'armor' | 'both';

    /**
     * Tipo de bloqueo en concreto a insertar a los items.
     * @type {mc.ItemLockMode}
     */
    lockMethod: mc.ItemLockMode;

    /**
     * (Opcional) Insertar la propiedad de mantener el item al morir el jugador.
     * @type {?boolean}
     */
    keepInDeath?: boolean;

    /**
     * Tipo de seleccion de los items por slot a bloquear o insertar.
     * @type {{
     *         allSlots?: boolean;
     *         specificSlots?: number[];
     *         randomSlots?: {
     *             minSlots: number;
     *             maxSlots: number;
     *         };
     *     }}
     */
    itemsSelection: {
        /**
         * (Opcional) Si es verdadero, todos los items de todos los slots se veran afectados.
         * @type {?boolean}
         */
        allSlots?: boolean;

        /**
         * (Opcional) Si es verdadero, solo los items de estos slots en especifico se veran afectados.
         * @type {?number[]}
         */
        specificSlots?: number[] | mc.EquipmentSlot[];

        /**
         * (Opcional) Si se elije esta opcion, la seleccion de items sera aleatoria, elije un minimo y maximo de slots a seleccionar de forma aleatoria.
         * @type {?{
         *             minSlots: number;
         *             maxSlots: number;
         *         }}
         */
        randomSlots?: {
            minSlots: number;
            maxSlots: number;
        };

        /**
         * (Opcional) Si se asigna esta opcion, sera una lista de items que no se veran afectados por este sistema.
         * @type {?(string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[])}
         */
        whitelistItems?: string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[];
    };
}

/**
 * Los parametros disponibles para la creacion de un formulario custom en concreto.
 * @interface CustomFormParams
 * @author HaJuegos - 16-04-2026
 */
interface CustomFormParams {
    /**
     * Texto o traduccion del titulo del formulario en concreto a crear.
     * @type {(string | mc.RawMessage)}
     */
    titleForm: string | mc.RawMessage;

    /**
     * (Opcional) El texto de tipo body para el formulario.
     * @type {?(string | mc.RawMessage)}
     */
    bodyText?: string | mc.RawMessage;

    /**
     * (Opcional) El texto de tipo header para el formulario.
     * @type {?(string | mc.RawMessage)}
     */
    headerText?: string | mc.RawMessage;

    /**
     * (Opcional) El texto de tipo label para el formulario.
     * @type {?(string | mc.RawMessage)}
     */
    labelText?: string | mc.RawMessage;

    /**
     * (Opcional) Los Botones en concreto a integrar en el formulario.
     * @type {?(ButtonFormBase | ButtonFormBase[])}
     */
    buttonsForm?: ButtonFormBase | ButtonFormBase[];

    /**
     * (Opcional) Todos los eventos disponibles para cuando el formulario se crea y se muestra al jugador.
     * @type {?{
     *     targetPly: mc.Player;
     *     onShow?: (ply: mc.Player) => void;
     *     onClose?: (ply: mc.Player, reasonClose: ui.FormCancelationReason) => void;
     *     onClickBtn?: (ply: mc.Player, indexBtn: number) => void;
     *     onErrForm?: (ply: mc.Player, reasonClose: ui.FormCancelationReason) => void;
     * }}
     */
    showPly?: {
        /**
         * Jugador en concreto a mostrar el formulario.
         * @type {mc.Player}
         */
        targetPly: mc.Player;

        /**
         * (Opcional) Los eventos relacionados cuando el formulario se crea.
         * @type {?(ply: mc.Player) => void}
         */
        onCreate?: (ply: mc.Player) => void;

        /**
         * (Opcional) Los eventos relacionados cuando el formulario se cierra.
         * @type {?(ply: mc.Player, reasonClose: ui.FormCancelationReason) => void}
         */
        onClose?: (ply: mc.Player, reasonClose: ui.FormCancelationReason) => void;

        /**
         * (Opcional) Los eventos relacionados cuando se da click a un boton en el formulario.
         * @type {?(ply: mc.Player, indexBtn: number) => void}
         */
        onClickBtn?: (ply: mc.Player, indexBtn: number) => void;

        /**
         * (Opcional) Los eventos relacionados si el formulario tiene un error para mostrarse.
         * @type {?(ply: mc.Player, reasonClose: ui.FormCancelationReason) => void}
         */
        onErrForm?: (ply: mc.Player, reasonClose: ui.FormCancelationReason) => void;
    };
}

/**
 * Los parametros disponibles para la creacion de los botones para un formulario en cuestion.
 * @interface ButtonFormBase
 * @author HaJuegos - 15-04-2026
 */
interface ButtonFormBase {
    /**
     * Texto o traduccion del boton en concreto.
     * @type {(mc.RawMessage | string)}
     */
    buttomText: mc.RawMessage | string;

    /**
     * (Opcional) Ruta del icono en concreto a poner en el boton.
     * @type {?string}
     */
    iconButtomUI?: string;
}

/**
 * Los parametros disponibles al momento de crear un timer a tiempo real.
 * @interface CustomTimerParam
 * @author HaJuegos - 05-04-2026
 * @export
 */
interface CustomTimerParam {
    /**
     * El jugador en concreto a considerar para crear el timer.
     * @type {mc.Player}
     */
    sourcePly: mc.Player;

    /**
     * Identificador unico del timer para registrarlo en el jugador.
     * @type {string}
     */
    timerId: string;

    /**
     * (Opcional) Los minutos iniciales del timer al momento de crear el timer o al actualizar el valor.
     * @type {number}
     */
    initialMns?: number;

    /**
     * (Opcional) Las horas iniciales del timer al momento de crear el timer o al actualizar el valor.
     * @type {?number}
     */
    initialHrs?: number;

    /**
     * (Opcional) Los segundos iniciales del timer al momento de crear el timer o al actualizar el valor.
     * @type {?number}
     */
    initialScnds?: number;

    /**
     * (Opcional) Fuerza al timer a volver a comenzar considerando el valor inicial de minutos o horas. 
     * @type {?boolean}
     */
    forceRestart?: boolean;

    /**
     * (Opcional) Los eventos relacionados cuando el timer comienza.
     * @type {?(ply: mc.Player) => void}
     */
    onTimerStarts?: (ply: mc.Player) => void;

    /**
     * (Opcional) Los eventos relacionados cuando un segundo pasa en el timer.
     * @type {?(ply: mc.Player, timer: string) => void}
     */
    onSecondPass?: (ply: mc.Player, timer: string) => void;

    /**
     * (Opcional) Los eventos relacionados cuando un minuto pasa en el timer.
     * @type {?(ply: mc.Player, timer: string) => void}
     */
    onMinutePass?: (ply: mc.Player, timer: string) => void;

    /**
     * (Opcional) Los eventos relacionados cuando una hora pasa en el timer.
     * @type {?(ply: mc.Player, timer: string) => void}
     */
    onHourPass?: (ply: mc.Player, timer: string) => void;

    /**
     * (Opcional) Los eventos relacionados cuando el timer se termina.
     * @type {?(ply: mc.Player) => void}
     */
    onTimerEnds?: (ply: mc.Player) => void;
}

export type {
    ManualDamageItemParams,
    LockItemsInvParams,
    CustomFormParams,
    ButtonFormBase,
    CustomTimerParam
};