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

    /**
     * Eventos que se inicializan cuando la clase es llamada o inicializada.
     * @constructor
     */
    constructor () {
        this.startUpManager = new BaseEventManager<mc.StartupEvent>(mc.system.beforeEvents.startup, "BeforeStartup");
        this.shutDownManager = new BaseEventManager<mc.ShutdownEvent>(mc.system.beforeEvents.shutdown, "BeforeShutdown");
        this.interactBlockManager = new BaseEventManager<mc.PlayerInteractWithBlockBeforeEvent>(mc.world.beforeEvents.playerInteractWithBlock, "BeforeInteractBlock");
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando el add-on se carga por primera vez
     * @param {(args: mc.StartupEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
    */
    public onAddonStarts(callback: (args: mc.StartupEvent) => void): void {
        this.startUpManager.register(callback);
    }

    /**
     * Metodo auxiliar que ejecuta los eventos relacionados cuando un mundo o servidor se cierra de forma simplificada.
     * @param {(args: mc.ShutdownEvent) => void} callback Los argumentos del evento y su logica.
     * @author HaJuegos - 11-03-2026
     * @public
    */
    public onAddonStops(callback: (args: mc.ShutdownEvent) => void): void {
        this.shutDownManager.register(callback);
    }

    /**
    * Metodo auxiliar que ejecuta los eventos relacionados cuando se interactua con un bloque antes de que pase de forma simplificada.
    * @param {(args: mc.PlayerInteractWithBlockBeforeEvent) => void} callback Los argumentos del evento y su logica.
    * @author HaJuegos - 11-03-2026
    * @public
   */
    public onInteractBlock(callback: (args: mc.PlayerInteractWithBlockBeforeEvent) => void): void {
        this.interactBlockManager.register(callback);
    }
}

export const beforeEventsSimplified = new BeforeEventsSimplified();