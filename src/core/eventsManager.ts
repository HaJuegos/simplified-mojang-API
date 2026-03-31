import { CatLogHandler } from "./errorHandler";

/**
 * Interfaz que establece los datos de registro de un evento en concreto.
 * @interface EventRegister
 * @template T
 * @author HaJuegos - 11-03-2026
 */
interface EventRegister<T> {
    subscribe(callback: (args: T) => void): (args: T) => void;
}

/**
 * Gestor interno para manejar las subscripciones y errores internos try/catch.
 * @template T 
 * @author HaJuegos - 11-03-2026
 */
export class BaseEventManager<T> {
    constructor (private evnSignal: EventRegister<T>, private evnName: string) { }

    /**
     * Metodo que registra el callback para los eventos del evento final.
     * @param callback La logica individual del evento final.
     * @public
     * @author HaJuegos - 11-03-2026
     */
    public register(callback: (args: T) => void): void {
        const registrationTrace = new Error().stack;

        this.evnSignal.subscribe((args) => {
            try {
                callback(args);
            } catch (e) {
                CatLogHandler.handleError(e, `Evento ${this.evnName}`, registrationTrace);
            }
        });
    }
}