import { GW2Api, ApiLanguage, setLogLevel, LogLevel } from "guildwars2-ts";
import { GW2Character, GW2Profession, GW2Specialization, GW2User } from "./gw2.interfaces";
import { gw2Limiter } from "./gw2.limiter";

const API_BASE_URL = "https://api.guildwars2.com";

export class Gw2Service {
    private apiKey: string;
    private language: string = "en";

    constructor(apiKey: string, language: string = "en") {
        this.apiKey = apiKey;
        this.language = language;
    }

    async apiFetch(endpoint: string, params?: any, method = "GET"): Promise<any> {
        const url = new URL(`${API_BASE_URL}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([k, v]) =>
                url.searchParams.append(k, String(v))
            );
        }

        url.searchParams.append("lang", this.language);

        return gw2Limiter.schedule(async () => {
            const response = await fetch(url.toString(), {
                method,
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error((body as any).text ?? `GW2 API error ${response.status}`);
            }

            return response.json();
        });
    }

    /** Returns account information associated with the API key */
    public async getAccount(): Promise<GW2User> {
        try {
            const accountInfo = await this.apiFetch("/v2/account");
            return accountInfo as GW2User;
        } catch (error) {
            throw new Error(`[GW2 Service] Failed to fetch account info: ${error}`);
        }
    }

    /** Returns a list of character names associated with the account */
    public async getCharacters(): Promise<GW2Character[]> {
        try {
            const characterInfo = await this.apiFetch("/v2/characters", { ids: "all" });
            return characterInfo;
        } catch (error) {
            throw new Error(`[GW2 Service] Failed to fetch character info: ${error}`);
        }
    }

    /** Returns all data about a specific character */
    public async getCharacterDetails(name: string): Promise<GW2Character> {
        try {
            const characterDetails = await this.apiFetch(`/v2/characters/${encodeURIComponent(name)}`);
            return characterDetails;
        } catch (error) {
            throw new Error(`[GW2 Service] Failed to fetch character details for ${name}: ${error}`);
        }
    }

    public async getSpecializations(): Promise<GW2Specialization[]>
    {
        try
        {
            const specs = await this.apiFetch("/v2/specializations", { ids: "all" });
            return specs;
        }
        catch (error)
        {
            throw new Error(`[GW2 Service] Failed to fetch specializations: ${error}`);
        }
    }

    public async getProfessions(): Promise<GW2Profession[]>
    {
        try
        {
            const professions = await this.apiFetch("/v2/professions", { ids: "all" });
            return professions;
        }
        catch (error)
        {
            throw new Error(`[GW2 Service] Failed to fetch professions: ${error}`);
        }
    }
}
