<script>
  // Importing modules
  import { goto } from "@sapper/app";

  import Cookie from "cookie-universal";
  const cookies = Cookie();
</script>

<div class="w-1/4 h-1/2 opacity-50 mx-4 px-4 md:px-6 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-md mx-2">
  <!-- Title -->
  <div class="flex text-center">
    <img style="width: 1rem; height: 1rem;" src="./icons/pensive-face.png" alt="Sad Emoji">

    <h1 class="text-md text-white">Тут должна была быть красивая картинка</h1>
  </div>

  <!-- Description -->
  <p class="mt-2 text-sm text-white opacity-75 text-center">У нас совсем нету денег и умений на создание красивых картинок... Поэтому их тут не будет. Зато вы можете посмотреть на мемы!</p>

  <!-- Button -->
  <button class="mt-3 bg-input rounded-md px-4 py-2 flex justify-center items-center">
    
    <!-- Title -->
    <p class="text-white text-sm opacity-75">Загрузить рандомный мем</p>
  </button>

</div>

<!-- Text -->
<div class="w-1/2 mx-4 h-1/2 relative">
  <!-- Title -->
  <div class="w-full text-center">
    <h1 class="text-3xl text-white">Добро пожаловать!</h1>
    <p class="text-md text-white opacity-75">Давайте знакомится!</p>
  </div>

  <!-- Description -->
  <div class="mt-4">
    <p class="text-base text-white opacity-75">Добро пожаловать на Лококову! Для начала Вам нужно пройти совсем небольшой туториал, который расскажет про сам сервис и про то, как тут всё работает.<br /><br />Если вы хотите начать этот небольшой туториал - то просто нажмите на соответствующую кнопку. Вы так же можете пропустить этот туториал и попытаться разобраться во всем самостоятельно. Выбирайте сами!</p>
  
    <!-- Buttons -->
    <div class="w-full flex mt-4">
      <!-- Close -->
      <button on:click={(e) => {
        cookies.set('tutorial', true, { path: "/" });

        goto('/app');
      }} class="w-1/2 mr-4 bg-input rounded-md px-4 py-2 flex justify-center items-center">
        
        <!-- Title -->
        <p class="text-white text-sm opacity-75">Не хочу читать</p>
      </button>

      <!-- Continue -->
      <button on:click={(e) => {
        goto('/start/how-it-works');
      }} class="w-1/2 ml-4 bg-input rounded-md px-4 py-2 flex justify-center items-center">
    
        <!-- Title -->
        <p class="text-white text-sm opacity-75">Я готов, продолжаем!</p>
      </button>
    </div>
  </div>

  <!-- Dots -->
  <div class="absolute bottom-0 w-full flex justify-center items-center pb-2">
    <div class="mx-2 w-4 h-4 rounded-full bg-white"></div>
    <div class="mx-2 w-3 h-3 rounded-full border-2 border-white opacity-50"></div>
    <div class="mx-2 w-3 h-3 rounded-full border-2 border-white opacity-50"></div>
  </div>
</div>