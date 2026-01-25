import { and, asc, eq, lt } from 'drizzle-orm';
import { db } from '../../database/database';
import { characters, equipment, SkillsPve, specializationsPve } from './character.model';
import { Gw2Service } from '../../services/gw2.service';
import { Request } from 'express';
import { UUID } from 'crypto';
import { InsertUser, users } from '../user/user.model';
import { characterQueue } from '../../worker/queue';
import { GW2Character } from '../../services/gw2.interfaces';
import { CharacterDTO, EquipmentDTO, FullCharacterDTO } from './character';
import logger from '../../core/logger';
import { getProfession } from '../../services/gw2.db.service';
import { professions } from '../../services/gw2.model';
import config from '../../config/config';

export async function updateCharacterInDb(apiKey: string, userId: string) {
    const gw2Api = new Gw2Service(apiKey);
    const charactersData: GW2Character[] = await gw2Api.getCharacters();

    for (const [index, character] of charactersData.entries()) {
        const elite = await getProfession(character.specializations.pve[2].id, character.profession);

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

        const characterResponse = await db
            .insert(characters)
            .values({
                userId: userId,
                name: character.name,
                ...characterDetails,
            })
            .onConflictDoUpdate({
                target: users.name,
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

            await db
                .insert(equipment)
                .values({
                    characterId: characterResponse[0].id,
                    slot: eq.slot,
                    ...equipmentDetails,
                })
                .onConflictDoUpdate({
                    target: [equipment.characterId, equipment.slot],
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
                await db
                    .insert(specializationsPve)
                    .values({
                        characterId: characterResponse[0].id,
                        specId: spec.id,
                        traits: spec.traits,
                        index: index,
                    })
                    .onConflictDoUpdate({
                        target: [specializationsPve.characterId, specializationsPve.index],
                        set: {
                            specId: spec.id,
                            traits: spec.traits,
                        },
                    });
            }
        }

        await db
            .insert(SkillsPve)
            .values({
                characterId: characterResponse[0].id,
                heal: character.skills.pve.heal ?? null,
                utilities: character.skills.pve.utilities ?? null,
                elite: character.skills.pve.elite ?? null,
            })
            .onConflictDoUpdate({
                target: SkillsPve.characterId,
                set: {
                    heal: character.skills.pve.heal ?? null,
                    utilities: character.skills.pve.utilities ?? null,
                    elite: character.skills.pve.elite ?? null,
                },
            });

        logger.info({ character: character.name }, 'Updated character');
    }
}

export async function getCharacterByName(name: string): Promise<FullCharacterDTO | null> {
    const charactersReq = await db.select().from(characters).where(eq(characters.name, name)).limit(1);

    if (charactersReq.length === 0) return null;

    const character = charactersReq[0];

    const equipmentReq = await db.select().from(equipment).where(eq(equipment.characterId, character.id));

    const specializationsReq = await db
        .select({ specId: specializationsPve.specId, traits: specializationsPve.traits })
        .from(specializationsPve)
        .where(eq(specializationsPve.characterId, character.id))
        .limit(3);

    const skillsReq = await db
        .select({ heal: SkillsPve.heal, utilities: SkillsPve.utilities, elite: SkillsPve.heal })
        .from(SkillsPve)
        .where(eq(SkillsPve.characterId, character.id))
        .limit(1);

    const [profession] = await db.select().from(professions).where(eq(professions.name, character.elite)).limit(1);

    return {
        ...character,
        professionIcon: profession.icon,
        equipment: equipmentReq,
        specialization: specializationsReq,
        skills: skillsReq[0] ?? null,
    };
}
