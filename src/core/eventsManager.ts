import { EventRegister } from "./customTypes";

import { CatLogHandler } from "./errorHandler";

/**
 * Gestor interno para manejar las subscripciones y errores internos try/catch.
 * @template T 
 * @author HaJuegos - 11-03-2026
 */
export class BaseEventManager<T> {
    /**
     * Array principal que contiene todos los eventos relacionales registrados en un solo listener.
     * @type {Array<{ fn: (args: T) => void; trance?: string; }>}
     * @private
     * @author HaJuegos - 15-07-2026
     */
    private callbacks: Array<{ fn: (args: T) => void; trance?: string; }> = [];

    /**
     * Boolean que detecta si ya esta registrado previamente o no un evento relacional con su listener correspondido.
     * @type {boolean}
     * @private
     * @author HaJuegos - 15-07-2026
     */
    private isSub = false;

    /**
     * Argumentos principales para instanciar un evento base creado con eventos relacionales.
     * @constructor
     * @param {EventRegister<T>} evnSignal Evento relacional a considerar. 
     * @param {string} evnName Nombre Simplificado dado a este evento relacional a considerar.
     * @author HaJuegos - 15-07-2026
     */
    constructor (private evnSignal: EventRegister<T>, private evnName: string) { }

    /**
     * Metodo que registra el callback para los eventos relacionales del evento final. Internamente solo existe un unico subcrite por evento; Entonces los callbacks adiccionales se agregan a un array y se ejecutan dentro del mismo listener.
     * @param callback La logica individual del evento final.
     * @version 2 Cambio total de instancias en su formato de registro para optimizaciones internas.
     * @returns {void}
     * @public
     * @author HaJuegos - 15-07-2026
     */
    public register(callback: (args: T) => void): void {
        const registrationTrace = new Error().stack;

        this.callbacks.push({ fn: callback, trance: registrationTrace });

        if (!this.isSub) {
            this.isSub = true;

            this.evnSignal.subscribe((args) => {
                for (const { fn, trance } of this.callbacks) {
                    try {
                        fn(args);
                    } catch (e) {
                        CatLogHandler.handleError(e, `Evento ${this.evnName}`, trance);
                    }
                }
            });
        }
    }

    /**
     * Metodo que elimina un callback previamente registrado.
     * @param {(args: T) => void} callback Referencia exacta a la funcion registrada en el register.
     * @public
     * @author HaJuegos - 15-07-2026
     */
    public unregister(callback: (args: T) => void): void {
        this.callbacks = this.callbacks.filter(c => c.fn != callback);
    }
}