import { BaseEventManager } from "../core/eventsManager";

import * as mc from "@minecraft/server";

/**
 * Clase principal que maneja los eventos before de forma simplificada para mejor manejo de errores.
 * @class BeforeEventsSimplified
 * @author HaJuegos - 11-03-2026
 * @export
 */
class BeforeEventsSimplified {
    private startUpManager: BaseEventManager<mc.StartupEvent>;
    private shutDownManager: BaseEventManager<mc.ShutdownEvent>;
    private interactBlockManager: BaseEventManager<mc.PlayerInteractWithBlockBeforeEvent>;
    private chatSendManager: BaseEventManager<mc.ChatSendBeforeEvent>;
    private itemUseManager: BaseEventManager<mc.ItemUseBeforeEvent>;
    private explosionManager: BaseEventManager<mc.ExplosionBeforeEvent>;
    private interactEntityManager: BaseEventManager<mc.PlayerInteractWithEntityBeforeEvent>;
    private effectAddManager: BaseEventManager<mc.EffectAddBeforeEvent>;
    private placeBlockManager: BaseEventManager<mc.PlayerPlaceBlockBeforeEvent>;
    private breakBlockManager: BaseEventManager<mc.PlayerBreakBlockBeforeEvent>;
    private entityHurtManager: BaseEventManager<mc.EntityHurtBeforeEvent>;
    private entityItemPickUpManager: BaseEventManager<mc.EntityItemPickupBeforeEvent>;

