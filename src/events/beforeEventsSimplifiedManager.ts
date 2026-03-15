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
}

export const beforeEventsSimplified = new BeforeEventsSimplified();