/**
 * @author Shokkunn
 */

import { CharacterPayload, MoodType } from "../statics/types";
import universeBase from "./universeBase";

export default class Character extends universeBase {
    personality: {
        greetings: Array<string> 
        farewells: Array<string>
    }
    constructor(_id: number | string, payload: CharacterPayload) {
        super(_id, 'characters', payload.name, payload.variant.isVariant, payload.link)
        this.personality = payload.personality;

        
    }
    /**
     * getVariant()
     * @param MoodType | mood you want to query.
     * @returns character class that has the mood that you queried.
     */

    async getVariant(MoodType: MoodType): Promise<Character> {
        const moodVariant: CharacterPayload = await super.getVariant(MoodType);
        return new Character(moodVariant._id, moodVariant);
    }

    get Personality() {
        return this.personality;
    }

    getRandGreetings() {
        return this.getGreetings(Math.floor(Math.random() * this.personality?.greetings.length))

    }

    getRandFarewells() {
        return this.getFarewells(Math.floor(Math.random() * this.personality?.farewells.length))

    }

    getFarewells(i: number) {
        return this.personality.farewells[i];

    }

    getGreetings(i: number) {
        return this.personality.greetings[i];
    }


}