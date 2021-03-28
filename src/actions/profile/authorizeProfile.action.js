// Importing modules
import profile from "../../stores/profile";
import accounts from "../../stores/accounts";

import moment from "moment";

import storage from "local-storage";
import Cookie from "cookie-universal";
const cookies = Cookie();

import { goto } from "@sapper/app";

// Importing actions
import authorizePincode from "../profile/security/authorizePincode.action";

// Exporting default function
export default (token, pincode, attributes = {}) => {
  return new Promise((resolve, reject) => {
    const attrs = { 
      storeInCookies: attributes.storeInCookies || true,
      ignoreSavedPincode: attributes.ignoreSavedPincode || false,
      fromPincodePage: attributes.fromPincodePage || false
    };

    let query = new URLSearchParams(window.location.search);
    const originalCallback = {
      url: query.get('return'),
      query: query.get('query')
    };

    // Function, that'll save account token to cookies
    // storage
    function saveToken(token, cookies) {
      // And now let's update current token
      if (attrs.storeInCookies) cookies.set('token', token, { path: "/", expires: moment().add('1', 'year').toDate(), domain: ".lococovu.me" });

      // Let's firstly get all tokens
      let tokens = cookies.get('tokens', { path: "/" });
      if (tokens == null) {
        tokens = [];
      } else {
        tokens = tokens.split(',');
      };

      // Let's now check if we already have
      // this token or no.
      if (!tokens.includes(token)) {
        tokens.push(token);
        cookies.set('tokens', tokens.join(','), { path: "/", expires: moment().add('1', 'year').toDate(), domain: ".lococovu.me" });
      };

      // And now let's load profiles;
      accounts.loadTokens(tokens)
    };

    // Function, that'll save our callback information
    // into some place.
    function storeCallback(url, query) {
      // Storing callback information (if exists)
      let callback = {
        url: url,
        query: query
      };

      // And now let's save it
      // TODO: 
      if (callback.url != null) storage.set('auth.callback', JSON.stringify(callback));
    };

    // Function, that will be called after all authorization
    // processes
    function done(token, securityCode) {
      // Let's firstly cehck if we have any callbacks
      let callback = storage.get('auth.callback');

      if (callback == null) {
        callback = originalCallback 
      } else {
        try {
          callback = JSON.parse(callback);
        } catch {
          callback = originalCallback;
        };
      };

      if (callback.url != null) {
        // Deleting this callback's information
        storage.remove('auth.callback');

        let params = new URLSearchParams(callback.query);

        // Updating our query string
        if (params.has('token')) params.delete('token')
        // Let's firstly check for size
        // of our parameters

        // Just don't touch anything here
        let size = 0;
        for (let value of params.values()) {
          size++;
        };

        // And now let's just redirect our user
        // to this uri
        goto(`${callback.url}${ size > 0 ? `?${params.toString()}&token=${token}${ securityCode != null ? `&securityCode=${securityCode}` : "" }` : `?token=${token}${ securityCode != null ? `&securityCode=${securityCode}` : "" }` }`);
      } else {
        // TODO
        // Redirect user to
        // tutorial or to Profile Setup
        // if needed
        goto('/settings');
      };
    };

    // Let's firstly authorize our user.

    profile.loadProfile(token, attrs)
    .then((response) => {
      // Let's firstly save this token
      saveToken(token, cookies);

      // And now let's finish this authorization process

      // Let's get Security Code
      let securityCode = storage.get(`AT-${response.id}`);

      done(token, securityCode);
    }).catch(async (error) => {
      // Let's now check if we have
      // pincode (and then let's try to
      // authorize)
      if (pincode != null) {
        try {
          let response = await authorizePincode(error.id, pincode);
          if (!attrs.ignoreSavedPincode) storage.set(`AT-${error.id}`, response.token);

          // And now let's just save this
          // token
          setTimeout(() => {
            profile.loadProfile(token)
            .then(() => {
              saveToken(token, cookies);
              done(token, response.token);
            });
          }, 500);

          return;
        } catch {
          reject({ error: "ServerError" });
        };
      };

      // Checking error information

      // @error authorizePincode
      if (error.error == "authorizePincode") {  
        // Let's firstly store our callback
        // information
        storeCallback(originalCallback.url, originalCallback.query);

        if (!attrs.fromPincodePage) goto(`/authorize/pincode?token=${token}`);
      } else {
        reject({ error: "ServerError" });
      }
    });
  });
};