import {
  Controller,
  Get,
  Path,
  Res,
  Route,
  TsoaResponse,
} from "tsoa";
import { getCharacterByName, getCharacterListByUsername } from "./character.service";
import { FullCharacterDTO } from "./character";

@Route("character")
export class CharacterControler extends Controller {
    @Get("{name}")
    public async getCharacterRoute(@Path() name: string, @Res() notFound: TsoaResponse<404, { message: string }>): Promise<FullCharacterDTO | null>
    {
      const character = await getCharacterByName(name);

      if(!character)
      {
        return notFound(404, { message: `Character '${name}' not found` });
      }
      
      return character;
    }

   @Get("/user/{username}")
   public async getCharacterListByUsernameRoute(@Path() username: string, @Res() notFound: TsoaResponse<404, { message: string }>): Promise<string[]>
    {
        const usernames = await getCharacterListByUsername(username);
        return usernames;
    }
}