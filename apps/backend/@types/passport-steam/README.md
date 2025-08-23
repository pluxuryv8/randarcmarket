# Installation
> `npm install --save @types/passport-steam`

# Summary
This package contains type definitions for passport-steam (https://github.com/liamcurry/passport-steam).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/passport-steam.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/passport-steam/index.d.ts)
````ts
import { Request } from "express";
import * as Passport from "passport";

declare class SteamStrategy<T extends SteamStrategy.SteamStrategyOptions> extends Passport.Strategy {
    constructor(options: T, validate: ValidateFn<T>);
}

declare namespace SteamStrategy {
    const Strategy: typeof SteamStrategy;
    const version: string;

    interface SteamStrategyOptions {
        returnURL: string;
        realm: string;
        apiKey: string;
        passReqToCallback?: boolean;
    }
}

type ValidateFn<T extends SteamStrategy.SteamStrategyOptions> = T["passReqToCallback"] extends true
    ? (req: Request, identifier: SteamIdentifier, profile: SteamProfile, done: DoneFn) => void
    : (identifier: SteamIdentifier, profile: SteamProfile, done: DoneFn) => void;

type DoneFn = (err: unknown, user?: Express.User | false | null) => void;

type SteamIdentifier = string;

interface SteamProfile {
    provider: "steam";
    _json: {
        steamid: string;
        communityvisibilitystate: number;
        profilestate: number;
        personaname: string;
        commentpermission: number;
        profileurl: string;
        avatar: string;
        avatarmedium: string;
        avatarfull: string;
        avatarhash: string;
        lastlogoff: number;
        personastate: number;
        realname: string;
        primaryclanid: string;
        timecreated: number;
        personastateflags: number;
        loccountrycode: string;
        locstatecode: string;
    };
    id: string;
    displayName: string;
    photos: Array<{ value: string }>;
}

export = SteamStrategy;

````

### Additional Details
 * Last updated: Thu, 22 Aug 2024 08:09:16 GMT
 * Dependencies: [@types/express](https://npmjs.com/package/@types/express), [@types/passport](https://npmjs.com/package/@types/passport)

# Credits
These definitions were written by [Jonas D.](https://github.com/nordowl).
