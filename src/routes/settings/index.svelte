<script>
  // Importing modules
  import { fade, slide } from "svelte/transition";
  import storage from "local-storage";

  // Importing stores
  import profile from "../../stores/profile";

  // Importing components
  import Icon from "../../components/Icon.svelte";
  import { H6, Caption } from "../../components/typography";

  import Spinner from "../../components/Loader/Spinner.svelte";

  // Importing actions
  import updateProfile from "../../actions/profile/updateProfile.action";

  // Variables
  let saving = false;
  let saveTime = 5;

  let interval;

  let nickname = $profile.nickname;
  let description = $profile.description;

  // Function, that'll start our
  // auto-save worker
  function startSaver() {
    saveTime = 5;

    if (!interval && nickname != $profile.nickname || description != $profile.description) {
      interval = setInterval(() => {
        saveTime--;

        if (saveTime <= 0) {
          done();

          // Stopping interval
          clearInterval(interval);
          interval = null;
        };
      }, 1000);
    };
  };

  function done() {
    saving = true;
    saveTime = 5;

    // Getting account token
    let token = $profile.token;
    if ($profile.security.pincode != null) {
      token = storage(`AT-${$profile.id}`);
      if (token != null) {
        token = "-" + token;
      } else {
        // Need to authorize
      };
    };

    // Saving our data
    updateProfile(token, { nickname, description }).then(() => {
      // Updating profile information.
      profile.loadProfile($profile.token)
      .then((response) => {
        nickname = response.nickname;
        description = response.description;
        
        interval = null;
        
        saving = false;
      });
    });
  };
</script>

