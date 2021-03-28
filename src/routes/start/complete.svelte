<script>
  // Importing modules
  import { goto } from "@sapper/app";

  import Cookie from "cookie-universal";
  const cookies = Cookie();
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
</style>

<div class="w-1/4 h-1/2 opacity-80 mx-4 px-4 md:px-6 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-md mx-2">
  <img class="w-3/4 opacity-75" src="./icons/pomhappy.png" alt="Happy emoji">

  <p style="font-family: 'Caveat', cursive;" class="text-xl text-white transform -rotate-3 mt-6">Мы действительно рады вас видеть!</p>
</div>

<!-- Text -->
<div class="w-1/2 mx-4 h-1/2 relative">
  <!-- Title -->
  <div class="w-full text-center">
    <h1 class="text-3xl text-white">Конец</h1>
    <p class="text-md text-white opacity-75">Вот вы и готовы приступить к игре!</p>
  </div>

  <!-- Description -->
  <div class="mt-4">
    <p class="text-base text-white opacity-75">Вот мы Вы и закончили этот небольшой туториал! Надеемся что он Вам понравился и что он был действительно полезным. Мы старались, делая это его и весь этот сервис {"<"}3<br /><br />Вы уже авторизовались и даже попробывали запустить свой первый сервер! И да, это сообщение увидят не все. Вероятнее всего, большинство просто пропустит этот туториал. Грустно, но тем не менее. Мы Вас поздравляем и желаем приятной игры!</p>
  
    <!-- Buttons -->
    <div class="w-full flex mt-4">
      <!-- Close -->
      <button on:click={(e) => {
        cookies.set('tutorial', false, { path: "/" });

        goto('/start');
      }} class="w-1/2 mr-4 bg-input rounded-md px-4 py-2 flex justify-center items-center">
        
        <!-- Title -->
        <p class="text-white text-sm opacity-75">Пройти ещё раз</p>
      </button>

      <!-- Continue -->
      <button class="w-1/2 ml-4 bg-input rounded-md px-4 py-2 flex justify-center items-center">
        <!-- Icon -->
        <img style="height: 1rem; width: 1rem;" src="./icons/smiling-face-with-smiling-eyes-and-three-hearts.png" alt="Heart Icon">

        <!-- Title -->
        <p class="text-white text-sm opacity-75 ml-2">Перейти на Главную</p>
      </button>
    </div>
  </div>
</div>