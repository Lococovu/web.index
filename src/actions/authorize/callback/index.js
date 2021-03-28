// Importing callback functions

// @callback Minecraft
// - All Minecaft-related function
import finishMinecraft from "./Minecraft/finishCallback.action";
import getMinecraft from "./Minecraft/getCallback.action";

const minecraft = {
  get: getMinecraft,
  finish: finishMinecraft
};

// And now let's export all these callbacks
export { minecraft };