{ #if saving }
  <div style="z-index: 999;" transition:fade class="absolute inset-0 w-full h-full rounded-md bg-input flex flex-col justify-center items-center">
    <Spinner size="20" color="#fff" />
    <Caption classes="mt-2">Сохраняем...</Caption>
  </div>
{ /if }

<!-- Change Avatar -->
<div in:fade class="px-4 mb-4">
  <H6>Аватар</H6>

  <div class="flex items-center mt-2 p-3 rounded-md border border-gray-800">
    <div style="background: url({ $profile.internalAvatar }); background-size: cover;" class="w-24 h-24 rounded-md relative"></div>

    <!-- Texts + Buttons -->
    <div class="ml-5">
      <!-- Buttons -->
      <div class="flex">
        <!-- Upload -->
        <button style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="px-4 h-8 rounded-md bg-icon-button">
          <Caption opacity={false}>Загрузить новую</Caption>
        </button>            

        <!-- Remove -->
        <button class="ml-4 px-4 h-8 rounded-md bg-icon-button">
          <Caption opacity={false}>Убрать аватарку</Caption>
        </button>
      </div>

      <!-- Texts -->
      <Caption size="xs" classes="mt-2 w-4/6">Принимаются любые картинки, кроме анимированных. Анимированны картинки доступны для пользователе с рангом <span class="border-b border-gray-100 border-dotted">Путин нахуй</span> и выше</Caption>
    </div>
  </div>
</div>


<div in:fade class="w-full flex items-stretch">
  
  <!-- Change Nickname -->
  <div class="w-1/2 px-4 relative">
    <!-- Title + Caption -->
    <H6>Никнейм</H6>

    <div on:click={(e) => {
      let element = document.getElementById("nicknameInput");

      element.focus();
    }} class="flex w-full bg-icon-button p-2 rounded-md mt-3 opacity-80 relative">
      <!-- Icon -->
      <div class="w-8 h-8 rounded-md bg-input flex justify-center items-center">
        <Icon name="hash" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
      </div>

      <!-- Input itself -->
      <input bind:value={nickname} on:keypress={(e) => {
        if (nickname != null && nickname.split('').length >= 16) {
          e.preventDefault();
        };
      }} on:keyup={() => startSaver()} class="ml-2 text-sm text-gray-400 bg-icon-button" placeholder="Никнейм" type="text" id="nicknameInput">
    
      <!-- Save Button -->
      <div class="absolute inset-y-0 right-0 h-full flex items-center p-2">
        <p class="text-sm text-white opacity-50">{ nickname != null ? nickname.split('').length : 0 }/16</p>
      </div>
    </div>

    <p class="mt-2 text-xs text-white opacity-60 w-5/6">Игровой ник, это ник, который будет автоматически присваиваться Вам на наших серверах. Так же с помощь. этого ника другие игроки смогут найти Вас в списке друзей.</p>

  </div>

  <!-- Status -->
  <div class="w-1/2 px-4 relative opacity-50">
    <!-- Title + Caption -->
    <H6>Статус</H6>

    <div class="flex w-full bg-icon-button p-2 rounded-md mt-3 opacity-80 relative">
      <!-- Icon -->
      <div class="w-8 h-8 rounded-md bg-input flex justify-center items-center">
        <Icon name="meh" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
      </div>

      <!-- Input itself -->
      <input on:keypress={(e) => {
        e.preventDefault();
      }} class="ml-2 text-sm text-gray-400 bg-icon-button" placeholder="Плохой день..." type="text">
    
      <div class="absolute inset-y-0 right-0 h-full flex items-center p-2">
        <p class="text-sm text-white opacity-50">{ nickname != null ? nickname.split('').length : 0 }/16</p>
      </div>
    </div>

    <p class="mt-2 text-xs text-white opacity-60 w-5/6">Кастомный статус, который будет отображаться всем пользователям сайта и всем игрокам на сервере. Пока что в разработке</p>
  </div>

</div>

<div in:fade class="w-full flex mt-6">
  <!-- Description -->
  <div class="w-1/2 px-4 relative">
    <!-- Title + Caption -->
    <H6>Описание аккаунта</H6>

    <div class="flex items-start w-full h-3/6 bg-icon-button opacity-80 p-2 mt-4 rounded-md mr-3 relative">
      <!-- Icon -->
      <div class="w-8 h-8 rounded-md bg-input flex justify-center items-center mr-2">
        <Icon name="feather" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
      </div>

      <!-- Input itself -->
      <textarea on:keypress={(e) => {
        if (description != null && description.split('').length >= 2000) {
          e.preventDefault();
        };
      }} bind:value={description} class="w-full h-full bg-icon-button text-gray-400 text-sm pt-1.5" placeholder="Описание"></textarea>

      <!-- Word Counter -->
      <div class="absolute bottom-0 right-0 p-2">
        <p class="text-sm text-white opacity-50">{ description != null ? description.split('').length : 0 }/2000</p>
      </div>
    </div>

    <p class="mt-2 text-xs text-white opacity-60 w-5/6">Краткое описание профиля, в котором вы можете написать всё, что захотите! Расскажите про себя, что любите делать и где играть.</p>

  </div>
</div>

<!-- Saving -->
<div class="absolute top-0 right-0 pt-2 pr-4">
  { #if nickname != $profile.nickname || description != $profile.description && !saving }
    <div transition:slide class="bg-white p-2 opacity-75 rounded-md flex items-center">
      <!-- Texts -->
      <!-- Icon -->
      <Icon name="cloud" attrs={{ width: "1.2rem", height: "1.2rem", color: "#000" }} />

      <!-- Text -->
      <Caption classes="ml-2" opacity={false} dark>Авто-сохранение через <span class="border-b border-dotted border-gray-900">{ saveTime } { saveTime < 5 ? saveTime == 1 ? "секунду" : "секунды" : "секунд" }</span></Caption>
      
      <!-- Button -->
      <button disabled={ saving } on:click={(e) => {
        clearInterval(interval);        
        done();
      }} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="{ saving ? "opacity-50" : "" } ml-4 px-4 h-8 rounded-md bg-icon-button relative">
        { #if saving }
          <div transition:fade style="background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="absolute inset-0 w-full h-full rounded-md flex justify-center items-center">
            <Spinner size={15} color="#fff" />
          </div>
        { /if }
        
        <Caption opacity={false}>Сохранить</Caption>
      </button>
    </div>
  { /if }
</div>