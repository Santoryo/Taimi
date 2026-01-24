export type CharacterDTO = {
    id: number;
    userId: string;
    name: string;
    race: string;
    profession: string;
    gender: string;
    level: number;
    created: Date;
    deaths: number;
    age: number;
    title: number;
}

export type EquipmentDTO = {
    id: number;
    characterId: number;
    itemId: number;
    slot: string;
    skinId: number | null;
    statsId: number | null;
    binding: string | null;
    dyes: number[] | null;
    upgrades: number[] | null;
    infusions: number[] | null;
}

export type SpecializationDTO = {
    specId: number | null;
    traits: number[] | null;
}

export type SkillsDTO = {
    heal: number | null;
    utilities: number[] | null;
    elite: number | null;
}

export interface FullCharacterDTO extends CharacterDTO {
    equipment: EquipmentDTO[]
    specialization: SpecializationDTO[];
    skills: SkillsDTO;
}