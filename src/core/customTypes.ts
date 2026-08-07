import * as mc from "@minecraft/server";
import * as vanilla from "@minecraft/vanilla-data";
import * as ui from "@minecraft/server-ui";

type IconTextureWaypoint =
    |
    {
        /**
         * Formas vanillas creadas por defecto y que puedes usar.
         * @type {mc.WaypointTexture}
         */
        shape: mc.WaypointTexture;
    }
    |
    {
        /**
         * Ruta en concreto donde está localizado el icono custom.
         * @type {string}
         */
        path: string;

        /**
         * Tamaño del icono en unidades relativas. Solo se permite de 0 a 1.
         * @type {number}
         */
        iconWidth: number;

        /**
         * Tamaño del icono en unidades relativas. Solo se permite 0 a 1.
         * @type {number}
         */
        iconHeight: number;
    };

/**
 * Parámetros principales y opcionales para la creación de un punto de localización custom en la locator bar de uno o varios jugadores.
 * @interface CustomWayPointsParams
 * @author HaJuegos - 03-08-2026
 */
interface CustomWayPointsParams {
    /**
     * Jugador o lista de jugadores afectados por este nuevo punto de localización.
     * @type {(mc.Player | mc.Player[])}
     */
    targetPlys: mc.Player | mc.Player[];

    /**
     * Ubicación concreta donde está este nuevo punto.
     * @type {mc.Vector3}
     */
    location: mc.Vector3;

    /**
     * Dimensión en concreto donde está este nuevo punto.
     * @type {mc.Dimension}
     */
    dimension: mc.Dimension;

    /**
     * Textura del icono en concreto de este nuevo punto. Puede ser totalmente custom de una textura del RP o, si no, una forma vanilla con colores personalizados.
     * @type {IconTextureWaypoint}
     */
    iconTexture: IconTextureWaypoint;

    /**
     * (Opcional) El color que sobrepondrá el punto personalizado. Esto principalmente viene bien en caso de usar las formas vanillas.
     * @type {?mc.RGB}
     */
    color?: mc.RGB;

    /**
     * (Opcional) Por defecto, el punto nuevo creado siempre es visible, pero si lo quieres crear y luego hacerlo visible por x motivo. También se puede.
     * @type {?boolean}
     */
    visible?: boolean;
}

/**
 * Parámetros principales y opcionales para la creación de un texto flotante de forma simplifiada.
 * @interface CustomFloatingTextParams
 * @author HaJuegos - 18-07-2026
 */
interface CustomFloatingTextParams {
    /**
     * El texto que tendrá el elemento en cuestión.
     * @type {(string | mc.RawMessage)}
     */
    text: string | mc.RawMessage;

    /**
     * La ubicación principal donde se mantendrá el elemento en cuestión.
     * @type {mc.Vector3}
     */
    location: mc.Vector3;

    /**
     * Si se establece true, este elemento es visible a través de paredes y entidades. En caso contrario, no. Como un nametag.
     * @type {boolean}
     */
    alwaysVisible: boolean;

    /**
     * La dimension en concreto donde aparecerá este elemento en cuestión.
     * @type {mc.Dimension}
     */
    dimension: mc.Dimension;

    /**
     * (Opcional) El color que tomará el texto del elemento en cuestión. No es muy recomendable usarlo, para eso usa los códigos de color §.
     * El valor puede ser un valor hexadecimal.
     * @type {?(string | mc.RGBA)}
     */
    color?: string | mc.RGBA;

    /**
     * (Opcional) El color que tomará el fondo de este elemento, así para poder cambiar ese tono gris aburrido que tiene.
     * El valor puede ser un valor hexadecimal.
     * @type {?(string | mc.RGBA)}
     */
    backGroundColor?: string | mc.RGBA;

    /**
     * (Opcional) Si es true, este elemento siempre estará conectado a una entidad, como un nametag. En caso contrario, pues no.
     * @type {?boolean}
     */
    attachedTo?: mc.Entity;

    /**
     * (Opcional) Si se establece, se pone un límite de tiempo en segundos de cuanto durará este elemento en cuestión, en caso contrario, pues se quedará allí siempre.
     * @type {?number}
     */
    duration?: number;

    /**
     * (Opcional) El tamaño que tendrá este elemento en concreto, por defecto siempre es 1.
     * @type {?number}
     */
    scale?: number;

