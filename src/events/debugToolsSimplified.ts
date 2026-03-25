import * as mc from '@minecraft/server';
import * as debug from '@minecraft/debug-utilities';

import { worldToolsSimplified } from './worldToolsSimplifiedManager';

/**
 * Clase que maneja los eventos principales simplifcados de herramientas de depuracion posibles para los add-ons.
 * @author HaJuegos - 14-03-2026
 */
class DebugToolsSimplified {
    /**
     * ID global del looping de las hitboxes en caso de activarse.
     * @type {?number}
     * @private
     */
    private idLoopHitboxes?: number;

    /**
     * Eventos iniciales de la clase cuando es llamada o inicializada.
     * @constructor
     */
    constructor () { }

    /**
     * Metodo auxiliar que activa las hitboxes de todas las entidades cercanas en un radio de 50 bloques a un jugador en concreto.
     * @param {mc.Player} ply Jugador en concreto a conciderar.
     * @param {number} [maxRadiusHitboxs=50] (Opcional) El radio maximo a conciderar para visualizar las hitboxes. Por defecto sera 50.
     * @author HaJuegos - 14-03-2026 
     * @public
     * @example
     * ```ts
     * const plys = world.getAllPlayers();
     * 
     * debugToolsSimplified.showHitboxes(plys[0]); // Solo este jugador podra ver las hitboxes.
     * ```
     */
    public showHitboxes(ply: mc.Player, maxRadiusHitboxs: number = 50): void {
        const activeBoxes = new Map<mc.Entity, debug.DebugBox>();

        this.idLoopHitboxes = worldToolsSimplified.setLoop(() => {
            const nearbyMobs = ply.dimension.getEntities({
                location: ply.location,
                maxDistance: maxRadiusHitboxs
            }).slice(0, 30);

            for (const mob of nearbyMobs) {
                if (!activeBoxes.has(mob) && mob.isValid) {
                    const bb = mob.getAABB();
                    const box = new debug.DebugBox({ x: 0, y: 0, z: 0 });

                    box.bound = { x: bb.extent.x * 2, y: bb.extent.y * 2, z: bb.extent.z * 2 };
                    box.scale = 1;
                    box.color = { red: 255, green: 255, blue: 255 };
                    box.visibleTo = [ply];
                    box.attachedTo = mob;
                    box.setLocation({ x: 0, y: bb.extent.y, z: 0 });

                    debug.debugDrawer.addShape(box, ply.dimension);

                    activeBoxes.set(mob, box);
                }
            }

            for (const [mob, box] of activeBoxes) {
                if (!mob.isValid) {
                    box.remove();
                    activeBoxes.delete(mob);
                    continue;
                }

                const dx = mob.location.x - ply.location.x;
                const dy = mob.location.y - ply.location.y;
                const dz = mob.location.z - ply.location.z;

                if (Math.sqrt(dx * dx + dy * dy + dz * dz) > maxRadiusHitboxs) {
                    box.remove();
                    activeBoxes.delete(mob);
                    continue;
                }

                const bb = mob.getAABB();

                box.bound = { x: bb.extent.x * 2, y: bb.extent.y * 2, z: bb.extent.z * 2 };
                box.setLocation({ x: 0, y: bb.extent.y, z: 0 });
            }
        }, 1);
    }

    /**
     * Metodo auxiliar que desactiva las hitboxes creadas en el mundo para todos los jugadores.
     * @author HaJuegos - 14-03-2026 
     * @public
     * @example
     * ```ts
     * debugToolsSimplified.stopHitBoxes(); // Quita todas las hitboxes a todos.
     * ```
     */
    public stopHitboxes(): void {
        if (this.idLoopHitboxes != undefined) {
            worldToolsSimplified.stopLoop(this.idLoopHitboxes);
            this.idLoopHitboxes = undefined;
        }

        debug.debugDrawer.removeAll();
    }

    /**
     * Metodo que altera el estado de activo o desactivado del watchDogTerminate, en caso de lag spikes con scripts, para permitir el cierre o no del mundo o servidor cuando pase. Esto es solo recomendable usarlo en testeos, no se recomienda desactivarlo en mundos/servidores casuales o normales.
     * @param {boolean} newState El estado proximo a cambiar.
     * @author HaJuegos - 14-03-2026
     * @public
     * @example
     * ```ts
     * debugToolsSimplified.watchDogState(false) // ya no habra cierre por lag spikes o problemas con scripts
     * ```
     */
    public watchDogState(newState: boolean): void {
        mc.system.beforeEvents.watchdogTerminate.subscribe((arg) => {
            arg.cancel = newState;
        });
    }
}

export const debugToolsSimplified = new DebugToolsSimplified();