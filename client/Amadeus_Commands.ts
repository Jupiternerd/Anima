import { Client, CommandInteraction } from "discord.js";
import user from "../db_schemas/user_type";
import Amadeus_Base from "./Amadeus_Base";

const { SlashCommandBuilder } = require("@discordjs/builders");

export abstract class Commands extends Amadeus_Base {
  name: string = null;
  data: typeof SlashCommandBuilder = new SlashCommandBuilder();
  description: string = null;
  dbRequired: boolean = false;
  ownerOnly: boolean = false;
  checks: Function = null;
  disabled: boolean = false;
  inGuildOnly: boolean = false;
  inMainOnly: boolean = false;

  constructor(
    name: string,
    settings: {
      description: string,
      data: typeof SlashCommandBuilder;
      dbRequired?: boolean;
      ownerOnly?: boolean;
      inGuildOnly?: boolean;
      inMainOnly?: boolean ;
    }
  ) {
    super()
    this.name = name.toLowerCase();
    this.data = settings.data;
    ///console.log(settings.description)
    this.data.setName(name)

    this.data.setDescription(settings.description) 
    this.dbRequired = settings.dbRequired;
    this.ownerOnly = settings.ownerOnly;
    this.description = settings.description.toString();
    this.inGuildOnly = settings.inGuildOnly;
    this.inMainOnly = settings.inMainOnly;

    

  }

  async check(bot: Client, interaction: CommandInteraction) {
    return true;
  }

  async default_checks(bot: Client, interaction: CommandInteraction) {

    if (this.disabled) return interaction.reply("Sorry, this command is disabled.")

    if (this.ownerOnly) {
      console.log(interaction.user.id == process.env.OWNER_ID) // if true then bottom is false
      
      if (interaction.user.id == process.env.OWNER_ID ? false : true) return interaction.reply("Sorry, this is an owner only command. Try again when you become the owner?")
      
    }
    
    if (this.dbRequired) {
      const author = await user.findOne({_id: interaction.user.id})
      if (!author) {
        const author_db = new user({
          _id: interaction.user.id,
          name: interaction.user.username,
          xp: 0,
          lvl: 1
        }) 

        author_db.save()
        interaction.reply("Sorry, you weren't on the list, try again!")
        return false;
      }

    }
    return true;
  }

  async formatName(this: Commands, interaction) {}
}
