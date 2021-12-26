/**
 * @author Shokkunn
 */

import { Single, StoryPayload } from "../statics/types";
import universeBase from "./universeBase";

export default class Story extends universeBase {
  multiples: Array<Single>;
  constructor(_id: number | string, payload: StoryPayload) {
    super(
      _id,
      "stories",
      payload.name,
      payload.description,
      payload.class || "any",
      payload.emoji || "📜",
      payload.spoiler,
      payload.grade,
      payload.variant.isVariant
    );
    this.multiples = payload.multiples;
  }
}
