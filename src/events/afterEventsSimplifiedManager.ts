import { BaseEventManager } from "../core/eventsManager";

import * as mc from "@minecraft/server";

/**
 * Clase principal que maneja los eventos after de forma simplificada para mejor manejo de errores.
 * @export
 * @class AfterEventsSimplified
 * @author HaJuegos - 11-03-2026
 */
export class AfterEventsSimplified {
    private entityDieManager: BaseEventManager<mc.EntityDieAfterEvent>;

    /**
     * Eventos que se inicializan cuando la clase es llamada o inicializada.
     * @constructor
     */
    constructor () {
        this.entityDieManager = new BaseEventManager<mc.EntityDieAfterEvent>(mc.world.afterEvents.entityDie, "AfterEntityDie");
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionado cuando una entidad muere de forma simplificada.
     * @param {(args: mc.EntityDieAfterEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
     */
    public onEntityDie(callback: (args: mc.EntityDieAfterEvent) => void): void {
        this.entityDieManager.register(callback);
    }
}

export const afterEventsSimplified = new AfterEventsSimplified();