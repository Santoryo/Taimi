import { db } from "../database/database";
import { professions } from "./gw2.model";
import { Gw2Service } from "./gw2.service";

export async function updateProfessionsInDb()
{
    const gw2api = new Gw2Service("");
    const profs = await gw2api.getProfessions();
    const specs = await gw2api.getSpecializations();

    for(const prof of profs)
    {
        await db.insert(professions).values({
            profession: prof.name,
            name: prof.name,
            icon: prof.icon_big
        })
        .onConflictDoNothing();
    }

    for(const spec of specs)
    {
        if(!spec.elite) continue;
        await db.insert(professions).values({
            profession: spec.profession,
            name: spec.name,
            icon: spec.profession_icon_big,
            eliteSpecId: spec.id
        }).onConflictDoNothing();
    }
}

export async function getProfession(id: number, profession: string)
{
    const profs = await db.select().from(professions);

    const prof = profs.find((e) => e.eliteSpecId == id);

    if(!prof)
    {
        return profs.find((e) => e.name == profession) || null;
    }

    return prof;
}