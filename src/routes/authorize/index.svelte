<script>
  // Importing modules
  import { _ } from "svelte-i18n";

  import { fade } from "svelte/transition";  
  import accounts from "../../stores/accounts.js";
  import profile from "../../stores/profile.js";

  import Spinner from "../../components/Loader/Spinner.svelte";

  import storage from "local-storage";

  import { stores } from "@sapper/app";
  const { page } = stores();

  import Cookie from "cookie-universal";
  const cookies = Cookie();

  // Importing actions
  import authorizeProfile from "../../actions/profile/authorizeProfile.action";

  // Importing components
  // - other
  import Icon from "../../components/Icon.svelte";
  import PageTransition from "../../components/Loader/PageTransition.svelte";
  import Background from "../../components/Layout/Background.svelte";

  // - cards
  import { Profile } from "../../components/cards";

  // - typography
  import { H2, Paragraph, Caption } from "../../components/typography";

  import SettingsHeader from "../../components/Layout/SettingsHeader.svelte";

  let profiles = [];
  
  // Let's now subscribe to our accounts store.
  accounts.subscribe((obj) => {
    if (obj.profiles != null) {
      // Sorting profiles
      profiles = obj.profiles.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    
      // Let's now check if this account
      // needs any authorization codes
      profiles = profiles.map((x) => {
        let profile = x;

        if (storage.get(`AT-${x.id}`)) profile.securityCode = storage.get(`AT-${x.id}`);

        return profile
      });
    };
  });

  // Function to logout from account
  function logout() {
    // Let's just delete current cookie
    // and delete this profile's information
    if (storage.get(`AT-${$profile.id}`)) {
      storage.remove(`AT-${$profile.id}`)
    };

    profile.forceProfile({ id: null });
    cookies.remove("token", { path: "/" });
  };

  // Function, that'll switch to this
  // account (we'll just use authorizeProfile action)
  function switchTo(token) {
    let attrs = { storeInCookies: true };
    if ($page.query.action == "choose") attrs.storeInCookies = false;

    authorizeProfile(token, null, attrs);
  };

  // Function, that'll redirect user
  // to Google Authorization page
  function authorizeGoogle() {
    buttonClicked = true;

    let callback = {
      url: $page.query.return,
      query: $page.query.query
    };

    // And now let's save it
    // TODO: 
    if (callback.url != null) storage.set('auth.callback', JSON.stringify(callback));

    window.location.href = "https://authed.unfull.ml/callback?url=https://lococovu.me/authorize/:token&provider=google&design=%7B%22appBackground%22%3A%22%23151820%22%2C%22loaderBackground%22%3A%22%23151820%22%2C%22loaderColor%22%3A%22%23fff%22%2C%22containerBackground%22%3A%22%23151820%22%2C%22logotypeColor%22%3A%22%23fff%22%2C%22textHeading%22%3A%22%23fff%22%2C%22textParagraph%22%3A%22%23F3F4F5%22%7D";
  };

  let buttonClicked = false;
</script>

