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
    private worldLoadManager: BaseEventManager<mc.WorldLoadAfterEvent>;
    private chatSendManager: BaseEventManager<mc.ChatSendAfterEvent>;
    private itemUseManager: BaseEventManager<mc.ItemUseAfterEvent>;
    private explosionManager: BaseEventManager<mc.ExplosionAfterEvent>;

    /**
     * Eventos que se inicializan cuando la clase es llamada o inicializada.
     * @constructor
     */
    constructor () {
        this.entityDieManager = new BaseEventManager<mc.EntityDieAfterEvent>(mc.world.afterEvents.entityDie, "AfterEntityDie");
        this.playerSpawnManager = new BaseEventManager<mc.PlayerSpawnAfterEvent>(mc.world.afterEvents.playerSpawn, "AfterPlayerSpawn");
        this.worldLoadManager = new BaseEventManager<mc.WorldLoadAfterEvent>(mc.world.afterEvents.worldLoad, "AfterWorldLoad");
        this.chatSendManager = new BaseEventManager<mc.ChatSendAfterEvent>(mc.world.afterEvents.chatSend, "AfterChatSend");
        this.itemUseManager = new BaseEventManager<mc.ItemUseAfterEvent>(mc.world.afterEvents.itemUse, "AfterItemUse");
        this.explosionManager = new BaseEventManager<mc.ExplosionAfterEvent>(mc.world.afterEvents.explosion, "AfterExplodes");
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionado cuando una entidad muere de forma simplificada.
     * @param {(args: mc.EntityDieAfterEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onEntityDie((event) => {
     *   console.warn(`La entidad ${args.entity.typeId} murio en ${args.location}`);
     * });
     * ```
     */
    public onEntityDie(callback: (args: mc.EntityDieAfterEvent) => void): void {
        this.entityDieManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionado cuando un jugador respawnea de forma simplificada.
     * @param {(args: mc.PlayerSpawnAfterEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onPlayerSpawns((args) => {
     *   console.warn(`El Jugador ${args.player.name} spawneo en ${args.player.location}`);
     * });
     * ```
     */
    public onPlayerSpawns(callback: (args: mc.PlayerSpawnAfterEvent) => void): void {
        this.playerSpawnManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un mundo se termino de cargar de forma simplificada.
     * @param {(args: mc.WorldLoadAfterEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onWorldReady(() => {
     *   console.warn(`El mundo se ha cargado correctamente`);
     * });
     * ```
     */
    public onWorldReady(callback: (args: mc.WorldLoadAfterEvent) => void): void {
        this.worldLoadManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando se recibe un mensaje en el chat de forma simplificada.
     * @param {(args: mc.ChatSendAfterEvent) => void} callback Los argumentos y logica a ejecutar en el evento.
     * @author HaJuegos - 14-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onSendMessageChat((args) => {
     *    console.warn(`El usuario ${args.sender.name} envio el mensaje ${args.message}`);
     * });
     * ```
     */
    public onSendMessageChat(callback: (args: mc.ChatSendAfterEvent) => void): void {
        this.chatSendManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando ya se usa el item de forma simplificada.
     * @param {(args: mc.ItemUseAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 15-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onUseItem((args) => {
     *   console.warn(`Se ha usado el item ${args.itemStack.typeId}.`);
     * });
     * ```
     */
    public onUseItem(callback: (args: mc.ItemUseAfterEvent) => void): void {
        this.itemUseManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando algo exploto de forma simplificada.
     * @param {(args: mc.ExplosionAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 17-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onExplodes((args) => {
     *     const source = args.source;
     * 
     *     if (source && source.typeId == 'minecraft:creeper') {
     *        console.warn(`Un creeper ha explotado.`);
     *     }
     * });
     * ```
     */
    public onExplodes(callback: (args: mc.ExplosionAfterEvent) => void): void {
        this.explosionManager.register(callback);
    }
}

export const afterEventsSimplified = new AfterEventsSimplified();