/**
 * @author Shokkunn
 */

import Queries from "../queries";
import { Equations } from "../statics/tomo_dict";
import { CharacterInUser, ItemInUser, Tomo_Action, UserUniversePayload } from "../statics/types";
import universeBase from "./universeBase";
 
export default class DBUsers extends universeBase {
    _tomodachis: Array<CharacterInUser>
    _reservedTomo: Array<CharacterInUser>
    _inventory: Array<ItemInUser>
    _level: number;
    _xp: number;
    username: string;
    constructor(_id: number | string, payload: UserUniversePayload) {
        super(_id, 'users', payload.discord_username, "🧍");
        this.username = payload.discord_username;
        this._tomodachis = payload.characters;
        this._reservedTomo = payload.reserved;
        this._inventory = payload.inventory;
        this._xp = payload.xp;
        this._level = payload.level;
         
 
    }

    get level() {
      return this._level;
    }

    get xp() {
      return this._xp;
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
      if (find == null) return;
      index = this.tomodachis.indexOf(find);
      this._tomodachis[index] == tomoState;
    }

    tomoInvGetItem(tomoID: number, itemID: number) {
      let tomo = this.getTomoFromDachis(tomoID);
      if (!tomo) return;
      return tomo.inventory.find(item => item.itemID == itemID);
      
    }
    /**
     * @see REMEMBER TO TOMOUPDATE
     * @param tomoID 
     * @returns 
     */
    tomoToLevelUp(tomo: number | CharacterInUser) {
      /**@TODO Better way to do this. Like actually. */
      let xp_needed: number;

      if (typeof tomo == "number") tomo = this.getTomoFromDachis(tomo)
      
      xp_needed = Equations.calculate_ch_xp(tomo.being.level + 1)
      
      if (xp_needed <= tomo.being.xp) tomo.being.level += 1;
      if ((xp_needed - tomo.being.xp) < 0) this.tomoToLevelUp(tomo);
    }
    
    addToXP(amount: number) {
      this._xp += amount;
      console.log("USR IS GETTING XP: " + this._xp);
      this.userToLevelUp();
    }

    addToTomoXP(tomoID: number, amount: number) {
      let tomo = this.getTomoFromDachis(tomoID)
      if (!tomo) return;
      console.log("TOMO IS GETTING XP: " + amount)

      tomo.being.xp += amount;
      this.tomoToLevelUp(tomo);
    }

    addToTomoLP(tomoID: number, amount: number) {
      let tomo = this.getTomoFromDachis(tomoID)
      if (!tomo) return;
      console.log("TOMO IS GETTING LP: " + amount)

      tomo.moods.overall += amount;
    }

    setUserLastInteraction(tomoID: number, action: Tomo_Action) {
      let tomo = this.getTomoFromDachis(tomoID)
      tomo._last_interaction.interaction = action;
      tomo._last_interaction.interaction_date = new Date()
      
    }

    addToTomoInventory(tomoOrigID: number, itemID: number, amount: number) {
      let tomo = this.getTomoFromDachis(tomoOrigID), itemInInv: ItemInUser, index: number;
      itemInInv = this.tomoInvGetItem(tomoOrigID, itemID);
      if (!itemInInv) {
        tomo.inventory.push({
          itemID: itemID,
          amount: amount
        })
        console.log(tomo.inventory + " TOMOINV")
        return tomo.inventory;
      }
      index = tomo.inventory.indexOf(itemInInv);
      tomo.inventory[index].amount += amount;
      console.log(tomo.inventory + " TOMOINV")
      return tomo.inventory; 
      
    }

    removeFromTomoInventory(tomoOrigID: number, itemID: number, amount: number) {
      let find = this.tomoInvGetItem(tomoOrigID, itemID), tomo = this.getTomoFromDachis(tomoOrigID), index: number, res: number;
      if (find == null || amount > 100000000) return;

      index = tomo.inventory.indexOf(find as ItemInUser);
      res = tomo.inventory[index].amount - amount;
      if (res <= 0) {
        tomo.inventory.splice(index)
        return tomo.inventory;
      }
      
      
      tomo.inventory[index].amount = res;
      return tomo.inventory;
    }

    userToLevelUp() {
      /**@TODO Better way to do this. Like actually. */
      let xp_needed = Equations.calculate_user_xp(this.level)//, go_into = (xp_needed / tomo.being.xp);
      if (xp_needed <= this.level) this._level += 1;
      console.log("USR IS LEVELING UP: " + this._level);
    }


    /**
     * @returns the item index. null if not in index, and the whole thing if it is.
     */
    getItemFromInv(itemID: number) {
      let find = this.inventory.find(item => item.itemID == itemID) || null;
      return find;
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
      this._inventory[index].amount += amount;

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
    async updateTomo() {
      await Queries.updateUserTomo(this._id, this.tomodachis)
    }
    async updateInventory() {
      await Queries.updateUserInventory(this._id, this.inventory)
    }

    async validateTomoInventory() {
     /**TODO */
    }
    async update() {
      /**TODO: Theres a more elegant solution to this. */
      await Queries.updateUserUniverse(this._id, {
        _id: this._id,
        level: this._level,
        xp: this._xp,
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