<!-- Background && PageTransition -->
<Background />
{ #if !$page.query.fromSettings }
  <PageTransition />
{ /if }

<!-- Page's Layout -->
<main class="w-full h-screen relative flex justify-center">
  <!-- Header -->

  { #if $page.query.fromSettings }
    <SettingsHeader />
  { :else }
    <div style="z-index: 2;" class="absolute h-24 w-full top-0 w-full px-8 flex items-center justify-between lg:justify-start">
      <!-- Logotype -->
      
      <div class="flex items-center">
        <img style="height: 1.5rem;" src="./logotype/small-white.svg" alt="Lococovu Logotype">
        
        <!-- Divider -->
        <div style="width: 1.2px; height: 1.35rem;" class="hidden lg:block mx-2 rounded-md bg-white"></div>

        { #if $accounts.profiles.length > 0 }
          <p class="hidden lg:block text-md text-white">Аккаунты</p>
        { :else }
          <p class="hidden lg:block text-md text-white">Авторизация</p>
        { /if }
      </div>

      <!-- Links -->
      <div class="flex items-center ml-2">
        <a class="text-xs text-white mx-4 opacity-50" href="/">Главная</a>
        
        { #if $accounts.profiles.length > 0 }
          <a class="hidden lg:block border-b border-solid border-indigo-400 text-sm text-white mx-4" href="/authorization">Аккаунты</a>
        { :else }
          <a class="hidden lg:block border-b border-solid border-indigo-400 text-sm text-white mx-4" href="/authorization">Авторизация</a>
        { /if }
      </div>
    </div>
  { /if }

  <!-- Main Container -->
  <section class="relative w-full lg:w-1/2 h-full flex flex-col items-center justify-center">
    <!-- Content -->
    <div style="z-index: 2;" class="w-full lg:w-2/3 h-2/3 flex flex-col items-center justify-center px-4">
      <!-- Text -->
      <div class="text-center">

        <!-- Title TODO -->
        { #if $page.query.title != null }
          <h1 class="text-2xl text-white">{ $_($page.query.title) }</h1>
        { :else }
          { #if $accounts.profiles.length > 0 }
            <h1 class="text-2xl text-white">Аккаунты</h1>
          { :else }
            <h1 class="text-2xl text-white">Авторизация</h1>
          { /if }

        { /if }

        <!-- Subtitle TODO -->
        { #if $page.query.subtitle != null }
          <p class="text-xs text-gray-100">{@html $_($page.query.subtitle)}</p>
        { :else }
          { #if $accounts.profiles.length > 0 }
            <p class="text-xs text-gray-100">Тут будет весь список ваших активных аккаунтов. Просто выбирайте аккаунт и нажимайте на стрелочку вправо. Хотите добавить новый аккаунт? Нажмите на кнопку <span class="border-b border-dotted border-gray-100">"Войти под другим аккаунтом"</span> и следуйте инструкциям!<br /><br />Хотите выйти? Просто нажмите на крестик рядом с вашим текущим аккаунтом.</p>  
          { :else }
            <p class="text-xs text-gray-100">Для того, что бы начать пользоваться нашимы сервисами, Вам нужно авторизоваться.</p>
          { /if }
        { /if }
      </div>

      <!-- Profiles List -->
      <div style="overflow: hidden; overflow-y: auto;" class="mt-4 px-4 { $accounts.profiles.length > 0 ? "w-full flex-grow flex flex-col relative" : "" }">
        { #if profiles.length > 0 }
          <div class="absolute inset-0 w-full h-full pr-2">
            { #each profiles as p }
              <Profile let:bottomMenu={settingsMenu} let:account={account} id={p.id} attrs={{ showPasswordAvailability: true, checkSecurityCode: p.securityCode || true }} classes={ $page.query.action != "choose" && $profile.id == p.id ? "border-2 border-indigo-400 border-solid" : "border-2 border-transparent" }>
                <!-- Subtext Section -->
                <div slot="subtext">
                  { #if $page.query.action != "choose" && $profile.id == account.id }
                    <Caption>Текущий аккаунт</Caption>
                  { :else }
                    { #if account.needPassword }
                      <Caption><span class="border-b border-dotted border-gray-100">Требуется авторизация</span></Caption>
                    { :else }
                      <Caption>Email: <span class="border-b border-dotted border-gray-100">{ account.email }</span></Caption>
                    { /if }
                  { /if }
                </div>

                <!-- Buttons Section -->
                <div slot="buttons" class="flex items-center justify-center">
                  
                  <!-- Settings Button -->
                  <button class="{ !account.loaded ? "opacity-50" : "" } { settingsMenu ? "border-2 border-solid border-indigo-400" : "" } transition duration-300 ease-in-out mx-3 w-8 h-8 rounded-md bg-input flex justify-center items-center">
                    { #if account.loaded }
                      <Icon name="settings" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
                    { /if }
                  </button>

                  <!-- Login or Logout Button -->
                  { #if $page.query.action != "choose" && $profile.id == account.id }
                    <!-- Logout Button -->
                    <button on:click={logout(p.token, p.id)} class="{ !account.loaded ? "opacity-50" : "" } transition duration-300 ease-in-out w-8 h-8 rounded-md bg-input flex justify-center items-center">
                      { #if account.loaded }
                        <Icon name="log-out" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
                      { /if }
                    </button>
                  { :else }
                    <!-- Login Button -->
                    <button on:click={switchTo(p.token)} style="{ account.loaded && !account.needPassword ? "background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" : "" }" class="{ !account.loaded ? "opacity-50" : "" } bg-input transition duration-300 ease-in-out w-8 h-8 rounded-md flex justify-center items-center">
                      { #if account.loaded }
                        { #if account.needPassword }
                          <Icon name="log-in" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
                        { :else }
                          <Icon name="chevron-right" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
                        { /if }
                      { /if }
                    </button>
                  { /if }
                </div>
              </Profile>
            { /each }

            <button on:click={(e) => {authorizeGoogle()}} class="relative w-full mt-4 p-3 border border-dashed border-gray-700 rounded-md flex items-center cursor-pointer">
              
              { #if buttonClicked }
                <div in:fade class="absolute inset-0 w-full h-full flex justify-center items-center bg-container rounded-md">
                  <Spinner color="#fff" />
                </div>
              { /if }

              <!-- Logo -->
              <Icon name="log-in" attrs={{ width: "1.5rem", height: "1.5rem", class: "text-white" }} />

              <!-- Texts -->
              <div class="ml-3 text-left">
                <h1 class="text-base text-white">Войти под другим аккаунтом</h1>
                <p class="text-xs text-gray-100">Для данного действия будет использован Ваш личный аккаунт Google</p>
              </div>
            </button>
          </div>
        { :else }
          <button on:click={(e) => {authorizeGoogle()}} class="relative w-full cursor-pointer my-4 p-3 rounded-md bg-icon-button flex items-center opacity-80">
            { #if buttonClicked }
              <div in:fade class="absolute inset-0 w-full h-full flex justify-center items-center bg-icon-button rounded-md">
                <Spinner color="#fff" />
              </div>
            { /if }

            <!-- Logotype -->
            <img style="height: 1.5rem; width: 1.5rem;" src="./logotype/google-white.svg" alt="Google Logotype">

            <!-- Texts -->
            <div class="ml-3 text-left">
              <h1 class="text-base text-white">Использовать Google</h1>
              <p class="text-xs text-gray-100">Для авторизации будет использован ваш личный аккаунт Google</p>
            </div>
          </button>

          <button class="w-full my-4 p-3 border border-dashed border-gray-700 rounded-md flex items-center opacity-50 cursor-not-allowed">
            <!-- Logo -->
            <Icon name="list" attrs={{ width: "1.5rem", height: "1.5rem", class: "text-white" }} />

            <!-- Texts -->
            <div class="ml-3 text-left">
              <h1 class="text-base text-white">Другие методы авторизации</h1>
              <p class="text-xs text-gray-100">Другие методы авторизации нахоядтся в разработке. Скоро всё будет, не переживайте!</p>
            </div>
          </button>
        { /if }
      </div>
    </div>

    <!-- Disclamer -->
    <div style="z-index: 2;" class="absolute bottom-0 w-full flex justify-center items-center py-4">
      <p class="text-xs text-gray-100 opacity-75 w-2/3 text-center">Продолжая, вы соглашаетесь с <span class="border-b border-dotted border-gray-100">Правилами использования сервиса unfull.authed</span> и с <span class="border-b border-dotted border-gray-100">Правилами использования сервиса lococovu.me</span> <br />Там нет ничего странного и необычного, да ага!</p>
    </div>
  </section>
</main>