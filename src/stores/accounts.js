import { writable } from "svelte/store";

import storage from "local-storage";
import axios from "axios";

const store = () => {
  const { subscribe, update } = writable({ tokens: [], profiles: [] });

  return {
    subscribe,

    // Clears all account information so
    // they can be replaced
    empty: () => {
      update((obj) => {
        if (obj.profiles != null) {
          let newProfiles = obj.profiles.map((x) => {
            return { id: 0, token: 0 };
          });

          return { tokens: obj.tokens, profiles: newProfiles };
        };
      });
    },

    // Function, that'll 
    forceStore: (store) => {
      update(() => {
        return store;
      });
    },

    // Function, that'll load all tokens
    // and their profile's ids (to make them
    // unique)
    loadTokens: (tokens) => {
      // And now let's load token's information
      tokens.forEach((token) => {
        if (token != null) accounts.loadToken(token);
      });

      update((store = { tokens: [], profiles: [] }) => {
        store.tokens = tokens.filter((x) => x != null);

        return store;
      });
    },

    // Function, that'll load one token's
    // information and store it in the
    // cached storage.
    loadToken: async (token) => {
      // Let's firstly check if we have
      // any cached information for this token
      if (storage(`CTP-${token}`) != undefined) {
        // Check if we already have this token in
        // profiles array
        let id = storage(`CTP-${token}`);

        // And now let's update our store
        update((store = { tokens: [], profiles: [] }) => {
          if (!store.profiles.find((x) => x.id == id)) {
            store.profiles.push({ token, id });
          };

          return store;
        });
      } else {
        // Let's now send a request to unfull.authed
        // to get user's id.
        try {
          let response = await axios.get(`https://authed.unfull.ml/api/token/${token}`);
          let profile  = response.data.profile;

          // Let's update our store
          update((store = { tokens: [], profiles: [] }) => {
            if (!store.profiles.find((x) => x.id == profile.id)) {
              store.profiles.push({ token, id: profile.idid });
            };

            return store;
          });

          // And now let's add this token to cache
          storage.set(`CTP-${token}`, profile.id);
        } catch(error) {
          console.log("ERROR");
          console.log(error);
        };
      };
    }
  };
};

const accounts = store();

export default accounts;