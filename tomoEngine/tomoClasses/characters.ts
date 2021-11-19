/**
 * @author Shokkunn
 */

import { characterPayload, moodType } from "../statics/types";
import universeBase from "./universeBase";

export default class Character extends universeBase {
    constructor(_id: number, payload: characterPayload) {
        super(_id, 'character', payload.name, payload.variant.isVariant, payload.link)

        
    }
    /**
     * getVariant()
     * @param moodType | mood you want to query.
     * @returns character class that has the mood that you queried.
     */

    async getVariant(moodType: moodType): Promise<Character> {
        const moodVariant: characterPayload = await super.getVariant(moodType);
        return new Character(moodVariant._id, moodVariant);
    }


}