'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.Gw2Service = void 0;
const gw2_limiter_1 = require('./gw2.limiter');
const API_BASE_URL = 'https://api.guildwars2.com';
class Gw2Service {
  constructor(apiKey, language = 'en') {
    this.language = 'en';
    this.apiKey = apiKey;
    this.language = language;
  }
  async apiFetch(endpoint, params, method = 'GET') {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) =>
        url.searchParams.append(k, String(v)),
      );
    }
    url.searchParams.append('lang', this.language);
    return gw2_limiter_1.gw2Limiter.schedule(async () => {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.text ?? `GW2 API error ${response.status}`);
      }
      return response.json();
    });
  }
  /** Returns account information associated with the API key */
  async getAccount() {
    try {
      const accountInfo = await this.apiFetch('/v2/account');
      return accountInfo;
    } catch (error) {
      throw new Error(`[GW2 Service] Failed to fetch account info: ${error}`);
    }
  }
  /** Returns a list of character names associated with the account */
  async getCharacters() {
    try {
      const characterInfo = await this.apiFetch('/v2/characters', {
        ids: 'all',
      });
      return characterInfo;
    } catch (error) {
      throw new Error(`[GW2 Service] Failed to fetch character info: ${error}`);
    }
  }
  /** Returns all data about a specific character */
  async getCharacterDetails(name) {
    try {
      const characterDetails = await this.apiFetch(
        `/v2/characters/${encodeURIComponent(name)}`,
      );
      return characterDetails;
    } catch (error) {
      throw new Error(
        `[GW2 Service] Failed to fetch character details for ${name}: ${error}`,
      );
    }
  }
  async getSpecializations() {
    try {
      const specs = await this.apiFetch('/v2/specializations', { ids: 'all' });
      return specs;
    } catch (error) {
      throw new Error(
        `[GW2 Service] Failed to fetch specializations: ${error}`,
      );
    }
  }
  async getProfessions() {
    try {
      const professions = await this.apiFetch('/v2/professions', {
        ids: 'all',
      });
      return professions;
    } catch (error) {
      throw new Error(`[GW2 Service] Failed to fetch professions: ${error}`);
    }
  }
}
exports.Gw2Service = Gw2Service;
