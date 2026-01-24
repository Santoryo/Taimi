'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.CharacterControler = void 0;
const tsoa_1 = require('tsoa');
const character_service_1 = require('./character.service');
let CharacterControler = class CharacterControler extends tsoa_1.Controller {
  async getCharacterRoute(name, notFound) {
    const character = await (0, character_service_1.getCharacterByName)(name);
    if (!character) {
      return notFound(404, { message: `Character '${name}' not found` });
    }
    return character;
  }
  async getCharacterListByUsernameRoute(username, notFound) {
    const usernames = await (0, character_service_1.getCharacterListByUsername)(
      username,
    );
    return usernames;
  }
};
exports.CharacterControler = CharacterControler;
__decorate(
  [
    (0, tsoa_1.Get)('{name}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Res)()),
  ],
  CharacterControler.prototype,
  'getCharacterRoute',
  null,
);
__decorate(
  [
    (0, tsoa_1.Get)('/user/{username}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Res)()),
  ],
  CharacterControler.prototype,
  'getCharacterListByUsernameRoute',
  null,
);
exports.CharacterControler = CharacterControler = __decorate(
  [(0, tsoa_1.Route)('character')],
  CharacterControler,
);
