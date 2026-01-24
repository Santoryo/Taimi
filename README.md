# Taimi

Taimi is a RESTful API backend service for [Tyria.Tools](https://tyria.tools/) and GW2 Armory. 

### Techstack
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Supabase](https://shields.io/badge/supabase-black?logo=supabase&style=for-the-badge)
![Express](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### Setup
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` and fill out necessary values
4. The default project supports Supabase, however any Drizzle ORM compatible database can be used. This project does not support Authentication, so `src/middlewares/authGuard.ts` has to be modified in case of not using Supabase Authorization system.


### Legal Stuff
 NCSOFT, the interlocking NC logo, ArenaNet, Guild Wars, Guild Wars Factions, Guild Wars Nightfall, Guild Wars: Eye of the North, Guild Wars 2, and all associated logos and designs are trademarks or registered trademarks of NCSOFT Corporation. All other trademarks are the property of their respective owners. 
