<script>
  // Importing modules
  import friends from "../../stores/friends.js";
  import axios from "axios";

  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  import Icon from "../../components/Icon.svelte";

  let hidden = false;
  // Current User's profile
  let profile = {
    loaded: false,
    status: {}
  };

  onMount(async () => {
    // Let's check if we have this friend
    // cached
    if ($friends.find((x) => x.id == id && x.cached == true)) {
      // Let's now load this cached information;
      profile = $friends.find((x) => x.id == id && x.cached == true);
    } else {
      // And now let's get this
      // user's information from our servers
      try {
        let userProfile = await axios.get(`https://lococovu.me/api/profile/${id}`);
        
        // Preparing profile object
        let newProfile  = userProfile.data;
        newProfile.status = {
          type: "online"
        };
        newProfile.loaded = true;

        profile = newProfile;
      
        // And now let's add this profile to
        // our "cache"
        friends.cache(newProfile);
      } catch (error) {
        hidden = true;
      };
    };
  });

  // Exporting some settings.
  export let id;
</script>

<div class="{ hidden ? "hidden" : "flex" } { profile.loaded == false ? "h-16" : "" } relative my-4 mx-6 p-3 items-center justify-between bg-icon-button rounded-md { profile.status.type == "away" ? "opacity-60" : profile.status.type == "offline" ? "opacity-30" : "opacity-80" }">	
  { #if !profile.loaded }
    <!-- Loading screen -->
    <div out:fade style="z-index: 2;" class="absolute inset-0 w-full h-full bg-icon-button rounded-md flex justify-center items-center">
      <!-- Three Dots -->
      <Icon name="more-horizontal" attrs={{ width: "1.2rem", height: "1.2rem", color: "#fff" }} />
    </div>
  { :else }

    <!-- Avatar -->
    <div class="relative flex items-center">
      <div style="background: url({ profile.avatar }); background-size: cover;" class="w-12 h-12 rounded-md"></div>

      <!-- Game Icon -->
      { #if profile.status.type == "playing" }
        <div style="bottom: -0.5rem;" class="absolute bottom-0 pl-8">
          <div style="background: url('https://media.pcgamesinsider.biz/2020/4/104429/hypixel-logo-r225x.jpg'); background-size: cover;" class="w-6 h-6 rounded-md"></div>
        </div>
      { /if }

      <!-- Name -->
      <div class="ml-3 text-left">
        <h1 class="text-md text-white font-bold">{ profile.nickname == null ? profile.displayName : profile.nickname }</h1>

        <!-- Status -->
        <div class="flex items-center">
          { #if profile.status.type == "offline" }
            <p class="text-sm text-gray-100">Был в сети 2 часа назад</p>
          { :else if profile.status.type == "away" }
            <img style="height: 1.2rem; width: 1.2rem;" src="./icons/dash-symbol.png" alt="">
            <p class="text-sm text-gray-100 ml-1">Отошёл</p>
          { :else if profile.status.type == "online" }
            <img style="height: 1.2rem; width: 1.2rem;" src="./icons/desktop-computer.png" alt="">
            <p class="text-sm text-gray-100 ml-1">Сидит на сайте</p>
          { :else if profile.status.type == "playing" }
            <img style="height: 1.2rem; width: 1.2rem;" src="./icons/video-game.png" alt="">
            <p class="text-sm text-gray-100 ml-1">Играет в: <span class="border-b border-dotted border-gray-100">Hytale</span></p>      
          { /if }
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex items-center pr-4">
      <!-- Message Player -->
      <button class="mx-3 w-8 h-8 rounded-md bg-input flex justify-center items-center">
        <svg style="width: 1rem; height: 1rem;" class="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </button>

      <!-- Settings -->
      <button class="w-8 h-8 rounded-md bg-input flex justify-center items-center">
        <svg style="width: 1rem; height: 1rem;" class="text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
      </button>
    </div>

    <!-- Status Badge -->
    { #if profile.status.type == "away" }
      <div class="absolute right-0 h-full w-2 bg-yellow-400 rounded-r-md"></div>
    { :else if profile.status.type == "online" || profile.status.type == "custom" }
      <div class="absolute right-0 h-full w-2 bg-indigo-400 rounded-r-md"></div>
    { :else if profile.status.type == "playing" }
      <div class="absolute right-0 h-full w-2 rounded-r-md bg-green-400"></div>
    { /if }
  { /if }
</div>