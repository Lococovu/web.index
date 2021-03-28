<script>
  // Importing modules
  import { goto } from "@sapper/app";
  import profile from "../../../stores/profile.js";
  import { fade } from "svelte/transition";

  import { onMount } from "svelte";

  import { stores } from "@sapper/app";
  const { page } = stores();

  import storage from "local-storage";

  import axios from "axios";

  import Cookie from "cookie-universal";
  const cookies = Cookie();

  // Importing components
  import Icon from "../../../components/Icon.svelte";
  import PageTransition from "../../../components/Loader/PageTransition.svelte";
  import Spinner from "../../../components/Loader/Spinner.svelte";

  let loading = false;

  // Some bindable variables
  let nickname    = $profile.nickname;
  let description = $profile.description;

  // Function, that'll update our user
  // information and that'll move us to next
  // step (security)
  function nextStep() {
    loading = true;

    // Now let's get our current account token
    let token = cookies.get('token');
    let type  = "token";

    if ($profile.security.pincode != null) {
      type  = "code";
      token = storage.get(`AT-${$profile.id}`);

      // Let's check if we have any Security Codes
      // passed to our page query
      if (token == null) {
        if ($page.query.code != null) {
          token = $page.query.code;
        } else {
          storage.set('temp-wizard-nickname', nickname);
          storage.set('temp-wizard-description', description);

          goto(`/authorize/pincode?token=${cookies.get('token')}&return=${encodeURIComponent(`/start/profile?nextStep=true&id=${$profile.id}`)}&type=confirmation&action=informationChange`);
        };
      };
    };

    // And now let's update our account information
    if (token != null) {
      axios.post(`https://lococovu.me/api/profile/${ type == "token" ? token : `-${token}` }/information`, { nickname, description })
      .then(() => {
        // And now let's update our current profile
        // information
        setTimeout(() => {
          profile.loadProfile(cookies.get('token'))
          .then(() => {
            goto('/start/profile/security');
          }).catch(() => {
            goto('/start/profile/security');
          });
        }, 250);
      }).catch((error) => {
        // TODO
        console.log(error)
        loading = false;
      });
    }

  };

  onMount(() => {
    if ($page.query.nextStep) {
      loading = true;

      nickname    = storage.get('temp-wizard-nickname');
      description = storage.get('temp-wizard-description');

      setTimeout(() => {
        nextStep();

        storage.remove('temp-wizard-nickname');
        storage.remove('temp-wizard-description');
      }, 250);
    };
  });
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
</style>

<!-- Page Transition -->
<PageTransition />

<!-- Background -->
<div style="background-image: url('/background/1.svg'); z-index: 1;" class="background absolute inset-0 w-full h-full"></div>

<div style="z-index: 2;" class="w-1/3 h-full flex flex-col items-center justify-center">
  <!-- Profile: Avatar -->
  <div class="flex items-center">
    <div style="background: url({ $profile.internalAvatar }); background-size: cover;" class="w-16 h-16 rounded-md relative">
      <div style="background: rgba(0,0,0,0.5);" class="absolute inset-0 w-full h-full rounded-md flex justify-end p-1.5">
        <Icon name="edit-2" attrs={{ width: "0.8rem", height: "0.8rem", color: "#fff" }} />
      </div>
    </div>

    <!-- Profile: Texts -->
    <div class="ml-4 opacity-80">
      <h1 class="text-xl text-white">{ $profile.nickname == null ? $profile.displayName : $profile.nickname }</h1>
      <p class="text-sm text-gray-100">{ $profile.email }</p>

      <p class="text-xs text-gray-100 opacity-80">Не вы? <a class="border-b border-dotted border-gray-100" href="/authorize?return=/start/profile">Поменяйте аккаунт</a></p>
    </div>
  </div>

  <div class="flex flex-col justify-center items-center relative">
    <!-- Texts -->
    <h1 class="mt-8 mb-4 text-xl text-white font-medium text-center">Создайте свой <span class="border-b border-dotted border-gray-100">Игровой профиль</span></h1>

    <!-- Nickname -->
    <div class="flex w-5/6 bg-input p-2 rounded-md mr-3 relative">
      <!-- Icon -->
      <div class="w-8 h-8 rounded-md bg-icon-button flex justify-center items-center mr-2">
        <Icon name="user" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
      </div>

      <!-- Input itself -->
      <input disabled={ $profile.id == null || loading } on:keypress={(e) => {
        if (nickname != null && nickname.split('').length >= 16) {
          e.preventDefault();
        };
      }} bind:value={nickname} class="{ $profile.id == null || loading ? "opacity-60" : "" } text-sm w-full text-gray-400 bg-input" placeholder="Ник" type="text">

      <!-- Word Counter -->
      <div class="absolute inset-y-0 right-0 h-full flex items-center p-2">
        <p class="text-sm text-white opacity-50">{ nickname != null ? nickname.split('').length : 0 }/16</p>
      </div>
    </div>

    <p class="mt-2 text-xs text-white opacity-60 w-5/6">Игровой ник, это ник, который будет автоматически присваиваться Вам на наших серверах. Так же с помощь. этого ника другие игроки смогут найти Вас в списке друзей.</p>

    <!-- Account Description -->
    <div class="flex items-start w-5/6 h-2/6 bg-input p-2 mt-4 rounded-md mr-3 relative">
      <!-- Icon -->
      <div class="w-8 h-8 rounded-md bg-icon-button flex justify-center items-center mr-2">
        <Icon name="feather" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
      </div>

      <!-- Input itself -->
      <textarea disabled={ loading } on:keypress={(e) => {
        if (description != null && description.split('').length >= 2000) {
          e.preventDefault();
        };
      }} bind:value={description} class="{ loading ? "opacity-60" : "" } w-full h-full bg-input text-gray-400 text-sm pt-1.5" placeholder="Описание"></textarea>

      <!-- Word Counter -->
      <div class="absolute bottom-0 right-0 p-2">
        <p class="text-sm text-white opacity-50">{ description != null ? description.split('').length : 0 }/2000</p>
      </div>
    </div>

    <p class="mt-2 text-xs text-white opacity-60 w-5/6">Краткое описание профиля, в котором вы можете написать всё, что захотите! Расскажите про себя, что любите делать и где играть.</p>

    <!-- Buttons -->
    <div class="mt-8 w-5/6 flex justify-center items-center">
      <button disabled={ loading } class="w-full mr-4 bg-input rounded-md px-4 py-2 flex justify-center items-center">
        
        <!-- Title -->
        <p class="text-white text-sm opacity-75">Отмена</p>
      </button>

      <button disabled={ loading } on:click={() => {
        nextStep();
      }} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="w-full bg-input rounded-md px-4 py-2 flex justify-center items-center relative">
        <!-- Loading Screen -->
        { #if loading }
          <div in:fade style="z-index: 2;" class="absolute inset-0 w-full h-full rounded-md bg-input flex justify-center items-center">
            <Spinner size={15} color="#fff" />
          </div>
        { /if }

        <!-- Title -->
        <p class="text-white text-sm opacity-75">Продолжить</p>
      </button>
    </div>
  </div>
</div>