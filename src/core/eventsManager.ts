
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
        this.evnSignal.subscribe((args) => {
            try {
                callback(args);
            } catch (e) {
                const err = e as Error;

                let customMessage = `[CATLOG]: Error en el evento ${this.evnName}. Detalles: ${err.message}`;

                if (err.message.includes("restricted execution")) {
                    customMessage += "\n[CATLOG INFO]: Ocurrio un error de restricciones en ejecucion temprana, seguramente porque se ejecuto una logica en un evento before.";
                    customMessage += "\n[CATLOG TIP]: Envuelve tu logica dentro de un 'worldToolsSimplified.setRun()' para solucionar este problema o convierte el metodo en async.";
                } else if (err.message.includes("early execution")) {
                    customMessage += "\n[CATLOG INFO]: Ocurrio un error de ejecucion anticipada, seguramente porque la logica espera datos, cuando aun lo estan.";
                    customMessage += "\n[CATLOG TIP]: Mueve este codigo al evento 'onWorldReady' para asegurarte de que los datos ya existan.";
                }

                console.warn(customMessage);
                console.warn(err.stack);
            }
        });
    }
}