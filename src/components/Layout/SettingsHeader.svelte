<script>
  // Importing modules
  import { goto } from "@sapper/app";
  import { fade } from "svelte/transition";

  // Importing stores
  import { stores } from "@sapper/app";
  const { page } = stores();

  import profile from "../../stores/profile.js";
  import accounts from "../../stores/accounts.js";

  // Importing components
  import Icon from "../../components/Icon.svelte";

  // Some variables
  let sections = [
    {
      id: "index",
      href: "/settings",
      title: "Основные настройки",
      icon: "user"
    },
    {
      id: "security",
      href: "/settings/security",
      title: "Безопасность",
      icon: "lock"
    },
    {
      id: "authorize",
      href: "/authorize?return=/settings&fromSettings=true",
      title: "Аккаунты",
      icon: "user"
    }
  ];
  
  let section = 0;

  page.subscribe((obj) => {
    if (obj.path == "/app/settings") {
      section = "index";
    } else {
      let page = sections.find((x) => obj.path.includes(x.id)) || { id: "index" };
      section = page.id;
    };
  });
</script>

<!-- Header -->
<div style="z-index: 1;" class="absolute h-24 w-full top-0 w-full flex items-center justify-between">
  <!-- Current Account -->
  <div class="flex items-center px-12 relative">
    <div style="background: url({ $profile.internalAvatar }); background-size: cover;" class="w-12 h-12 rounded-md relative"></div>

    <div class="mx-2">
      <h1 class="text-md text-white font-medium">{ $profile.nickname == null ? $profile.displayName : $profile.nickname }</h1>
      <p class="text-sm text-gray-100 opacity-80">{ $profile.email }</p>
    </div>

    <!-- Links -->
    <div class="flex items-center ml-3">
      { #each sections as s }
        <div on:click={(e) => {
          goto(s.href);
        }} class="transition duration-300 ease-in-out cursor-pointer flex items-center px-4 py-2 { s.id == section ? "text-white border-b-2 border-solid border-indigo-400" : "text-gray-200 opacity-75" } text-xs relative">
          { #if s.id == section }
            <div in:fade>
              <Icon name="{ s.icon }" attrs={{ width: "1.1rem", height: "1.1rem", color: "#7f9cf5", class: "mr-2" }} />
            </div>
          { /if }
          
          { s.title }
        </div>            
      { /each }
    </div>
  </div>

  <!-- Links -->
  <div class="flex items-center px-8">
    <!-- <img class="h-6" src="./logotype/small-white.svg" alt="">
    -->
    <div class="flex items-center ml-2">
      <a class="text-xs opacity-75 text-white mx-4" href="https://gaming.lococovu.me">Игры</a>
      <a class="text-xs opacity-75 text-white mx-4" href="https://gaming.lococovu.me">Облако</a>
      <!-- <a class="border-b border-solid border-indigo-400 text-sm text-white mx-4" href="/settings">Настройки</a> -->
    </div>
  </div>

  <!-- Buttons -->
</div>
