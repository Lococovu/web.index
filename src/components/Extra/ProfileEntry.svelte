<script>
  // Importing modules
  import { goto } from "@sapper/app";
  import profile from "../../stores/profile.js";
  import accounts from "../../stores/accounts.js";

  import { stores } from "@sapper/app";
  const { page } = stores();

  import storage, { get } from "local-storage";

  import moment from "moment";

  import { onMount, afterUpdate } from "svelte";
  import axios from "axios";

  import Cookie from "cookie-universal";
  const cookies = Cookie();

  // Importing components
  import { fade, slide } from "svelte/transition";
  import Icon from "../../components/Icon.svelte";
  import Spinner from "../Loader/Spinner.svelte";
  
  let account = {
    loaded: false,
    security: {}
  };

  let loading      = false;
  let settingsMenu = false;

  // Function, that'll delete this account
  // from account list.
  function deleteFromList() {
    if ($profile.id == account.id) {
      cookies.remove('token', { path: "/" });
    };

    // Now let's just get tokens list
    // and filter it, to remove all
    // accounts with this id.
    let tokens = cookies.get('tokens');
    if (tokens == null) {
      tokens = [];
    } else {
      tokens = tokens.split(',');
    };

    // And now let's filter this list
    let tokensToDelete = $accounts.profiles.filter((x) => x.id == id);

    tokens = tokens.filter((x) => !tokensToDelete.find((d) => d.token == x));
    cookies.set('tokens', tokens.join(','), { path: "/", expires: moment().add('1', 'year').toDate() });

    // Now let's update overall tokens list
    let newAccounts = $accounts.profiles;
    newAccounts = newAccounts.filter((x) => !tokensToDelete.find((d) => d.token == x.token));

    accounts.forceStore({ tokens, profiles: newAccounts });
  };

  // Function, that'll make this account
  // site's current account
  function switchToThis() {
    loading = true;

    // Loading this profile into our profile store
    profile.loadProfile(token)
    .then((store) => {
      loading = false;

      if (!$page.query.chooseOne) cookies.set('token', token, { path: "/", expires: moment().add('1', 'year').toDate() });

      if ($page.query.return != null) {
        // Redirect user to this return page
        if ($page.query.chooseOne) {
          goto(`${$page.query.return}${$page.query.query != null ? `${$page.query.query}&token=${token}` : `?token=${token}`}`);
        } else {
          goto(`${$page.query.return}${$page.query.query != null ? $page.query.query : ""}`);
        };
      } else {
        // Now we'll check if we need to
        // show player tutorial or profile setup page
        if (!cookies.get('tutorial')) {
          // Redirect player to tutorial page
          goto('/start?return=/authorize');
        } else {
          // Redirect to profile setup page
          if (store.nickname == null) {
            goto('/start/profile?return=/authorize');
          } else {
            goto('/app');
          };
        };
      };
    }).catch((error) => {
      if ($page.query.return != null) {
        storage.set('auth-return', $page.query.return);
        storage.set('auth-return-query', $page.query.query);
      };

      if (error == "authorizePincode") {
        goto(`/authorize/pincode?token=${token}`);
      };
    });
  };

  // Function, that'll load account information
  async function loadAccount() {
    // And now let's get this profile's
    // information
    let response = await axios.get(`https://lococovu.me/api/profile/${id}`)
  
    account              = response.data;
    account.loaded       = true;
    account.needPassword = false;
  
    // Let's now check if this account
    // needs any passwords  
    if (account.security.pincode) {
      if (storage.get(`AT-${account.id}`)) {
        axios.get(`https://lococovu.me/api/security/code/${storage.get(`AT-${account.id}`)}`)
        .then(() => {
          account.needPassword = false;
        }).catch(() => {
          storage.remove(`AT-${account.id}`);
          account.needPassword = true;
        });
      } else {
        account.needPassword = true;
      };
    };
  };

  onMount(() => {
    prevId = id;

    loadAccount();
  });

  // Exporting variables
  export let id;
  export let token;

  let prevId;

  // Some exported variables changed.
  // we need to update this account's information
  afterUpdate(() => {
    if (prevId != id) {
      prevId = id;
      account = { loaded: false };
      loadAccount();
    };
  });
</script>

