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
     * @type {?gametest.Test}
     * @author HaJuegos - 14-03-2026
     * @private
     */
    private testContext?: gametest.Test;

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
     * @async Es asincrono debido a que habra un al momento de spawnear el jugador falso. En caso de que no este creado el gametest run.
     * @gametestEvent Es un metodo gametest, usando estructuras de pruebas por medio del comando /gametest run.
     * @example
     * ```ts
     * // Esto genera un jugador de pruebas con sus respectivos datos para usar.
     * const fakePly = fakePlysSimplified.createFakePly('Jugador Prueba', mc.GameMode.Survival);
     * ```
     */
    public async createFakePly(namePly: string, gamemodePly: mc.GameMode, defaultSpawnLocation?: mc.Vector3): Promise<gametest.SimulatedPlayer | undefined> {
        const registrationTrace = new Error().stack;

        worldToolsSimplified.setRun(() => {
            const dime = mc.world.getDimension('overworld');

            if (!this.isPlaced) {
                dime.runCommand(`gametest run ha:fakeplys`);
                this.isPlaced = true;
            }
        });

        return new Promise((r) => {
            worldToolsSimplified.setDelay(() => {
                try {
                    if (!this.testContext) {
                        throw new Error("Hubo un error al ejecutar el comando 'gametest run'. Posiblemente a un error interno por lag o porque hace falta la estructura 'ha:void' en tu add-on.");
                    }

                    const fakePly = this.testContext.spawnSimulatedPlayer({ x: 0, y: 1, z: 0 }, namePly, gamemodePly);

                    if (!fakePly) {
                        throw new Error(`No se pudo spawnear el jugador ${namePly}. Verifica si todos los datos son correctos. Si todo esta bien, puede ser a un error interno.`);
                    }

                    if (defaultSpawnLocation) {
                        fakePly?.teleport(defaultSpawnLocation);
                    } else {
                        fakePly?.runCommand(`tp @r[name=!"${fakePly?.name}"]`);
                    }

                    r(fakePly);
                } catch (e) {
                    CatLogHandler.handleError(e, 'createFakePly', registrationTrace);
                    r(undefined);
                }
            }, worldToolsSimplified.convertSecondsToTicks(1.15));
        });
    }
}

export const fakePlysSimplified = new FakePlysManager();