import * as mc from "@minecraft/server";
import * as gametest from "@minecraft/server-gametest";

import { CatLogHandler } from "../core/errorHandler";
import { worldToolsSimplified } from "./worldToolsSimplifiedManager";

/**
 * Clase hijo que controla los eventos simplificados sobre jugadores falsos por medio de scripts.
 * @author HaJuegos - 13-03-2026
 */
class FakePlysManager {
    /**
     * Variable privada que contiene la informacion de un gametest command generado.
     * @type {gametest.Test | undefined}
     * @author HaJuegos - 14-03-2026
     * @private
     */
    private testCxt?: gametest.Test | undefined = undefined;

    /**
     * Variable privada para verificar si el gametest run ya esta puesto en el mundo.
     * @type {boolean}
     * @author HaJuegos - 02-04-2026
     * @private
     */
    private isPlaced: boolean = false;

    /**
     * Eventos iniciales de la clase cuando es inicializada o llamada.
     * @constructor
     */
    constructor () { }

    /**
     * Metodo auxiliar que registra primero el contexto necesario de los gametest para podre generar los simulated players.
     * @returns {void}
     * @author HaJuegos - 21-07-2026
     * @private
     */
    private registerMainGametest(): void {
        const registrationTrace = new Error().stack;

        gametest.register('ha', 'fakeplys', (args) => {
            try {
                this.testCxt = args;
            } catch (e) {
                CatLogHandler.handleError(e, 'createFakePly', registrationTrace);
            }
        })
            .maxTicks(worldToolsSimplified.convertSecondsToTicks(99999))
            .structureName('ha:void');
    }

    /**
     * Metodo auxiliar que crea un nuevo tipo de jugador falso para metodos de pruebas.
     * @param {mc.Dimension} dimension Dimension donde se generara el jugador de pruebas.
     * @param {string} namePly Nombre a asignar al jugador de pruebas.
     * @param {mc.GameMode} gamemodePly El modo de juego que tendra el jugador de pruebas.
     * @param {?mc.Vector3} [defaultSpawnLocation] (Opcional) Coordenadas donde aparecera el jugador de pruebas. Por defecto, ira a un jugador aleatorio
     * @returns {gametest.SimulatedPlayer | undefined} Los datos del jugador falso generado en caso de que todo salga bien, sino sera undefined.
     * @author HaJuegos - 13-03-2026
     * @public
     * @gametestEvent Es un metodo gametest, usando estructuras de pruebas por medio del comando /gametest run.
     * @example
     * ```ts
     * // Esto genera un jugador de pruebas con sus respectivos datos para usar.
     * const fakePly = fakePlysSimplified.createFakePly('Jugador Prueba', Dimension, mc.GameMode.Survival);
     * ```
     */
    public createFakePly(namePly: string, dimension: mc.Dimension, gamemodePly: mc.GameMode, defaultSpawnLocation?: mc.Vector3): gametest.SimulatedPlayer | undefined {
        const registrationTrace = new Error().stack;

        try {
            this.registerMainGametest();

            if (!this.isPlaced) {
                dimension.runCommand(`gametest run ha:fakeplys`);
                this.isPlaced = true;
            }

            worldToolsSimplified.setDelay(() => {
                if (!this.testCxt) {
                    throw new Error("No se pudo generar el jugador falso. No se creó previamente el ambiente necesario para poderlo generar. Vuelve a intentarlo nuevamente. ¿Tienes guardado en tus estructuras el archivo 'void'?");
                }

                const fakePly = this.testCxt.spawnSimulatedPlayer({ x: 0, y: 1, z: 0 }, namePly, gamemodePly);

                if (defaultSpawnLocation) {
                    fakePly.tryTeleport(defaultSpawnLocation);
                } else {
                    fakePly.runCommand(`tp @r[name=!"${namePly}"]`);
                }
            }, worldToolsSimplified.convertSecondsToTicks(1));
        } catch (e) {
            CatLogHandler.handleError(e, 'createFakePly', registrationTrace);
            return;
        }
    }
}

export const fakePlysSimplified = new FakePlysManager();