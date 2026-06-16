import * as mc from '@minecraft/server';
import * as debug from '@minecraft/debug-utilities';

import { worldToolsSimplified } from './worldToolsSimplifiedManager';

/**
 * Clase que maneja los eventos principales simplifcados de herramientas de depuracion posibles para los add-ons.
 * @author HaJuegos - 14-03-2026
 */
class DebugToolsSimplified {
    /**
     * Variable que almacena los jugadores con las hitboxes activas.
     * @type {Map<string, number>}
     * @private
     * @author HaJuegos - 15-06-2026
     */
    private playerHitboxLoops = new Map<string, number>();

    /**
     * Variable que almacena las hitboxes activas de un jugador activo con las hitboxes activas.
     * @type {Map<string, Map<mc.Entity, debug.DebugBox>>}
     * @private
     * @author HaJuegos - 15-06-2026
     */
    private playerActiveBoxes = new Map<string, Map<mc.Entity, debug.DebugBox>>();

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
        const plyId = ply.id;

        if (this.playerHitboxLoops.has(plyId)) {
            this.stopHitboxes(ply);
        }

        const activeBoxes = new Map<mc.Entity, debug.DebugBox>();

        const loopId = worldToolsSimplified.setLoop(() => {
            if (!ply.isValid) {
                this.stopHitboxes(ply);
                return;
            }

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
                    box.color = { red: 255, green: 255, blue: 255, alpha: 1 };
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

        this.playerHitboxLoops.set(plyId, loopId);
    }

    /**
     * Metodo auxiliar que desactiva las hitboxes creadas en el mundo para todos los jugadores.
     * @author HaJuegos - 14-03-2026 
     * @public
     * @example
     * ```ts
     * debugToolsSimplified.stopHitBoxes(); // Quita TODAS las hitboxes del mundo.
     * debugToolsSimplified.stopHitBoxes(ply); // Quita todas las hitboxes de ese jugador en concreto.
     * ```
     */
    public stopHitboxes(ply?: mc.Player): void {
        if (ply) {
            const loopId = this.playerHitboxLoops.get(ply.id);

            if (loopId != undefined) {
                worldToolsSimplified.stopLoop(loopId);
                this.playerHitboxLoops.delete(ply.id);
            }

            const activeBoxes = this.playerActiveBoxes.get(ply.id);

            if (activeBoxes) {
                for (const [mob, box] of activeBoxes) {
                    box.remove();
                }

                this.playerActiveBoxes.delete(ply.id);
            }
        } else {
            for (const [plyId, loopId] of this.playerHitboxLoops) {
                worldToolsSimplified.stopLoop(loopId);
            }

            this.playerHitboxLoops.clear();
            this.playerActiveBoxes.clear();
            debug.debugDrawer.removeAll();
        }
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