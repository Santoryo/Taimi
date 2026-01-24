'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.updateProfessionsInDb = updateProfessionsInDb;
exports.getProfession = getProfession;
const database_1 = require('../database/database');
const gw2_model_1 = require('./gw2.model');
const gw2_service_1 = require('./gw2.service');
async function updateProfessionsInDb() {
  const gw2api = new gw2_service_1.Gw2Service('');
  const profs = await gw2api.getProfessions();
  const specs = await gw2api.getSpecializations();
  for (const prof of profs) {
    await database_1.db
      .insert(gw2_model_1.professions)
      .values({
        profession: prof.name,
        name: prof.name,
        icon: prof.icon_big,
      })
      .onConflictDoNothing();
  }
  for (const spec of specs) {
    if (!spec.elite) continue;
    await database_1.db
      .insert(gw2_model_1.professions)
      .values({
        profession: spec.profession,
        name: spec.name,
        icon: spec.profession_icon_big,
        eliteSpecId: spec.id,
      })
      .onConflictDoNothing();
  }
}
async function getProfession(id, profession) {
  const profs = await database_1.db.select().from(gw2_model_1.professions);
  const prof = profs.find((e) => e.eliteSpecId == id);
  if (!prof) {
    return profs.find((e) => e.name == profession) || null;
  }
  return prof;
}
