<script>
  // Importing modules
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  import storage from "local-storage";

  // Importing actions
  import setupPincode from "../../actions/profile/security/setupPincode.action";
  import authorizePincode from "../../actions/profile/security/authorizePincode.action";

  // Importing stores
  import profile from "../../stores/profile";
  import { stores } from "@sapper/app";
  const { page } = stores();

  // Importing components
  import Icon from "../../components/Icon.svelte";
  import { H6, Caption } from "../../components/typography";
  import Spinner from "../../components/Loader/Spinner.svelte";

  // Variables
  let pincode;
  let loading;
  let containerLoading;

  // Function, that'll clear our query attributes
  function done() {
    goto('/settings/security');
    pincode = null;
    loading = false;
    
    // Updating user
    profile.loadProfile($profile.token)
    .then(() => {
      containerLoading = false;
    }).catch((error) => {
      if (error.error == "authorizePincode") {
        storage.set("auth.callback", { url: "/settings/security" });
        goto(`/authorize/pincode?token=${$profile.token}`);
      };
    });
  };

  // Function, that'll update our pincode
  function updatePincode(token) {
    loading = true;

    // Let's firstly check if we
    // need to get Security Code
    // or no
    if ($profile.security.pincode == null) {
      // Creating our pincode
      setupPincode($profile.token, pincode)
      .then(() => {
        // Let's now get this
        // Security Code
        authorizePincode($profile.id, pincode)
        .then((response) => {
          // And now let's save this Security Code
          storage.set(`AT-${$profile.id}`, response.token);
          containerLoading = false;
        }).catch((error) => console.log(error));
      }).catch((error) => (error) => console.log(error));
    } else {
      // Let's now check for Security Code
      if ($page.query.securityCode != null) {
        pincode = $page.query.pincode;

        // Setting up our pincode
        setupPincode(`-${$page.query.securityCode}`, pincode)
        .then(() => done()).catch((error) => {
          console.log("ERROR");
          console.log(error);
        });
      } else {
        // Let's firstly save our callback
        storage.set('auth.callback', JSON.stringify({ url: "/settings/security", query: `?action=updatePincode&hello=nibbaUbba&pincode=${pincode}` }));

        // Redirect user to login page
        goto(`/authorize/pincode?token=${$profile.token}&type=confirmation&action=pincodeChange`);
      };
    };
  };

  // onMount event
  // - Here we'll check if we need
  // to change our pincode or
  // no
  onMount(() => {
    if ($page.query.action == "updatePincode") {
      containerLoading = true;
      updatePincode();
    };
  });
</script>

{ #if containerLoading }
  <div out:fade style="z-index: 995;" class="absolute inset-0 bg-input w-full h-full flex flex-col justify-center items-center">
    <Spinner size="20" color="#fff" />
    <Caption classes="mt-2">Меняем пароль...</Caption>
  </div>
{ /if }

<!-- Password -->
<div in:fade class="{ $profile.security.pincode == null ? "w-full" : "w-1/2" } px-4 mb-4">
  <H6>Пинкод</H6>

  { #if $profile.security.pincode == null }
    <div class="mt-2 flex items-center p-5 rounded-md border border-gray-800">
      <!-- Icon -->
      <img class="w-2/6 rounded-md" src="./icons/you_shall_not_pass_02.gif" alt="">

      <!-- Texts -->
      <div class="ml-4">
        <!-- Texts -->
        <H6>Установите пинкод</H6>
        <Caption classes="w-5/6">Пинкод - это универсальная дополнительная защита Вашего аккаунта. Вы просто его ставите как пароль, и вписываете только тогда, когда нужно! Никто другой не сможет зайти в Ваш аккаунт, не зная Вашего пароля. Ставьте его побыстрее прямо сейчас!</Caption>

        <!-- Buttons + Input -->
        <div class="mt-2">
          <div class="{ loading ? "opacity-50" : "" } flex w-5/6 bg-icon-button rounded-md p-2 relative">
            <!-- Icon -->
            <div class="w-8 h-8 rounded-md bg-input flex justify-center items-center mr-2">
              <Icon name="lock" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
            </div>
        
            <!-- Input itself -->
            <input bind:value={pincode} disabled={ loading } class="text-sm w-full text-gray-400 bg-icon-button" placeholder="Новый пароль" type="password">
          
            <!-- Button -->
            <div class="absolute right-0 pr-2">
              <button disabled={ loading } on:click={(e) => {
                updatePincode();
              }} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="{ loading ? "opacity-50" : "" } px-4 h-8 rounded-md bg-icon-button relative">
                { #if loading }
                  <div transition:fade style="background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="absolute inset-0 w-full h-full rounded-md flex justify-center items-center">
                    <Spinner size={15} color="#fff" />
                  </div>
                { /if }
                
                <Caption opacity={false}>Сохранить</Caption>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  { :else }
    <div class="{ loading ? "opacity-50" : "opacity-80" } flex w-full bg-icon-button p-2 rounded-md mt-3 relative">
      <!-- Icon -->
      <div class="w-8 h-8 rounded-md bg-input flex justify-center items-center">
        <Icon name="lock" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
      </div>

      <!-- Input itself -->
      <input bind:value={pincode} on:keypress={(e) => {
        if (pincode != null && pincode.split('').length >= 16) {
          e.preventDefault();
        };
      }} disabled={loading} class="ml-2 text-sm text-gray-400 bg-icon-button" placeholder="Новый пароль" type="password" id="pincode">
    
      <!-- Save Button -->
      <div class="absolute right-0 pr-2">
        <button on:click={(e) => {
          updatePincode();
        }} disabled={loading} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="px-4 h-8 rounded-md flex justify-center items-center relative">
          { #if loading }
            <div transition:fade style="background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="absolute inset-0 w-full h-full rounded-md flex justify-center items-center">
              <Spinner size={15} color="#fff" />
            </div>
          { /if }

          <Caption opacity={false}>Сохранить</Caption>
        </button>
      </div>
    </div>

    <p class="mt-2 text-xs text-white opacity-60 w-5/6">Принимаются любые символы, пробелы, иероглифы, номера кредитных карточек, день рождения вашей Мамы, день первого секса, день когда от вас ушёл отец. Пинкод можно изменить. А вот прошлое нельзя. Отца не вернуть.</p>

    <!-- 
    <div class="flex w-5/6 bg-icon-button rounded-md p-2 relative">
      Icon
      <div class="w-8 h-8 rounded-md bg-input flex justify-center items-center mr-2">
        <Icon name="lock" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
      </div>

      Input itself
      <input bind:value={pincode} class="text-sm w-full text-gray-400 bg-icon-button" placeholder="Пароль" type="password">
    
      Button
      <div class="absolute right-0 pr-2">
        <button style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="opacity-60 px-4 h-8 rounded-md bg-icon-button">
          <Caption opacity={false}>Сохранить</Caption>
        </button>
      </div>
    </div> -->
  { /if }
</div>