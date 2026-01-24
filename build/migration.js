'use strict';
// // a script to migrate Pocketbase to Supabase
// import PocketBase from 'pocketbase';
// import { createUserInDb } from './src/routes/user/user.service';
// const superuserClient = new PocketBase('https://data.brelshaza.com/');
// superuserClient.autoCancellation(false);
// await superuserClient.admins.authWithPassword("", "", {
//   // This will trigger auto refresh or auto reauthentication in case
//   // the token has expired or is going to expire in the next 30 minutes.
//   autoRefreshThreshold: 30 * 60
// });
// const users = await superuserClient.collection("twitchGW2").getFullList();
// await Promise.all(
//   users.map(async (user) => {
//     try {
//       await createUserInDb(user.apiKey, undefined, user.twitchId);
//     } catch (err) {
//       console.error('Failed user:', user.id, err);
//     }
//   })
// );
