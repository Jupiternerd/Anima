/**
 * @author Shokkunn
 */

import Queries from "../queries";
import { CharacterInUser, ItemInUser, UserUniversePayload } from "../statics/types";
import universeBase from "./universeBase";
 
export default class DBUsers extends universeBase {
    _tomodachis: Array<CharacterInUser>
    _reservedTomo: Array<CharacterInUser>
    _inventory: Array<ItemInUser>
    username: string;
    constructor(_id: number | string, payload: UserUniversePayload) {
        super(_id, 'users', payload.discord_username, "🧍");
        this.username = payload.discord_username;
        this._tomodachis = payload.characters;
        this._reservedTomo = payload.reserved;
        this._inventory = payload.inventory;
         
 
    }

    get inventory() {
      return this._inventory;
      
    }

    get tomodachis() {
      return this._tomodachis;
    }

    getMainTomoDachi() {
      return this.tomodachis[0]

    }

    getTomoFromDachis(originalID: number) {
      let find = this.tomodachis.find(tomo => tomo.originalID == originalID) || null;
      return find;
    }
    /**
     * Don't forget to update()
     * @param tomoState 
     * @returns 
     */
    updateTomoState(tomoState: CharacterInUser) {
      /**@TODO THERE IS A WAY BETTER WAY TO DO THIS I SWEAR */
      let find = this.getTomoFromDachis(tomoState.originalID), index: number;
      if (find != null) return;
      index = this.tomodachis.indexOf(find);
      this._tomodachis[index] == tomoState;
    }

    /**
     * @returns the item index. null if not in index, and the whole thing if it is.
     */
    getItemFromInv(itemID: number) {
      let find = this.inventory.find(item => item.itemID == itemID) || null;
      return find;
    }

    checkToRemoveDanglingZeros() {
    
    }

    /**
     * Remember to call update!
     * @param itemID 
     * @param amount 
     * @returns 
     */
    addToInventory(itemID: number, amount: number) {
      let find = this.getItemFromInv(itemID), index: number;
      if (find == null) {
        this._inventory.push(
          {
            itemID: itemID,
            amount: amount
          }
        )
        return this._inventory;
      };

      index = this._inventory.indexOf(find as ItemInUser);
      this._inventory[index].amount + amount;

      return this._inventory;

    }



    /**
     * Remember to call update!
     * @param itemID 
     * @param amount 
     * @returns 
     */
    removeFromInventory(itemID: number, amount: number) {

      let find = this.getItemFromInv(itemID), index: number, res: number;
      if (find == null || amount > 100000000) return;

      index = this._inventory.indexOf(find as ItemInUser);
      res = this._inventory[index].amount - amount;
      if (res <= 0) {
        this._inventory.splice(index)
        return this._inventory;
      }
      
      
      this._inventory[index].amount = res;
      return this._inventory;

    }

    
    async updateInventory() {
      await Queries.updateUserInventory(this._id, this.inventory)
    }
    async update() {
      /**TODO: Theres a more elegant solution to this. */
      await Queries.updateUserUniverse(this._id, {
        _id: this._id,
        discord_username: this.username,
        characters: this._tomodachis,
        reserved: this._reservedTomo,
        inventory: this._inventory
      })
    }



    set inventory(arr: Array<ItemInUser>) {
      this._inventory = arr;

    }


    

    
    
 

 
 }