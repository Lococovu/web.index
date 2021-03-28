<script>
  // Importing modules
  import { goto, stores } from "@sapper/app";
  const { page } = stores();
  
  import { onMount } from "svelte";
  import { minecraft } from "../../../actions/authorize/callback";

  // Importing stores
  import profile from "../../../stores/profile.js";
  import accounts from "../../../stores/accounts.js";

  // Importing actions
  import getProfile from "../../../actions/profile/getProfile.action";

  // Importing components
  import Spinner from "../../../components/Loader/Spinner.svelte";
  import Background from "../../../components/Layout/Background.svelte";
  import PageTransition from "../../../components/Loader/PageTransition.svelte";
  
  import { Profile } from "../../../components/cards";
  import { H2, H3, Paragraph, Caption } from "../../../components/typography";
  import Icon from "../../../components/Icon.svelte";

  // Crying man images
	let images = {
    sad: [
      "/icons/sad_man.gif",
      "/icons/sad_man_2.gif",
      "/icons/sad_spiderman.gif",
    ],
    happy: [
      "/icons/happy_dog_01.gif",
      "/icons/happy_dog_02.gif",
      "/icons/happy_dog_03.gif",
    ]
  };

  function chooseAnother() {
    goto(`/authorize?return=${encodeURIComponent(`${$page.path}`)}${ window.location.search != null ? `&query=${encodeURIComponent(window.location.search)}` : "" }&action=choose&title=authorization.callback.title&subtitle=authorization.callback.subtitle`);
  };

  function registerCode() {
    state = null;
    loading = true;

    if ($accounts.profiles.length > 1) {
      if ($page.query.token == null) {
        goto(`/authorize?return=${encodeURIComponent(`${$page.path}`)}${ window.location.search != null ? `&query=${encodeURIComponent(window.location.search)}` : "" }&action=choose&title=authorization.callback.title&subtitle=authorization.callback.subtitle`);
      } else {
        finish($page.query.token);
        return;
      };
    } else {
      finish($profile.token);
      return;
    };
  };

  function finish(token) {
    minecraft.finish($page.params.code, token)
    .then(() => {
      state = "ok";
    }).catch(() => {
      state = "error";
    });
  };

  // onMoune event
  // - Here we'll check if player
  // even logged in
  onMount(async () => {
    if ($profile.id == null && $accounts.profiles.length < 1) {
      goto(`/authorize?return=${encodeURIComponent(`${$page.path}`)}${ window.location.search != null ? `&query=${encodeURIComponent(window.location.search)}` : "" }&action=authorization&title=authorization.callback.title&subtitle=authorization.callback.subtitle`);
    } else {
      if ($profile.id == null && $page.query.token == null ) {
        getProfile($accounts.profiles[0].token)
        .then((response) => {
          uid = response.id;
          loading = false;
        }).catch(() => state == "error");
      } else {
        // Let's now check account information
        if ($page.query.token != null && $page.query.token != $profile.token) {
          getProfile($page.query.token)
          .then((response) => {
            uid = response.id;
            loading = false;
          }).catch(() => state = "error");
        } else {
          uid = $profile.id;
          loading = false;
        };
      };
    }
  });
  
  // Nice Variables
  let uid;
  let state;
  let loading = true;
</script>

<!-- Background && PageTransition -->
<Background /> <PageTransition />

<!-- Page's Layout -->
<main class="relative px-6 lg:px-0 w-full h-screen flex justify-center items-center">
  <!-- Header -->
  <div style="z-index: 2;" class="absolute h-24 w-full top-0 w-full px-8 flex items-center justify-between lg:justify-start">
    <!-- Logotype -->
    <div class="flex items-center">
      <img style="height: 1.5rem;" src="./logotype/small-white.svg" alt="Lococovu Logotype">
      
      <!-- Divider -->
      <div style="width: 1.2px; height: 1.35rem;" class="hidden lg:block mx-2 rounded-md bg-white"></div>

      <p class="hidden lg:block text-md text-white">Подтверждение</p>
    </div>

    <!-- Links -->
    <div class="flex items-center ml-2">
      <a class="text-xs text-white mx-4 opacity-50" href="/">Главная</a>
      
      <a class="hidden lg:block border-b border-solid border-indigo-400 text-sm text-white mx-4" href="/authorization">Подтверждение</a>
    </div>
  </div>
  
  <!-- Everything's Okay -->
  { #if state == "ok" }
    <div class="w-full lg:w-1/3 h-1/2 flex items-center justify-center rounded-md bg-input relative">
      <!-- Texts -->
      <div style="z-index: 2;" class="flex flex-col items-center text-center px-6">
        <!-- Logotype -->
        <img class="w-1/6 mb-2" src="./logotype/small-white.svg" alt="">

        <!-- Texts -->
        <H2>Авторизовано</H2>
        <Paragraph>Вы успешно авторизовались. Теперь вы можете вернуться обратно в Майнкрафт и начать играть и веселиться!</Paragraph>
      </div>

      <!-- Happy Background -->
      <div style="background-image: url({ images.happy[Math.floor(Math.random() * images.happy.length)] }); background-size: cover;" class="absolute inset-0 w-full h-full rounded-md opacity-60"></div>
    </div>
  <!-- Error -->
  { :else if state == "error" }
    <div class="w-full lg:w-1/3 h-1/2 flex items-center justify-center rounded-md bg-input relative">
      <div style="z-index: 2;" class="flex flex-col items-center text-center px-6">
        <H2>Ничего не найдено</H2>
        <Paragraph>Вероятнее всего, произошла какая-то ошибка. Просто проигнорируйте. Ну или не проигнорируйте. Всё от вас зависит.</Paragraph>
      </div>

      <!-- Sad Background -->
      <div style="background-image: url({ images.sad[Math.floor(Math.random() * images.sad.length)] }); background-size: cover;" class="absolute inset-0 w-full h-full rounded-md opacity-60"></div>
    </div>
  <!-- Loader -->
  { :else if state == null && loading == true }
    <Spinner size="20" color="#fff" />
  <!--  -->
  { :else }
    <!-- Main Container -->
    <section class="relative w-full lg:w-1/2 h-full flex flex-col items-center justify-center">
      <!-- Content -->
      <div style="z-index: 2;" class="w-full lg:w-2/3 h-2/3 flex flex-col items-center justify-center px-4">
        <!-- Text -->
        <div class="text-center">
          <H3 white>Подтверждение</H3>
          <Caption white>Хотите ли вы использовать именно этот аккаунт для авторизации на сервере Майнкрафт?<br /><br />Если нет, то нажмите на кнопку "Выбрать другой аккаунт"</Caption>
        </div>

        <!-- Profile Card -->
        <div class="mt-4 px-4 w-full">
          <Profile id={uid} classes="w-full border-2 border-indigo-400 border-solid">
            <div slot="subtext">
              <Caption>Будет использован для авторизации</Caption>
            </div>
          </Profile>
        </div>

        <!-- Buttons -->
        <div class="w-full mt-4 px-4 flex">
          <!-- Other Account -->
          <button on:click={(e) => chooseAnother()} class="w-full mr-4 px-4 h-8 rounded-md bg-icon-button flex items-center justify-center">
            <!-- Icon -->
            <Icon name="refresh-cw" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
            
            <!-- Caption -->
            <Caption classes="ml-2" opacity={false}>Выбрать другой</Caption>
          </button>

          <!-- Proceed -->
          <button on:click={() => registerCode()} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="w-full px-4 h-8 rounded-md bg-icon-button">
            <Caption opacity={false}>Продолжить</Caption>
          </button>    
        </div>
      </div>
    </section>
  { /if }
</main>