<!-- Profile -->
<div in:fade class="relative w-full pb-4">
  <button class="transition duration-200 ease-in-out relative w-full p-3 rounded-md bg-icon-button flex items-center opacity-80 { !$page.query.chooseOne ? $profile.id == account.id && account.loaded ? "border-2 border-indigo-400" : "border-2 border-transparent" : "border-2 border-transparent" } border-solid ">
    <!-- Loading state -->
    { #if loading }
      <div style="z-index: 999;" in:fade class="absolute bg-icon-button rounded-md inset-0 w-full h-full flex justify-center items-center">
        <Spinner size={20} color="#fff" />
      </div>
    { /if }
    
    <!-- Icon -->
    <div style="background-image: url('{ account.internalAvatar }'); background-size: cover; background-position: center;" class="transition duration-300 ease-in-out relative w-12 h-12 rounded-md bg-input { !account.loaded ? "bg-input opacity-50" : "" }">
      <!-- Account has extra password -->
      { #if account.loaded }
        { #if account.security.pincode }
          <div style="right: -0.5rem; top: -0.5rem;" in:fade class="absolute w-6 h-6 flex justify-center items-center rounded-full bg-input">
            <Icon name="lock" attrs={{ width: "0.7rem", height: "0.7rem", color: "#fff", "stroke-width": "2.5" }} />
          </div>
        { /if }
      { /if }
    </div>

    <!-- Texts -->
    { #if !account.loaded }
      <div class="w-1/2 ml-3">
        <div class="w-{ Math.floor(Math.random()*(6 - 4 + 1) + 4) }/6 h-4 rounded-full bg-input opacity-50"></div>
        
        <div class="flex">
          <div class="mt-2 w-{ Math.floor(Math.random()*(4 - 2 + 1) + 2) }/6 h-3 rounded-full bg-input opacity-50"></div>
          <div class="ml-3 mt-2 w-{ Math.floor(Math.random()*(4 - 2 + 1) + 2) }/6 h-3 rounded-full bg-input opacity-50"></div>
        </div>
      </div>
    { :else }
      <div class="ml-3 text-left">
        <h1 in:fade class="text-base text-white ">{ account.nickname == null ? account.displayName : account.nickname }</h1>
        
        { #if account.needPassword }
          <p in:fade class="text-xs text-gray-100 border-b border-dotted border-gray-100">Требуется авторизация</p>
        { :else }
          <p in:fade class="text-xs text-gray-100">{@html $profile.id == account.id && !$page.query.chooseOne ? "Текущий аккаунт," : '<span class="border-b border-dotted border-gray-100">Email:</span>' } { account.email }</p>  
        { /if }
      </div>
    { /if }

    <!-- Buttons -->
    <div class="absolute flex items-center right-0 h-full pr-3">
      <!-- Settings -->
      <button on:click={(e) => {
        if (settingsMenu) {
          settingsMenu = false;
        } else {
          settingsMenu = true;
        };
      }} class="{ !account.loaded ? "opacity-50" : "" } { settingsMenu ? "border-2 border-solid border-indigo-400" : "" } transition duration-300 ease-in-out mx-3 w-8 h-8 rounded-md bg-input flex justify-center items-center">
        { #if account.loaded }
          <Icon name="settings" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
        { /if }
      </button>

      <!-- Log out or Log into -->
      { #if !$page.query.chooseOne ? $profile.id != account.id : true }
        <button on:click={(e) => {
          switchToThis()
        }} style="{ account.loaded && !account.needPassword ? "background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" : "" }" class="{ !account.loaded ? "opacity-50" : "" } bg-input transition duration-300 ease-in-out w-8 h-8 rounded-md flex justify-center items-center">
          { #if account.loaded }
            { #if account.needPassword }
              <Icon name="log-in" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
            { :else }
              <Icon name="chevron-right" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
            { /if }
          { /if }
        </button>
      { :else }
        <button on:click={(e) => {
          if (storage.get(`AT-${$profile.id}`)) {
            account.needPassword = true;
            storage.remove(`AT-${$profile.id}`)
          };

          profile.forceProfile({ id: null });
          cookies.remove("token", { path: "/" });
        }} class="{ !account.loaded ? "opacity-50" : "" } transition duration-300 ease-in-out w-8 h-8 rounded-md bg-input flex justify-center items-center">
          { #if account.loaded }
            <Icon name="log-out" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
          { /if }
        </button>
      { /if }
    </div>
  </button>

  <!-- Settings Menu -->
  { #if settingsMenu }
    <div transition:slide class="w-full bg-input rounded-b-md flex justify-center items-stretch p-3 text-white">
      <!-- Account Settings -->
      <button class="w-full mr-3 px-4 py-2 rounded-md bg-icon-button flex justify-center items-center">
        <!-- Icon -->
        <Icon name="settings" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />

        <!-- Text -->
        <p class="text-sm text-white ml-2">Настроить</p>
      </button>

      <!-- Delete from List -->
      <button on:click={(e) => {
        deleteFromList();
      }} class="w-full px-4 py-2 bg-red-500 rounded-md flex justify-center items-center">
        <!-- Icon -->
        <Icon name="trash" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />

        <!-- Text -->
        <p class="text-sm text-white ml-2">Удалить</p>
      </button>
    </div>
  { /if }
</div>