    /**
     * (Opcional) La rotación fija de este elemento en cuestión. Basado en coordenadas.
     * @type {?mc.Vector3}
     */
    rotation?: mc.Vector3;

    /**
     * (Opcional) Si se establece, solo la lista de jugadores podrá ver este elemento, en caso contrario, es visible para todos.
     * @type {?mc.Player[] | mc.Player}
     */
    toPlys?: mc.Player[] | mc.Player;
}

/**
 * Interfaz que establece los datos de registro de un evento en concreto.
 * @interface EventRegister
 * @template T
 * @author HaJuegos - 11-03-2026
 */
interface EventRegister<T> {
    /**
     * Método subscribe a registrar con los eventos relacionados del callback original, devolviendo a su vez también los parámetros o datos dependiendo el evento callback.
     * @param {(args: T) => void} callback Evento principal relacional en cuestión. 
     * @returns {(args: T) => void} El tipo de dato devuelto por el evento principal.
     * @author HaJuegos - 15-07-2026
     */
    subscribe(callback: (args: T) => void): (args: T) => void;
}

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
     * (Opcional, por defecto estará 'inv') El tipo de inventario a consultar y cambiar el item afectado.
     * @type {?('inv' | 'armor')}
     */
    specificInv?: 'inv' | 'armor';

    /**
     * (Opcional, por defecto, será el slot de la mano) El slot en específico a afectar su respectivo item.
     * @type {?(number | mc.EquipmentSlot)}
     */
    specificSlot?: number | mc.EquipmentSlot;

    /**
     * (Opcional, por defecto será 1) La cantidad especifica a reducir el item si es el caso.
     * @type {?number}
     */
    specificAmount?: number;

    /**
     * (Opcional, por defecto será 1) La cantidad de daño especifica a la durabilidad del item si es el caso.
     * @type {?number}
     */
    specificDamageDurability?: number;
}

/**
 * Todos los parámetros disponibles para la selección de bloqueo específico para los items.
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
     * Tipo de selección de los items por slot a bloquear o insertar.
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
         * (Opcional) Si es verdadero, todos los items de todos los slots se verán afectados.
         * @type {?boolean}
         */
        allSlots?: boolean;

        /**
         * (Opcional) Si es verdadero, solo los items de estos slots en específico se verán afectados.
         * @type {?number[]}
         */
        specificSlots?: number[] | mc.EquipmentSlot[];

        /**
         * (Opcional) Si se elige esta opción, la selección de items será aleatoria, elige un mínimo y máximo de slots a seleccionar de forma aleatoria.
         * @type {?{minSlots: number; maxSlots: number; }}
         */
        randomSlots?: {
            minSlots: number;
            maxSlots: number;
        };

        /**
         * (Opcional) Si se asigna esta opción, será una lista de items que no se verán afectados por este sistema.
         * @type {?(string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[])}
         */
        whitelistItems?: string[] | vanilla.MinecraftItemTypes[] | mc.ItemStack[];
    };
}

/**
 * Los parámetros disponibles para la creación de un formulario custom en concreto.
 * @interface CustomFormParams
 * @author HaJuegos - 16-04-2026
 */
interface CustomFormParams {
    /**
     * Texto o traducción del título del formulario en concreto a crear.
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
         * (Opcional) Los eventos relacionados cuando se da click a un botón en el formulario.
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
 * Los parámetros disponibles para la creación de los botones para un formulario en cuestión.
 * @interface ButtonFormBase
 * @author HaJuegos - 15-04-2026
 */
interface ButtonFormBase {
    /**
     * Texto o traducción del botón en concreto.
     * @type {(mc.RawMessage | string)}
     */
    buttomText: mc.RawMessage | string;

    /**
     * (Opcional) Ruta del icono en concreto a poner en el botón.
     * @type {?string}
     */
    iconButtomUI?: string;
}

/**
 * Los parámetros disponibles al momento de crear un timer a tiempo real.
 * @interface CustomTimerParam
 * @author HaJuegos - 05-04-2026
 */
interface CustomTimerParam {
    /**
     * El jugador en concreto a considerar para crear el timer.
     * @type {mc.Player}
     */
    sourcePly: mc.Player;

    /**
     * Identificador único del timer para registrarlo en el jugador.
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
    IconTextureWaypoint,
    CustomWayPointsParams,
    CustomFloatingTextParams,
    EventRegister,
    ManualDamageItemParams,
    LockItemsInvParams,
    CustomFormParams,
    ButtonFormBase,
    CustomTimerParam
};