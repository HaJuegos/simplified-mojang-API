# 🛠️ Simplified Mojang API

> [!WARNING]
> ⚠️ **WORK IN PROGRESS!** ⚠️
> This repository is constantly evolving and undergoing active updates, so some features or simplified methods may be missing or not yet implemented. Please keep this in mind when using it!

A simple tool that makes it easier to use the Mojang scripting API for Minecraft Bedrock, by providing pre-built and simplified classes.

## What is this?

It's an informal or professional repository designed to simplify the logic of the native `@minecraft/server` module by integrating various pre-built classes and methods to save time and reduce code, as well as tools I've customized myself for use in any add-on.

## Install:

Just run this in your terminal:

```bash
npm install simplified-mojang-api@latest (In case of errors, use --force)
```

> (Make sure you also have the base @minecraft/server stuff installed!)

## Build Setup:

Because this API includes physical files (a .mcstructure for fake players) and uses @minecraft/vanilla-data for typing, you must configure your bundler (like esbuild) properly.

- Add these scripts to your Add-on's package.json:
    - Copy the physical assets, You need to move the API's structures to your behavior pack
        > You need to move the API's structures to your behavior pack

    ```json
    "copy:api-assets": "node -e \"const fs = require('fs'); const src = 'node_modules/simplified-mojang-api/structures'; if (fs.existsSync(src)) fs.cpSync(src, 'behaviors/YOUR_ADDON/structures', { recursive: true, force: false });\""
    ```

    - Compile with esbuild
        > Exclude the native Minecraft modules, but do not exclude @minecraft/vanilla-data so it gets bundled as pure strings.

    ```json
    "compile": "npm run copy:api-assets && esbuild behaviors/YOUR_ADDON/src/main.ts --bundle --format=esm --outfile=behaviors/YOUR_ADDON/scripts/main.js --target=es2020 --external:@minecraft/server --external:@minecraft/server-ui --external:@minecraft/server-gametest --external:@minecraft/server-graphics --external:@minecraft/server-net --external:@minecraft/debug-utilities --external:@minecraft/gameplay-utilities --sourcemap"
    ```

## API Examples:

### Fast Offhand Items

> Make items jump to the offhand with a single click.

```ts
import { customEventsManager } from "simplified-mojang-api";

// Any item with these words in its ID becomes a fast-equip item
customEventsManager.fastItemsSystem(["totem", "shield", "arrow"]);
```

### Visual Debugging (Hitboxes)

> Easily show visual hitboxes for all nearby entities using the debug module. Great for testing custom mob sizes or attack ranges!

```ts
import { debugToolsSimplified } from "simplified-mojang-api";

// Shows hitboxes to the specific player within a 50 block radius
debugToolsSimplified.showHitboxes(player, 50);

// Turn them off when you're done testing
// debugToolsSimplified.stopHitboxes();
```

### Fake Player Spawner

> Instantly spawn a simulated player into the world using the gametest API. Perfect for testing multiplayer mechanics solo.

```ts
import * as mc from "@minecraft/server";
import { fakePlysSimplified } from "simplified-mojang-api";

// Spawns a fake player named "Dummy" in Survival mode
fakePlysSimplified.createFakePly("Dummy", mc.GameMode.Survival);
```

### Real-Time Timer

> Creates a timer that's saved directly on the player and runs in real-time, no need to mess with scoreboard ticks! Set an initial value and you're good to go—super easy and fast to use.

```ts
import { customEventsManager } from "simplified-mojang-api";

const paramsTimer: CustomTimerParam = {
    sourcePly: player, // The player who gets the timer
    timerId: "ha:timer_unique", // Unique ID for the timer, just in case you run more than one
    initialMns: 2, // Starting minutes for the timer, or the minutes to display
    forceRestart: true, // (Optional) Need to update the time? E.g., new minutes or seconds? Set this to true to restart the timer.

    // (Optional) Events triggered every time a second goes by.
    onSecondPass: (ply, timer) => {
        console.log(`A second has passed! The timer now is ${timer}`);
    },
};

// Starts the timer for the player. HEADS UP: this is an under-the-hood timer so it's invisible by default. To show it on a UI, use events like onSecondPass.
customEventsManager.startTimerLocal(paramsTimer);
```

## Contributing

Found a bug or want to wrap a new Mojang method? PRs are super welcome!

> Author: HaJuegos
> License: MIT
