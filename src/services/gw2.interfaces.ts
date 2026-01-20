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
}