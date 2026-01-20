import { GW2Api, ApiLanguage, setLogLevel, LogLevel } from "guildwars2-ts";
import { GW2User } from "./gw2.interfaces";

const API_BASE_URL = "https://api.guildwars2.com";

export class Gw2Service {
    private apiKey: string;
    private language: string = "en";

    constructor(apiKey: string, language: string = "en") {
        this.apiKey = apiKey;
        this.language = language;
    }

    async apiFetch(endpoint: string, params?: any, method: string = "GET"): Promise<any> {
        try {
            const url = new URL(`${API_BASE_URL}${endpoint}`);
            if (params) {
                Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            }

            url.searchParams.append("lang", this.language);

            const response = await fetch(url.toString(), {
                method,
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                }
            });
            if(!response.ok) throw new Error((await response.json()).text)

            return response.json();
        } catch (error) {
            throw new Error(`${error}`);
        }
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
    public async getCharacters(): Promise<string[]> {
        try {
            const characterInfo = await this.apiFetch("/v2/characters", {ids: "all"});
            return characterInfo;
        } catch (error) {
            throw new Error(`[GW2 Service] Failed to fetch character info: ${error}`);
        }
    }

    /** Returns all data about a specific character */
    public async getCharacterDetails(name: string): Promise<any> {
        try {
            const characterDetails = await this.apiFetch(`/v2/characters/${encodeURIComponent(name)}`);
            return characterDetails;
        } catch (error) {
            throw new Error(`[GW2 Service] Failed to fetch character details for ${name}: ${error}`);
        }
    }
}
