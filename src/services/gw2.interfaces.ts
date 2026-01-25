import { UUID } from 'crypto';

export type GW2User = {
    id: string;
    age: number;
    name: string;
    world: number;
    guilds: string[];
    guild_leader: string[];
    created: string;
    access: string[];
    commander: boolean;
    fractal_level: number;
    daily_ap: number;
    monthly_ap: number;
    wvw_rank: number;
    last_modified?: string | undefined;
    build_storage_slots?: number | undefined;
};

export type GW2Character = {
    name: string;
    race: string;
    gender: string;
    profession: string;
    level: number;
    guild: UUID;
    age: number;
    created: string;
    deaths: number;
    title: number;
    backstory: string[];
    wvw_abilities: GW2CharacterWvWAbility[];
    equipment: GW2CharacterEquipment[];
    recipes: number[];
    equipment_pvp: GW2CharacterPvPEquipment;
    specializations: GW2CharacterSpecialization;
    skills: GW2CharacterSkills;
};

export type GW2CharacterWvWAbility = {
    id: number;
    rank: number;
};

export type GW2CharacterEquipment = {
    id: number;
    slot: string;
    binding: string;
    bound_to?: string;
    skin?: number;
    stats?: { id: number; attributes: any };
    infusions?: number[];
    dyes?: number[];
    upgrades?: number[];
};

export type GW2CharacterPvPEquipment = {
    amulet: number | null;
    rune: number | null;
    sigils: number[] | null[];
};

export type GW2CharacterSpecialization = {
    pve: GW2CharacterSpecializationOption[];
    pvp: GW2CharacterSpecializationOption[];
    wvw: GW2CharacterSpecializationOption[];
};

export type GW2CharacterSpecializationOption = {
    id: number;
    traits: number[];
};

export type GW2CharacterSkills = {
    pve: GW2CharacterSkillsOption;
    pvp: GW2CharacterSkillsOption;
    wvw: GW2CharacterSkillsOption;
};

export type GW2CharacterSkillsOption = {
    heal: number;
    utilities: number[];
    elite: number;
};

export type GW2Specialization = {
    id: number;
    name: string;
    profession: string;
    elite: boolean;
    minor_traits: number[];
    major_traits: number[];
    icon: string;
    background: string;
    profession_icon_big: string;
    profession_icon: string;
};

export type GW2Profession = {
    id: string;
    name: string;
    icon: string;
    icon_big: string;
};
