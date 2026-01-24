'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.updateCharacterInDb = updateCharacterInDb;
exports.getCharacterByName = getCharacterByName;
exports.getCharacterListByUsername = getCharacterListByUsername;
const drizzle_orm_1 = require('drizzle-orm');
const database_1 = require('../../database/database');
const character_model_1 = require('./character.model');
const gw2_service_1 = require('../../services/gw2.service');
const user_model_1 = require('../user/user.model');
const logger_1 = __importDefault(require('../../core/logger'));
const gw2_db_service_1 = require('../../services/gw2.db.service');
async function updateCharacterInDb(apiKey, userId) {
  const gw2Api = new gw2_service_1.Gw2Service(apiKey);
  const charactersData = await gw2Api.getCharacters();
  for (const [index, character] of charactersData.entries()) {
    const elite = await (0, gw2_db_service_1.getProfession)(
      character.specializations.pve[2].id,
      character.profession,
    );
    const characterDetails = {
      race: character.race,
      profession: character.profession,
      gender: character.gender,
      level: character.level,
      created: new Date(character.created),
      deaths: character.deaths,
      age: character.age,
      title: character.title,
      accessedOrder: index,
      updated: new Date(Date.now()),
      elite: elite?.name ?? character.profession,
    };
    const characterResponse = await database_1.db
      .insert(character_model_1.characters)
      .values({
        userId: userId,
        name: character.name,
        ...characterDetails,
      })
      .onConflictDoUpdate({
        target: user_model_1.users.name,
        set: characterDetails,
      })
      .returning();
    for (const eq of character.equipment) {
      const equipmentDetails = {
        itemId: eq.id,
        skinId: eq.skin ?? null,
        statsId: eq.stats?.id ?? null,
        binding: eq.binding ?? null,
        dyes: eq.dyes ?? null,
        upgrades: eq.upgrades ?? null,
        infusions: eq.infusions ?? null,
      };
      await database_1.db
        .insert(character_model_1.equipment)
        .values({
          characterId: characterResponse[0].id,
          slot: eq.slot,
          ...equipmentDetails,
        })
        .onConflictDoUpdate({
          target: [
            character_model_1.equipment.characterId,
            character_model_1.equipment.slot,
          ],
          set: {
            itemId: eq.id,
            skinId: eq.skin ?? null,
            statsId: eq.stats?.id ?? null,
            binding: eq.binding ?? null,
            dyes: eq.dyes ?? null,
            upgrades: eq.upgrades ?? null,
            infusions: eq.infusions ?? null,
          },
        });
    }
    if (character.specializations.pve) {
      for (const [index, spec] of character.specializations.pve.entries()) {
        await database_1.db
          .insert(character_model_1.specializationsPve)
          .values({
            characterId: characterResponse[0].id,
            specId: spec.id,
            traits: spec.traits,
            index: index,
          })
          .onConflictDoUpdate({
            target: [
              character_model_1.specializationsPve.characterId,
              character_model_1.specializationsPve.index,
            ],
            set: {
              specId: spec.id,
              traits: spec.traits,
            },
          });
      }
    }
    await database_1.db
      .insert(character_model_1.SkillsPve)
      .values({
        characterId: characterResponse[0].id,
        heal: character.skills.pve.heal ?? null,
        utilities: character.skills.pve.utilities ?? null,
        elite: character.skills.pve.elite ?? null,
      })
      .onConflictDoUpdate({
        target: character_model_1.SkillsPve.characterId,
        set: {
          heal: character.skills.pve.heal ?? null,
          utilities: character.skills.pve.utilities ?? null,
          elite: character.skills.pve.elite ?? null,
        },
      });
    logger_1.default.info({ character: character.name }, 'Updated character');
  }
}
async function getCharacterByName(name) {
  const charactersReq = await database_1.db
    .select()
    .from(character_model_1.characters)
    .where((0, drizzle_orm_1.eq)(character_model_1.characters.name, name))
    .limit(1);
  if (charactersReq.length === 0) return null;
  const character = charactersReq[0];
  const equipmentReq = await database_1.db
    .select()
    .from(character_model_1.equipment)
    .where(
      (0, drizzle_orm_1.eq)(
        character_model_1.equipment.characterId,
        character.id,
      ),
    );
  const specializationsReq = await database_1.db
    .select({
      specId: character_model_1.specializationsPve.specId,
      traits: character_model_1.specializationsPve.traits,
    })
    .from(character_model_1.specializationsPve)
    .where(
      (0, drizzle_orm_1.eq)(
        character_model_1.specializationsPve.characterId,
        character.id,
      ),
    )
    .limit(3);
  const skillsReq = await database_1.db
    .select({
      heal: character_model_1.SkillsPve.heal,
      utilities: character_model_1.SkillsPve.utilities,
      elite: character_model_1.SkillsPve.heal,
    })
    .from(character_model_1.SkillsPve)
    .where(
      (0, drizzle_orm_1.eq)(
        character_model_1.SkillsPve.characterId,
        character.id,
      ),
    )
    .limit(1);
  return {
    ...character,
    equipment: equipmentReq,
    specialization: specializationsReq,
    skills: skillsReq[0] ?? null,
  };
}
async function getCharacterListByUsername(name) {
  const uid = await database_1.db
    .select({ user_id: user_model_1.users.id })
    .from(user_model_1.users)
    .where((0, drizzle_orm_1.eq)(user_model_1.users.name, name))
    .limit(1);
  if (uid.length == 0) {
    return [];
  }
  const characternames = await database_1.db
    .select({ name: character_model_1.characters.name })
    .from(character_model_1.characters)
    .where(
      (0, drizzle_orm_1.eq)(
        character_model_1.characters.userId,
        uid[0].user_id,
      ),
    );
  return characternames.map((c) => c.name);
}
