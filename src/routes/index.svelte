<script>
  // Importing modules
  import { goto } from "@sapper/app";
  import { fade } from "svelte/transition";
  
  // Importing components
  import PageTransition from "../components/Loader/PageTransition.svelte";
  import Background from "../components/Layout/Background.svelte";

  import Icon from "../components/Icon.svelte";
  import { Caption } from "../components/typography";

  let gamingHover = false;
  let accountsHover = false;
</script>

<!-- Main Page's Layout -->
<Background /> <PageTransition />

<main style="z-index: 1;" class="relative w-full h-screen flex items-center justify-center">
  <!-- Header -->
  <header class="absolute top-0 h-16 px-8 w-full flex justify-between items-center">
    <!-- Logotype -->
    <div class="flex items-center">
      <img class="w-6 h-6" src="./logotype/small-white.svg" alt="">
    
      <!-- Links -->
      <div class="flex items-center">
        <a class="border-b border-solid border-indigo-400 text-sm text-white mx-4" href="/">Главная</a>
        <a class="text-xs text-gray-100 mx-4" href="/">Игры</a>
        <a class="text-xs text-gray-100 mx-4" href="/">Облако</a>
        <a class="text-xs text-gray-100 mx-4" href="/">Команда</a>
      </div>
    </div>
  </header>

  <!-- Text -->
  <div style="z-index: 0;" class="w-1/3 text-center pb-24">
    <h1 class="text-4xl text-white">Выберите то, что вам больше нравится</h1>
    <p class="mt-3 text-xs text-gray-100 opacity-80">У нас не так уж и много выбора... Ну хотя бы не как в Белоруссии))0</p>
  </div>

  <!-- Items -->
  <div style="z-index: 1;" class="absolute px-16 inset-y-0 bottom-0 w-full h-full flex items-end">
    <!-- Cloud -->
    <div class="relative w-1/3 px-4 h-1/3 opacity-70">
      <div class="w-full px-6 h-full bg-gray-100 py-6 rounded-t-md shadow-md">
        <!-- Logotype -->
        <div class="flex items-center opacity-85 mb-2">
          <img class="w-5 h-5" src="./icons/when_rejected.png" alt="">
          <p class="text-sm text-black ml-1">В разработке</p>
        </div>
  
        <!-- Title -->
        <h1 class="text-4xl text-black font-medium">Облако</h1>
        <p class="text-base text-gray-900 opacity-80">Недорого продаём мощности других компаний</p>
  
        <!-- Description -->
      </div>
    </div>

    <!-- Gaming -->
    <div class="transition duration-300 ease-in-out relative w-1/3 px-4 { gamingHover ? "h-2/3" : "h-1/3" }">
      <div on:mouseenter={(e) => gamingHover = true} on:mouseleave={(e) => gamingHover = false} style="z-index: 1;" class="w-full px-6 h-full bg-gray-100 py-6 flex flex-col rounded-t-md shadow-md">
        <!-- Logotype -->
        <div class="flex items-center opacity-85 mb-2">
          <img class="w-5 h-5" src="./icons/video-game.png" alt="">
          <p class="text-sm text-black ml-1">Скоро запуск!</p>
        </div>

        <!-- Title -->
        <h1 class="text-4xl text-black font-medium">Игры</h1>
        <p class="text-base text-gray-900 opacity-80">Создаём крутейшие игры и даём их всем вам</p>
  
        <!-- Description -->
        { #if gamingHover }
          <div in:fade style="overflow: hidden; overflow-y: auto;" class="relative mt-6 w-full flex-grow">
            <div class="absolute inset-0 w-full h-full">
              <!-- Small Description -->
              <div class="w-full">
                <!-- Title -->
                <div class="flex items-center">
                  <!-- Icon -->
                  <img class="w-4 h-4" src="./icons/inbox-tray.png" alt="">

                  <!-- Text -->
                  <h1 class="ml-1 text-xl text-black font-medium">Вкратце</h1>
                </div>

                <!-- Text -->
                <p class="mt-2 text-gray-900 opacity-90">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae nisi cupiditate nulla soluta eveniet provident, tempore delectus! Illum fuga laborum, est esse nemo qui consectetur.</p>
              </div>

              <!-- Button -->
              <div class="absolute bottom-0 mt-4 w-full p-2">
                <button on:click={(e) => {
                  window.location.href = "https://gaming.lococovu.me";
                }} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="w-full rounded-md px-4 h-8 flex items-center justify-center">
                  <!-- Icon -->
                  <Icon name="link" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
                  
                  <!-- Text -->
                  <Caption classes="ml-1" opacity={false}>Перейти</Caption>
                </button>
              </div>

            </div>
          </div>
        { /if }
      </div>
    </div>

    <!-- Account -->
    <div class="relative w-1/3 px-4 { accountsHover ? "h-2/3" : "h-1/3" }">
      <div on:mouseenter={(e) => accountsHover = true} on:mouseleave={(e) => accountsHover = false} class="w-full px-6 h-full bg-gray-100 py-6 flex flex-col rounded-t-md shadow-md">
        <!-- Logotype -->
        <div class="flex items-center opacity-85 mb-2">
          <img class="w-5 h-5" src="./icons/pomhappy.png" alt="">
          <p class="text-sm text-black ml-1">Обновление дизайна</p>
        </div>
  
        <!-- Title -->
        <h1 class="text-4xl text-black font-medium">Аккаунты</h1>
        <p class="text-base text-gray-900 opacity-80">Настройте свои аккаунты имеено так, как надо вам</p>
  
        <!-- Description -->
        { #if accountsHover }
          <div in:fade style="overflow: hidden; overflow-y: auto;" class="relative mt-6 w-full flex-grow">
            <div class="absolute inset-0 w-full h-full">
              <!-- Small Description -->
              <div class="w-full">
                <!-- Title -->
                <div class="flex items-center">
                  <!-- Icon -->
                  <img class="w-4 h-4" src="./icons/inbox-tray.png" alt="">

                  <!-- Text -->
                  <h1 class="ml-1 text-xl text-black font-medium">Вкратце</h1>
                </div>

                <!-- Text -->
                <p class="mt-2 text-gray-900 opacity-90">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae nisi cupiditate nulla soluta eveniet provident, tempore delectus! Illum fuga laborum, est esse nemo qui consectetur.</p>
              </div>

              <!-- Button -->
              <div class="absolute bottom-0 mt-4 w-full p-2">
                <button on:click={(e) => {
                  goto('/authorize');
                }} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="w-full rounded-md px-4 h-8 flex items-center justify-center">
                  <!-- Icon -->
                  <Icon name="link" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
                  
                  <!-- Text -->
                  <Caption classes="ml-1" opacity={false}>Перейти</Caption>
                </button>
              </div>

            </div>
          </div>
        { /if }
      </div>
    </div>
  </div>
</main>

<div class="hidden">
  <div class="w-1/6"></div>
  <div class="w-2/6"></div>
  <div class="w-3/6"></div>
  <div class="w-4/6"></div>
  <div class="w-5/6"></div>
  <div class="w-6/6"></div>
</div>