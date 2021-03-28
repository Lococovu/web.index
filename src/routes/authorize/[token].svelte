<script>
  // Importing modules
  import Icon from "../../components/Icon.svelte";

  import { goto } from "@sapper/app";
  import { onMount } from "svelte";

  import { stores } from "@sapper/app";
  const { page } = stores();

  // Importing actions
  import authorizeProfile from "../../actions/profile/authorizeProfile.action";

  // Some variables
  let error;

  // onMount event
  // - Here we'll authorize
  // this user and save his information
  // (token) into cookies storage
  onMount(() => {
    authorizeProfile($page.params.token);
  });
</script>

<main class="w-full h-screen bg-container flex flex-col items-center justify-center">
  <div class="w-1/3 flex flex-col justify-center items-center text-center">
    { #if error }
      <!-- Logotype -->
      <Icon name="alert-triangle" attrs={{ width: "1.5rem", height: "1.5rem", class: "text-red-400" }} />

      <!-- Text -->
      <h1 class="text-base text-white font-medium mt-2">Произошла какая-то ошибка.</h1>
      <p class="text-xs text-gray-100">Уупсс... Что-то пошло не так. Лучше всего просто написать Администрации сайта через <a class="border-b border-dotted border-gray-100" href="https://discord.gg/36c2k7PFNj">наш Дискорд</a>. Мы всегда будем рады помочь!</p>    
    
      <!-- Buttons -->
      <div class="w-full flex mt-6">
        <!-- Our Discord -->
        <button on:click={(e) => {
          window.location.href = "https://discord.gg/36c2k7PFNj";
        }} class="mx-3 w-full px-4 py-1 rounded-md bg-icon-button flex items-center justify-center">
          <!-- Icon -->
          <img style="height: 1rem; width: 1rem;" src="./icons/Discord-Logo-White.svg" alt="">

          <!-- Text -->
          <p class="text-sm text-white ml-2">Наш Дискорд</p>
        </button>

        <!-- Go to Index -->
        <button on:click={(e) => {
          goto('/');
        }} class="mx-3 w-full px-4 py-1 rounded-md bg-icon-button flex items-center justify-center">
          <!-- Icon -->
          <Icon name="home" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />

          <!-- Text -->
          <p class="text-sm text-white ml-2">На Главную</p>
        </button>
      </div>
    { :else }
      <!-- Logotype -->
      <div style="animation: pulse 1.5s infinite ease-in-out;" class="w-4/12 lg:w-1/12 relative flex justify-center">
        <img class="w-full" src="./logotype/small-white.svg" alt="Lococovu Logotype">
      </div>

      <!-- Text -->
      <h1 class="text-sm text-white font-medium opacity-75 mt-2">Обрабатываем...</h1>
    { /if }
  </div>
</main>