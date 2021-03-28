import { writable } from "svelte/store";
import profile from "./profile";

const store = () => {
  const { subscribe, update } = writable([]);

  profile.subscribe((store) => {
    if (store.friends != null && store.friends.length != null && store.friends.length > 0) {
      let friends = store.friends.map((obj) => {
        if (obj.status == "approved") {
          return {
            id: obj.ids.find((id) => id != store.id),
            status: "approved"
          };
        };
      }) || [];
      
      if (friends.length > 0) {
        update(() => {
          return friends;
        });
      };
    };
  });

  return {
    subscribe,

    cache: (profile) => {
      update((obj) => {
        let newProfile = profile;
        newProfile.cached = true;

        obj.push(newProfile);
        return obj;
      });
    }
  };
};

export default store();