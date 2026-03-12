import { BaseEventManager } from "../core/eventsManager";

import * as mc from "@minecraft/server";

/**
 * Clase principal que maneja los eventos after de forma simplificada para mejor manejo de errores.
 * @class AfterEventsSimplified
 * @author HaJuegos - 11-03-2026
 */
class AfterEventsSimplified {
    private entityDieManager: BaseEventManager<mc.EntityDieAfterEvent>;
    private playerSpawnManager: BaseEventManager<mc.PlayerSpawnAfterEvent>;

    /**
     * Eventos que se inicializan cuando la clase es llamada o inicializada.
     * @constructor
     */
    constructor () {
        this.entityDieManager = new BaseEventManager<mc.EntityDieAfterEvent>(mc.world.afterEvents.entityDie, "AfterEntityDie");
        this.playerSpawnManager = new BaseEventManager<mc.PlayerSpawnAfterEvent>(mc.world.afterEvents.playerSpawn, "AfterPlayerSpawn");
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

    /**
     * Metodo auxiliar que ejecuta los eventos relacionado cuando un jugador respawnea de forma simplificada.
     * @param {(args: mc.PlayerSpawnAfterEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
     */
    public onPlayerSpawns(callback: (args: mc.PlayerSpawnAfterEvent) => void): void {
        this.playerSpawnManager.register(callback);
    }
}

export const afterEventsSimplified = new AfterEventsSimplified();