import { writable } from "svelte/store";

import storage from "local-storage";
import axios from "axios";

import config from "../config/api/default.json";

function store() {
  // Default Profile Object
  let profile = {
    id: null,
  };

  // Let's now "import" some important
  const { subscribe, update } = writable(profile);

  return {
    subscribe,

    // Function, that'll load our user information
    loadProfile: (token, attributes = {}) => {
      const attrs = {
        ignoreSavedPincode: attributes.ignoreSavedPincode || false
      };

      // Let's now check if it's a
      // token or no.
      if (token.split('').length != 16) {
        return;
      };

      return new Promise((resolve, reject) => {
        // Let's now try to connect to authed
        // servers and try to get some information
        // about this token.
        axios.get(`${config.apiURI.internal}/profile/${token}`)
        .then((response) => {
          const data = response.data;
          const done = () => {
            update((store) => {
              // Update Profile
              store       = data;
              store.token = token;
  
              setTimeout(() => {
                resolve(store);
              }, 10);
              return store;
            });
          };

          // Second Token Check
          if (!data.isToken) {
            reject({ error: "!IsToken" });
          };

          // Let's check if this account
          // have pincode authorization
          if (data.security.pincode != null) {
            // Let's check if we have AuthorizedToken saved
            // somewhere in our local-storage
            let authorizedToken = attrs.ignoreSavedPincode ? null : storage.get(`AT-${data.id}`);

            // And now let's check validity of this token
            // through internal api
            axios.get(`${config.apiURI.internal}/security/code/${authorizedToken}`)
            .then(() => {
              done();
            })
            .catch(() => {
              if (!attrs.ignoreSavedPincode) storage.remove(`AT-${authorizedToken}`);
              
              reject({ error: "authorizePincode", id: data.id });
            });
          } else {
            done();
          };
        }).catch((error) => {
          reject(error);
        });
      });
    },

    // Function, that'll force our user's profile
    // data to the store.
    forceProfile: (profile) => {
      update(() => {
        return profile;
      });
    }
  }
};

export default store();