    /**
     * Eventos que se inicializan cuando la clase es llamada o inicializada.
     * @constructor
     */
    constructor () {
        this.startUpManager = new BaseEventManager<mc.StartupEvent>(mc.system.beforeEvents.startup, "BeforeStartup");
        this.shutDownManager = new BaseEventManager<mc.ShutdownEvent>(mc.system.beforeEvents.shutdown, "BeforeShutdown");
        this.interactBlockManager = new BaseEventManager<mc.PlayerInteractWithBlockBeforeEvent>(mc.world.beforeEvents.playerInteractWithBlock, "BeforeInteractBlock");
        this.chatSendManager = new BaseEventManager<mc.ChatSendBeforeEvent>(mc.world.beforeEvents.chatSend, "BeforeChatSend");
        this.itemUseManager = new BaseEventManager<mc.ItemUseBeforeEvent>(mc.world.beforeEvents.itemUse, "BeforeItemUse");
        this.explosionManager = new BaseEventManager<mc.ExplosionBeforeEvent>(mc.world.beforeEvents.explosion, "BeforeExplodes");
        this.interactEntityManager = new BaseEventManager<mc.PlayerInteractWithEntityBeforeEvent>(mc.world.beforeEvents.playerInteractWithEntity, "BeforeInteractEntity");
        this.effectAddManager = new BaseEventManager<mc.EffectAddBeforeEvent>(mc.world.beforeEvents.effectAdd, "BeforeAddEffect");
        this.placeBlockManager = new BaseEventManager<mc.PlayerPlaceBlockBeforeEvent>(mc.world.beforeEvents.playerPlaceBlock, "BeforePlayerPlaceBlock");
        this.breakBlockManager = new BaseEventManager<mc.PlayerBreakBlockBeforeEvent>(mc.world.beforeEvents.playerBreakBlock, "BeforePlayerBreakBlock");
        this.entityHurtManager = new BaseEventManager<mc.EntityHurtBeforeEvent>(mc.world.beforeEvents.entityHurt, "BeforeEtntityHurt");
        this.entityItemPickUpManager = new BaseEventManager<mc.EntityItemPickupBeforeEvent>(mc.world.beforeEvents.entityItemPickup, "BeforeEntityItemPickup");
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando el add-on se carga por primera vez
     * @param {(args: mc.StartupEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onAddonStarts((args) => {
     *   console.warn('El addon esta iniciando');
     * });
     * ```
    */
    public onAddonStarts(callback: (args: mc.StartupEvent) => void): void {
        this.startUpManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un mundo o servidor se cierra de forma simplificada.
     * @param {(args: mc.ShutdownEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onAddonStops((args) => {
     *   console.warn('El addon se esta detendiendo');
     * });
     * ```
    */
    public onAddonStops(callback: (args: mc.ShutdownEvent) => void): void {
        this.shutDownManager.register(callback);
    }

    /**
    * Metodo auxiliar que ejecuta los eventos relacionados cuando se interactua con un bloque antes de que pase de forma simplificada.
    * @param {(args: mc.PlayerInteractWithBlockBeforeEvent) => void} callback Los argumentos del evento y su logica.
    * @author HaJuegos - 11-03-2026
    * @public
    * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
    * @example
    * ```ts
    * beforeEventsSimplified.onInteractBlock((args) => {
    *   console.warn(`Se esta interactuando con el bloque ${args.block.typeId}`);
    * });
    * ```
   */
    public onInteractBlock(callback: (args: mc.PlayerInteractWithBlockBeforeEvent) => void): void {
        this.interactBlockManager.register(callback);
    }

    /**
     * Metodo auxiliar que controla los eventos del chat, manejando los mensajes enviados antes de que se muestren.
     * @param {(args: mc.ChatSendBeforeEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 14-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.chatManager((args) => {
     *    console.warn(`El usuario ${args.sender.name} ha enviado el mensaje ${args.message}`);
     *    args.cancel = true; // El mensaje que se envio por el jugador, es cancelada.
     * });
     * ```
     */
    public chatManager(callback: (args: mc.ChatSendBeforeEvent) => void): void {
        this.chatSendManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando antes de usar un item forma simplificada.
     * @param {(args: mc.ItemUseBeforeEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 15-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onUseItem((args) => {
     *   console.warn(`Se esta usando el item ${args.itemStack.typeId}.`);
     *   args.cancel = true;
     * });
     * ```
     */
    public onUseItem(callback: (args: mc.ItemUseBeforeEvent) => void): void {
        this.itemUseManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando algo esta apunto de explotar de forma simplificada.
     * @param {(args: mc.ExplosionBeforeEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 17-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onExplosion((args) => {
     *   const source = args.source;
     * 
     *   if (source && source.typeId == 'minecraft:creeper') {
     *     console.warn(`Un creeper esta apunto de explotar.`);
     *     args.cancel = true; // Ya no va a explotar.
     *   }
     * });
     * ```
     */
    public onExplosion(callback: (args: mc.ExplosionBeforeEvent) => void): void {
        this.explosionManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un jugador va a interactuar con una entidad de forma simplificada.
     * @param {(args: mc.PlayerInteractWithEntityBeforeEvent) => void} callback Los eventos relacionados a ejecutar.
     * @author HaJuegos - 20-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onInteractEntity((args) => {
     *     const ply = args.player;
     *     const hitEntity = args.target;
     * 
     *     console.warn(`${ply.name} esta interactuando con ${hitEntity.typeId}.`);
     * 
     *     args.cancel = true; // ya no se puede.
     * });
     * ```
     */
    public onInteractEntity(callback: (args: mc.PlayerInteractWithEntityBeforeEvent) => void): void {
        this.interactEntityManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un efecto esta apunto de darse a una entidad de forma simplificada.
     * @param {(args: mc.EffectAddBeforeEvent) => void} callback Los eventos relacionados.
     * @author HaJuegos - 20-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onEffectAdds((args) => {
     *     console.warn(`${args.entity.typeId} tendra el efecto ${args.effect.displayName}.`);
     *     args.cancel = true; // Ahora ya no sucede.
     * });
     * ```
     */
    public onEffectAdds(callback: (args: mc.EffectAddBeforeEvent) => void): void {
        this.effectAddManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un jugador va a colocar un bloque de forma simplificada.
     * @param {(args: mc.PlayerPlaceBlockBeforeEvent) => void} callback Los eventos relacionados.
     * @author HaJuegos - 20-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onPlaceBlock((args) => {
     *     console.warn(`${args.player.name} va a colocar el bloque ${args.block.typeId}.`);
     *     args.cancel = true; // Ahora ya no puede colocarlo
     * });
     * ```
     */
    public onPlaceBlock(callback: (args: mc.PlayerPlaceBlockBeforeEvent) => void): void {
        this.placeBlockManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un jugador va a romper un bloque de forma simplificada. 
     * @param {(args: mc.PlayerBreakBlockBeforeEvent) => void} callback Los eventos relacionados.
     * @author HaJuegos - 23-03-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onBreakBlock((args) => {
     *     console.warn(`${args.player.name} va a romper el bloque ${args.block.typeId}.`);
     *     args.cancel = true; // Ahora ya no puede romperlo
     * });
     * ```
     */
    public onBreakBlock(callback: (args: mc.PlayerBreakBlockBeforeEvent) => void): void {
        this.breakBlockManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando una entidad va a ser lastimada de forma simplificada.
     * @param {(args: mc.EntityHurtBeforeEvent) => void} callback Los eventos relacionados.
     * @author HaJuegos - 19-06-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onEntityHurt((args) => {
     *      const hurtEntity = args.hurtEntity;
     *      const source = args.damageSource;
     *      const sourceEntity = source.damagingEntity;
     * 
     *      if (hurtEntity && sourceEntity) {
     *          console.log(`${sourceEntity.typeId} va a lastimar a ${hurtEntity.typeId}.`);
     * 
     *          args.cancel = true; // Ya no funciona       
     *      }
     * });
     * ```
     */
    public onEntityHurt(callback: (args: mc.EntityHurtBeforeEvent) => void): void {
        this.entityHurtManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando una entidad va a agarrar un item forma simplificada.
     * @param {(args: mc.EntityItemPickupBeforeEvent) => void} callback Los eventos relacionados.
     * @author HaJuegos - 19-06-2026
     * @public
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @example
     * ```ts
     * beforeEventsSimplified.onItemPickupEntity((args) => {
     *      const item = args.item;
     *      const entity = args.entity;
     * 
     *      console.log(`${entity.typeId} va a obtener el item ${item.typeId}.`);
     *      args.cancel = true; // Ya no funciona      
     * });
     * ```
     */
    public onItemPickupEntity(callback: (args: mc.EntityItemPickupBeforeEvent) => void): void {
        this.entityItemPickUpManager.register(callback);
    }

    // Metodos no auxiliares

    /**
     * Metodo auxiliar que registra y ejecuta los eventos relacionados cuando se quiere registrar un custom component de un bloque.
     * @param {string} nameComponent Nombre del componente en cuestion a registrar.
     * @param {mc.BlockCustomComponent} eventsComponent Los eventos del componente que se van a ejecutar.
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @author HaJuegos - 17-03-2026
     * @public
     * @example
     * ```ts
     * // Metodo casual
     * beforeEventsSimplified.createBlockComponent('ha:custom_component', {
     *    onBreak(arg) {
     *       console.warn(`El bloque ${args.block.typeId} se rompio.`);
     *    }
     * } as mc.BlockCustomComponent);
     * 
     * // Metodo mas ordenado
     * const events: mc.BlockCustomComponent = {
     *    onBreak(arg) {
     *       console.warn(`El bloque ${args.block.typeId} se rompio.`);
     *    }
     * }
     * 
     * beforeEventsSimplified.createBlockComponent('ha:custom_component', events);
     * ```
     */
    public createBlockComponent(nameComponent: string, eventsComponent: mc.BlockCustomComponent): void {
        this.onAddonStarts((args) => {
            args.blockComponentRegistry.registerCustomComponent(nameComponent, eventsComponent);
        });
    }

    /**
     * Metodo auxiliar que registra y ejecuta los eventos relacionados cuando se quiere registrar un custom component de un item.
     * @param {string} nameComponent Nombre del componente en cuestion a registrar.
     * @param {mc.ItemCustomComponent} eventsComponent Los eventos del componente que se van a ejecutar.
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @author HaJuegos - 17-03-2026
     * @public
     * @example
     * ```ts
     * // Metodo casual
     * beforeEventsSimplified.createItemComponent('ha:custom_component', {
     *    onConsume(arg) {
     *       console.warn(`El item ${args.itemStack.typeId} fue consumido.`);
     *    }
     * } as mc.ItemCustomComponent);
     * 
     * // Metodo mas ordenado
     * const events: mc.ItemCustomComponent = {
     *    onConsume(arg) {
     *       console.warn(`El item ${args.itemStack.typeId} fue consumido.`);
     *    }
     * }
     * 
     * beforeEventsSimplified.createItemComponent('ha:custom_component', events);
     * ```
     */
    public createItemComponent(nameComponent: string, eventsComponent: mc.ItemCustomComponent): void {
        this.onAddonStarts((args) => {
            args.itemComponentRegistry.registerCustomComponent(nameComponent, eventsComponent);
        });
    }

    /**
     * Metodo auxiliar que registra y ejecuta los eventos relacionados cuando se quiere registrar un comando custom al juego.
     * @param {mc.CustomCommand} commandData Los datos del comando a registrar
     * @param {(origin: mc.CustomCommandOrigin, ...args: any[]) => mc.CustomCommandResult | undefined} callback Los eventos a ejecutar despues de haber sido activado o usado el comando. 
     * @param {?Record<string, string[]>} [customEnums] (Opcional) Opciones o valores que se registran junto con el comando en caso de ser necesario. Por ej: para que aparezca "ha juegos" al momento de poner este comando, lo concidere un valor rellenable automatico.
     * @beforeEvent Metodo que detecta el evento antes de que suceda. Permitiendo cancelar o personalizar el evento antes de que se vea en el juego.
     * @author HaJuegos - 17-03-2026
     * @public
     * @example
     * ```ts
     * const commandData: mc.CustomCommand = {
     *     name: 'ha:command_test',
     *     description: 'Este es un comando de prueba',
     *     permissionLevel: mc.CommandPermissionLevel.Admin
     * };
     * 
     * beforeEventsSimplified.createCustomCommand(commandData, ((args => {
     *     const entity = args.sourceEntity as mc.Player;
     * 
     *     console.warn(`El jugador ${entity.name} ha usado el comando custom.`);
     * })));
     * ```
     */
    public createCustomCommand(
        commandData: mc.CustomCommand,
        callback: (origin: mc.CustomCommandOrigin, ...args: any[]) => mc.CustomCommandResult | undefined,
        customEnums?: Record<string, string[]>
    ): void {
        this.onAddonStarts((args) => {
            if (customEnums) {
                for (const [enumName, enumValues] of Object.entries(customEnums)) {
                    args.customCommandRegistry.registerEnum(enumName, enumValues);
                }
            }

            args.customCommandRegistry.registerCommand(commandData, callback);
        });
    }

    /**
     * Metodo auxiliar que registra una nueva dimension custom en el mundo. Basado en su prefix.
     * @param {string} prefixDimension Prefix de la dimension en cuestion a crear.
     * @returns {void}
     * @author HaJuegos - 15-07-2026
     * @public
     * @example
     * ```ts
     * // Esto creara la nueva dimension 'ha:backrooms'. Pero es una dimension totalmente vacia. Debes crear todo a base de feature y feature rules.
     * beforeEventsSimplified.createCustomDimension('ha:backrooms');
     * ```
     */
    public createCustomDimension(prefixDimension: string): void {
        this.onAddonStarts((args) => {
            args.dimensionRegistry.registerCustomDimension(prefixDimension);
        });
    }
}

export const beforeEventsSimplified = new BeforeEventsSimplified();