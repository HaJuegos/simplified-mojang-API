import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

/**
 * Los parametros disponibles para la creacion de un formulario custom en concreto.
 * @interface CustomFormParams
 * @author HaJuegos - 16-04-2026
 */
export interface CustomFormParams {
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
export interface ButtonFormBase {
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
export interface CustomTimerParam {
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
     * Los minutos iniciales del timer al momento de crear el timer o al actualizar el valor.
     * @type {number}
     */
    initialMns: number;

    /**
     * (Opcional) Las horas iniciales del timer al momento de crear el timer o al actualizar el valor.
     * @type {?number}
     */
    initialHrs?: number;

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