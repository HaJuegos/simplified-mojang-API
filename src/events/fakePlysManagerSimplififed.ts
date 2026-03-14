import * as mc from "@minecraft/server";
import * as gametest from "@minecraft/server-gametest";

/**
 * Clase hijo que controla los eventos simplificados sobre jugadores falsos por medio de scripts.
 * @author HaJuegos - 13-03-2026
 */
class FakePlysManager {
    /**
     * Variable privada que contiene la informacion de un gametest command generado.
     * @type {?gametest.Test}
     * @author HaJuegos - 14-03-2026
     * @private
     */
    private testContext?: gametest.Test;

    /**
     * Eventos iniciales de la clase cuando es inicializada o llamada.
     * @constructor
     */
    constructor () {
        gametest.register('ha', 'fakeplys', (test) => {
            this.testContext = test;
        })
            .maxTicks(99999999)
            .maxAttempts(1)
            .structureName('ha:void');
    }

    /**
     * Metodo auxiliar que crea un nuevo tipo de jugador falso para metodos de pruebas.
     * @param {string} namePly Nombre a asignar al jugador de pruebas.
     * @param {mc.GameMode} gamemodePly El modo de juego que tendra el jugador de pruebas.
     * @param {?mc.Vector3} [defaultSpawnLocation] (Opcional) Coordenadas donde aparecera el jugador de pruebas. Por defecto, ira a un jugador aleatorio
     * @returns {gametest.SimulatedPlayer} Los datos del jugador falso generado.
     * @author HaJuegos - 13-03-2026
     * @public
     * @gametestEvent Es un metodo gametest, usando estructuras de pruebas por medio del comando /gametest run.
     * @example
     * ```ts
     * // Esto genera un jugador de pruebas con sus respectivos datos para usar.
     * const fakePly = fakePlysSimplified.createFakePly('Jugador Prueba', mc.GameMode.Survival);
     * ```
     */
    public createFakePly(namePly: string, gamemodePly: mc.GameMode, defaultSpawnLocation?: mc.Vector3): gametest.SimulatedPlayer | undefined {
        if (this.testContext) {
            const fakePly = this.testContext.spawnSimulatedPlayer({ x: 0, y: 1, z: 0 }, namePly, gamemodePly);

            if (defaultSpawnLocation) {
                fakePly.teleport(defaultSpawnLocation);
            } else {
                fakePly.runCommand(`tp @r[name=!"${fakePly.name}"]`);
            }

            return fakePly;
        } else {
            throw new Error(`No se pudo generar el jugador de pruebas ${namePly}`);
        }
    }
}

export const fakePlysSimplified = new FakePlysManager();