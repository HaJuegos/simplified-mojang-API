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
    private onProjectileHitEntityManager: BaseEventManager<mc.ProjectileHitEntityAfterEvent>;
    private onProjectileHitBlockManager: BaseEventManager<mc.ProjectileHitBlockAfterEvent>;
    private onHitEntityManager: BaseEventManager<mc.EntityHitEntityAfterEvent>;
    private onEntityHurtManager: BaseEventManager<mc.EntityHurtAfterEvent>;
    private onHealthEntityChangeManager: BaseEventManager<mc.EntityHealthChangedAfterEvent>;

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
        this.onProjectileHitEntityManager = new BaseEventManager<mc.ProjectileHitEntityAfterEvent>(mc.world.afterEvents.projectileHitEntity, "AfterProyectileHitEntity");
        this.onProjectileHitBlockManager = new BaseEventManager<mc.ProjectileHitBlockAfterEvent>(mc.world.afterEvents.projectileHitBlock, "AfterProyectileHitBlock");
        this.onHitEntityManager = new BaseEventManager<mc.EntityHitEntityAfterEvent>(mc.world.afterEvents.entityHitEntity, "AfterHitEntity");
        this.onEntityHurtManager = new BaseEventManager<mc.EntityHurtAfterEvent>(mc.world.afterEvents.entityHurt, "AfterHurtEntity");
        this.onHealthEntityChangeManager = new BaseEventManager<mc.EntityHealthChangedAfterEvent>(mc.world.afterEvents.entityHealthChanged, "AfterHealthChangeEntity");
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

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un proyectil golpea una entidad de forma simplificada.
     * @param {(args: mc.ProjectileHitEntityAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onProjectileHitEntity((args) => {
     *     const sourceEntity = args.source;
     *     const hitEntity = args.getEntityHit().entity;
     * 
     *     console.warn(`${source?.typeId} ha golpeado a ${hitEntity.typeId}.`);
     * });
     * ```
     */
    public onProjectileHitEntity(callback: (args: mc.ProjectileHitEntityAfterEvent) => void): void {
        this.onProjectileHitEntityManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un proyectil golpea un bloque de forma simplificada.
     * @param {(args: mc.ProjectileHitBlockAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onProjectileHitBlock((args) => {
     *     const sourceEntity = args.source;
     *     const hitBlock = args.getBlockHit().entity;
     * 
     *     console.warn(`${source.typeId} ha golpeado al bloque ${hitBlock.typeId}.`);
     * });
     * ```
     */
    public onProjectileHitBlock(callback: (args: mc.ProjectileHitBlockAfterEvent) => void): void {
        this.onProjectileHitBlockManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando se golpea una entidad de forma simplificada.
     * @param {(args: mc.EntityHitEntityAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onHitEntity((args) => {
     *    const sourceEntity = args.damagingEntity;
     *    const hitEntity = args.hitEntity;
     * 
     *    console.warn(`${sourceEntity.typeId} ha golpeado a ${hitEntity.typeId}`);
     * });
     * ```
     */
    public onHitEntity(callback: (args: mc.EntityHitEntityAfterEvent) => void): void {
        this.onHitEntityManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando se lastima una entidad de forma simplificada.
     * @param {(args: mc.EntityHurtAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onHurtEntity((args) => {
     *    const source = args.damageSource;
     *    const sourceEntity = source.damagingEntity;
     *    const cause = source.cause;
     *    const hitEntity = args.hurtEntity;
     * 
     *    console.warn(`${sourceEntity.typeId} ha lastimado a ${hitEntity.typeId} mediante ${cause}`);
     * });
     * ```
     */
    public onHurtEntity(callback: (args: mc.EntityHurtAfterEvent) => void): void {
        this.onEntityHurtManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando la vida de una entidad cambia de forma simplificada.
     * @param {(args: mc.EntityHealthChangedAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 19-03-2026
     * @public
     * @afterEvent Metodo que detecta el evento despues de que suceda. Obteniendo la informacion sin permitir modificarla en su mayoria.
     * @example
     * ```ts
     * afterEventsSimplified.onHealthEntityChange((args) => {
     *    console.warn(`${args.entity.typeId} tenia ${args.oldValue} de vida y ahora tiene ${args.newValue}.`);
     * });
     * ```
     */
    public onHealthEntityChange(callback: (args: mc.EntityHealthChangedAfterEvent) => void): void {
        this.onHealthEntityChangeManager.register(callback);
    }
}

export const afterEventsSimplified = new AfterEventsSimplified();