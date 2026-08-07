import * as mc from "@minecraft/server";

import { BaseEventManager } from "../core/eventsManager";

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
    private onChangeDimensionManager: BaseEventManager<mc.PlayerDimensionChangeAfterEvent>;
    private interactEntityManager: BaseEventManager<mc.PlayerInteractWithEntityAfterEvent>;
    private interactBlockManager: BaseEventManager<mc.PlayerInteractWithBlockAfterEvent>;
    private entitySpawnsManager: BaseEventManager<mc.EntitySpawnAfterEvent>;
    private effectAddManager: BaseEventManager<mc.EffectAddAfterEvent>;
    private placeBlockManager: BaseEventManager<mc.PlayerPlaceBlockAfterEvent>;
    private breakBlockManager: BaseEventManager<mc.PlayerBreakBlockAfterEvent>;
    private dataEventsManager: BaseEventManager<mc.DataDrivenEntityTriggerAfterEvent>;
    private changeInvManager: BaseEventManager<mc.PlayerInventoryItemChangeAfterEvent>;
    private onGetItem: BaseEventManager<mc.EntityItemPickupAfterEvent>;
    private onDropItem: BaseEventManager<mc.EntityItemDropAfterEvent>;
    private playerJoinsManager: BaseEventManager<mc.PlayerJoinAfterEvent>;
    private playerLeavesManager: BaseEventManager<mc.PlayerLeaveAfterEvent>;
    private entityLoadWorld: BaseEventManager<mc.EntityLoadAfterEvent>;
    private entityHealh: BaseEventManager<mc.EntityHealAfterEvent>;
    private entityRemove: BaseEventManager<mc.EntityRemoveAfterEvent>;

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
        this.onChangeDimensionManager = new BaseEventManager<mc.PlayerDimensionChangeAfterEvent>(mc.world.afterEvents.playerDimensionChange, "AfterChangeDimension");
        this.interactEntityManager = new BaseEventManager<mc.PlayerInteractWithEntityAfterEvent>(mc.world.afterEvents.playerInteractWithEntity, "AfterInteractEntity");
        this.interactBlockManager = new BaseEventManager<mc.PlayerInteractWithBlockAfterEvent>(mc.world.afterEvents.playerInteractWithBlock, "AfterInteractBlock");
        this.entitySpawnsManager = new BaseEventManager<mc.EntitySpawnAfterEvent>(mc.world.afterEvents.entitySpawn, "AfterEntitySpawns");
        this.effectAddManager = new BaseEventManager<mc.EffectAddAfterEvent>(mc.world.afterEvents.effectAdd, "AfterEffectAdd");
        this.placeBlockManager = new BaseEventManager<mc.PlayerPlaceBlockAfterEvent>(mc.world.afterEvents.playerPlaceBlock, "AfterPlaceBlock");
        this.breakBlockManager = new BaseEventManager<mc.PlayerBreakBlockAfterEvent>(mc.world.afterEvents.playerBreakBlock, "AfterBreakBlock");
        this.dataEventsManager = new BaseEventManager<mc.DataDrivenEntityTriggerAfterEvent>(mc.world.afterEvents.dataDrivenEntityTrigger, "AfterDataEvents");
        this.changeInvManager = new BaseEventManager<mc.PlayerInventoryItemChangeAfterEvent>(mc.world.afterEvents.playerInventoryItemChange, "AfterInvChangeOnPly");
        this.onGetItem = new BaseEventManager<mc.EntityItemPickupAfterEvent>(mc.world.afterEvents.entityItemPickup, "AfterEntityPickItem");
        this.onDropItem = new BaseEventManager<mc.EntityItemDropAfterEvent>(mc.world.afterEvents.entityItemDrop, "AfterEntityDropItem");
        this.playerJoinsManager = new BaseEventManager<mc.PlayerJoinAfterEvent>(mc.world.afterEvents.playerJoin, "AfterPlayerJoins");
        this.playerLeavesManager = new BaseEventManager<mc.PlayerLeaveAfterEvent>(mc.world.afterEvents.playerLeave, "AfterPlayerLeaves");
        this.entityLoadWorld = new BaseEventManager<mc.EntityLoadAfterEvent>(mc.world.afterEvents.entityLoad, "AfterEntityLoadInWorld");
        this.entityHealh = new BaseEventManager<mc.EntityHealAfterEvent>(mc.world.afterEvents.entityHeal, "AfterEntityHealing");
        this.entityRemove = new BaseEventManager<mc.EntityRemoveAfterEvent>(mc.world.afterEvents.entityRemove, "AfterEntityRemove");
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionado cuando una entidad muere de forma simplificada.
     * @param {(args: mc.EntityDieAfterEvent) => void} callback Los argumentos del evento y su lógica.
     * @returns {void}
     * @author HaJuegos - 11-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onEntityDie((args) => {
     *     const entity = args.deadEntity;
     *     const source = args.damageSource;
     * 
     *     console.warn(`La entidad ${entity.typeId} murió en ${entity.location} debido a ${source.cause}.`);
     * });
     * ```
     */
    public onEntityDie(callback: (args: mc.EntityDieAfterEvent) => void): void {
        this.entityDieManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionado cuando un jugador respawnea de forma simplificada.
     * @param {(args: mc.PlayerSpawnAfterEvent) => void} callback Los argumentos del evento y su lógica.
     * @returns {void}
     * @author HaJuegos - 11-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onPlayerSpawns((args) => {
     *     const ply = args.player;
     *     const firstSpawn = args.initialSpawn;
     * 
     *     console.warn(`El Jugador ${ply.name} spawneó en ${ply.location}. (Primera aparicion: ${firstSpawn})`);
     * });
     * ```
     */
    public onPlayerSpawns(callback: (args: mc.PlayerSpawnAfterEvent) => void): void {
        this.playerSpawnManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un mundo se terminó de cargar de forma simplificada.
     * @param {(args: mc.WorldLoadAfterEvent) => void} callback Los argumentos del evento y su lógica.
     * @returns {void}
     * @author HaJuegos - 11-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onWorldReady(() => {
     *     console.warn(`El mundo se ha cargado correctamente`);
     * });
     * ```
     */
    public onWorldReady(callback: (args: mc.WorldLoadAfterEvent) => void): void {
        this.worldLoadManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando se recibe un mensaje en el chat de forma simplificada.
     * @param {(args: mc.ChatSendAfterEvent) => void} callback Los argumentos y lógica a ejecutar en el evento.
     * @returns {void}
     * @author HaJuegos - 14-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onSendMessageChat((args) => {
     *     console.warn(`El usuario ${args.sender.name} envio el mensaje ${args.message}`);
     * });
     * ```
     */
    public onSendMessageChat(callback: (args: mc.ChatSendAfterEvent) => void): void {
        this.chatSendManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando ya se usa el item de forma simplificada.
     * @param {(args: mc.ItemUseAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 15-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onUseItem((args) => {
     *     const ply = args.source;
     *     const item = args.itemStack;
     *     
     *     console.warn(`El Jugador ${ply.name} uso el item ${item.typeId}`);
     * });
     * ```
     */
    public onUseItem(callback: (args: mc.ItemUseAfterEvent) => void): void {
        this.itemUseManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando algo explotó de forma simplificada.
     * @param {(args: mc.ExplosionAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 17-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onExplodes((args) => {
     *     const source = args.source;
     * 
     *     if (source && source.typeId == 'minecraft:creeper') {
     *        console.warn(`Un creeper explotó.`);
     *     }
     * });
     * ```
     */
    public onExplodes(callback: (args: mc.ExplosionAfterEvent) => void): void {
        this.explosionManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un proyectil golpea una entidad de forma simplificada.
     * @param {(args: mc.ProjectileHitEntityAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
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
     * Método auxiliar que ejecuta los eventos relacionados cuando un proyectil golpea un bloque de forma simplificada.
     * @param {(args: mc.ProjectileHitBlockAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
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
     * Método auxiliar que ejecuta los eventos relacionados cuando se golpea una entidad de forma simplificada.
     * @param {(args: mc.EntityHitEntityAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
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
     * Método auxiliar que ejecuta los eventos relacionados cuando se lastima una entidad de forma simplificada.
     * @param {(args: mc.EntityHurtAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 18-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
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
     * Método auxiliar que ejecuta los eventos relacionados cuando la vida de una entidad cambia de forma simplificada.
     * @param {(args: mc.EntityHealthChangedAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 19-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
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

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un jugador cambia de dimensión de forma simplificada.
     * @param {(args: mc.PlayerDimensionChangeAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 20-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onChangeDimension((args) => {
     *     const ply = args.player;
     *     const fromDime = args.fromDimension;
     *     const toDime = args.toDimension;
     * 
     *     console.warn(`${ply.name} estaba en el ${fromDime.id} y ahora está en ${toDime.id}.`);
     * });
     * ```
     */
    public onChangeDimension(callback: (args: mc.PlayerDimensionChangeAfterEvent) => void): void {
        this.onChangeDimensionManager.register(callback);
    };

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un jugador interactuó con una entidad de forma simplificada.
     * @param {(args: mc.PlayerInteractWithEntityAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 20-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onInteractEntity((args) => {
     *     const ply = args.player;
     *     const hitEntity = args.target;
     * 
     *     console.warn(`${ply.name} interactuó con ${hitEntity.typeId}.`);
     * });
     * ```
     */
    public onInteractEntity(callback: (args: mc.PlayerInteractWithEntityAfterEvent) => void): void {
        this.interactEntityManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un jugador interactuó con un bloque de forma simplificada.
     * @param {(args: mc.PlayerInteractWithBlockAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 20-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onInteractBlock((args) => {
     *     const ply = args.player;
     *     const block = args.block;
     * 
     *     console.warn(`${ply.name} interactuó con el bloque ${block.typeId}.`);
     * });
     * ```
     */
    public onInteractBlock(callback: (args: mc.PlayerInteractWithBlockAfterEvent) => void): void {
        this.interactBlockManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando una entidad spawnea de forma simplificada.
     * @param {(args: mc.EntitySpawnAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 20-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onEntitySpawns((args) => {
     *     console.warn(`${args.entity.typeId} ha spawneado en el mundo`);
     * });
     * ```
     */
    public onEntitySpawns(callback: (args: mc.EntitySpawnAfterEvent) => void): void {
        this.entitySpawnsManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un efecto es añadido en una entidad o jugador de forma simplificada.
     * @param {(args: mc.EffectAddAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 20-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onAddsEffect((args) => {
     *     console.warn(`${args.entity.typeId} ahora tiene el efecto ${args.effect.displayName}.`);
     * });
     * ```
     */
    public onAddsEffect(callback: (args: mc.EffectAddAfterEvent) => void): void {
        this.effectAddManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un bloque es colocado de forma simplificada.
     * @param {(args: mc.PlayerPlaceBlockAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 20-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onPlaceBlock((args) => {
     *     console.warn(`${args.player.name} coloco el bloque ${args.block.typeId}.`);
     * });
     * ```
     */
    public onPlaceBlock(callback: (args: mc.PlayerPlaceBlockAfterEvent) => void): void {
        this.placeBlockManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un bloque es roto de forma simplificada.
     * @param {(args: mc.PlayerBreakBlockAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 23-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onBreakBlock((args) => {
     *     console.warn(`${args.player.name} rompio el bloque ${args.block.typeId}.`);
     * });
     * ```
     */
    public onBreakBlock(callback: (args: mc.PlayerBreakBlockAfterEvent) => void): void {
        this.breakBlockManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando una entidad ejecuta uno o varios de sus eventos de su JSON para cambiar componentes, o también por comandos como /event. De forma más simple, sirve como un log de cuales component groups cambió la entidad en ese instante.
     * @param {(args: mc.DataDrivenEntityTriggerAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 26-03-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.getEntityEvents((args) => {
     *     const entity = args.entity;
     *     const events = args.getModifiers();
     * 
     *     if (entity.typeId == 'minecraft:player' && entity instanceof mc.Player) {
     *        console.warn(`${entity.name} ha cambiado de componentes: ${JSON.stringify(events)}`);
     *     }
     * });
     * ```
     */
    public getEntityEvents(callback: (args: mc.DataDrivenEntityTriggerAfterEvent) => void): void {
        this.dataEventsManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un item se remueve o añade a un inventario de un jugador de forma simplificada.
     * @param {(args: mc.PlayerInventoryItemChangeAfterEvent) => void} callback Los eventos relacionados a ejecutar.
     * @returns {void}
     * @author HaJuegos - 01-04-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onPlyInvChange((args) => {
     *     const previusItem = args.beforeItemStack;
     *     const newItem = args.itemStack;
     *     const ply = args.player;
     *     const slotI = args.slot;
     *     const invType = args.inventoryType;
     * 
     *     console.warn(`${ply.name} previamente tenía el item ${previusItem.typeId} en el slot ${slotI} en el inventario ${invType}; Y ahora tiene el item ${newItem.typeId} en su lugar`);
     * });
     * ```
     */
    public onPlyInvChange(callback: (args: mc.PlayerInventoryItemChangeAfterEvent) => void): void {
        this.changeInvManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando una entidad obtiene items de forma simplificada.
     * @param {(args: mc.EntityItemPickupAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 19-06-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onGetItemEntity((args) => {
     *      const item = args.items;
     *      const entity = args.entity;
     *      
     *      console.log(`${entity.typeId} ha agarrado los items ${JSON.stringify(item)}.`);
     * });
     * ```
     */
    public onGetItemEntity(callback: (args: mc.EntityItemPickupAfterEvent) => void): void {
        this.onGetItem.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando una entidad dropea items de forma simplificada.
     * @param {(args: mc.EntityItemDropAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 19-06-2026 
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onDropItemEntity((args) => {
     *      const item = args.items;
     *      const entity = args.entity;
     *      
     *      console.log(`${entity.typeId} ha dropeado los items ${JSON.stringify(item)}.`);
     * });
     * ```
     */
    public onDropItemEntity(callback: (args: mc.EntityItemDropAfterEvent) => void): void {
        this.onDropItem.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un jugador se une al mundo de forma simplificada.
     * @param {(args: mc.PlayerJoinAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 21-06-2026 
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onPlayerJoinsWorld((args) => {
     *      const name = args.playerName;
     *      
     *      console.log(`${name} entró al mundo.`);
     * });
     * ```
     */
    public onPlayerJoinsWorld(callback: (args: mc.PlayerJoinAfterEvent) => void): void {
        this.playerJoinsManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando un jugador se va del mundo de forma simplificada.
     * @param {(args: mc.PlayerLeaveAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 21-06-2026 
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onPlayerLeavesWorld((args) => {
     *      const name = args.playerName;
     *
     *      console.log(`${name} salió del mundo.`);
     * });
     * ```
     */
    public onPlayerLeavesWorld(callback: (args: mc.PlayerLeaveAfterEvent) => void): void {
        this.playerLeavesManager.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando una entidad se carga en el mundo de forma simplificada.
     * @param {(args: mc.EntityLoadAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 21-07-2026 
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onEntityLoadInWorld((args) => {
     *      const typeId = args.entity;
     *
     *      console.log(`${typeId} se cargó en el mundo previamente.`);
     * });
     * ```
     */
    public onEntityLoadInWorld(callback: (args: mc.EntityLoadAfterEvent) => void): void {
        this.entityLoadWorld.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando una entidad se curó de diferentes formas de forma simplificada.
     * @param {(args: mc.EntityHealBeforeEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @author HaJuegos - 19-06-2026
     * @public
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onEntityHeals((args) => {
     *      const sourceHealh = args.healSource;
     *      const entity = args.healedEntity;
     * 
     *      console.log(`${entity.typeId} se regeneró por vía ${sourceHealh.cause}.`);      
     * });
     * ```
     */
    public onEntityHeals(callback: (args: mc.EntityHealAfterEvent) => void): void {
        this.entityHealh.register(callback);
    }

    /**
     * Método auxiliar que ejecuta los eventos relacionados cuando una entidad es removida del mundo detectando solo su ID de forma simplificada.
     * @param {(args: mc.EntityRemoveAfterEvent) => void} callback Los eventos relacionados.
     * @returns {void}
     * @public
     * @author HaJuegos - 06-08-2026
     * @afterEvent Método que detecta el evento después de que suceda. Obteniendo la información sin permitir modificarla en su mayoría.
     * @example
     * ```ts
     * afterEventsSimplified.onEntityRemove((args) => {
     *      const typeID = args.typeId;
     *      const entityID = args.removedEntityId;
     * 
     *      console.log(`${typeId} fue eliminado del mundo, su id era ${entityID}.`);      
     * });
     * ```
     */
    public onEntityRemove(callback: (args: mc.EntityRemoveAfterEvent) => void): void {
        this.entityRemove.register(callback);
    }
}

export const afterEventsSimplified = new AfterEventsSimplified();