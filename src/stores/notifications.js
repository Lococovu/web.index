import { writable } from "svelte/store";

const store = () => {
  const { subscribe, update } = writable([
    {
      id: 0,
      type: "warning"
    },
    {
      id: 1,
      type: "other"
    },
    {
      id: 2,
      type: "friend",
      subtype: "request"
    }
  ]);

  return {
    subscribe,
  }
};

export default store();