<script>
  // Importing modules
  import profile from "../../../stores/profile.js";
  import { fade } from "svelte/transition";

  import { onMount } from "svelte";

  import { goto } from "@sapper/app";

  import { stores } from "@sapper/app";
  const { page } = stores();

  import axios from "axios";
  import storage from "local-storage";
  
  import Cookie from "cookie-universal";
  const cookies = Cookie();

  // Importing components
  import Icon from "../../../components/Icon.svelte";
  import PageTransition from "../../../components/Loader/PageTransition.svelte";
  import Spinner from "../../../components/Loader/Spinner.svelte";

  // Some variables
  let loading = false;
  let pincode;

  // Function, that'll set up our
  // pincode and that'll redirect us
  // to /complete page
  function nextStep() {
    loading = true;

    if (pincode == null) {
      goto('/start/profile/complete');
    } else {
      // Let's firstly get our token
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
            storage.set('temp-wizard-pincode', pincode);

            goto(`/authorize/pincode?token=${cookies.get('token')}&return=${encodeURIComponent(`/start/profile/security?nextStep=true&id=${$profile.id}`)}&type=confirmation&action=pincodeChange`);
          };
        };
      };

      if (token != null) {
        // And now let's update our pincode
        axios.post(`https://lococovu.me/api/profile/${ type == "token" ? token : `-${token}` }/pincode`, { pincode })
        .then((response) => {
          if (response.data.token == 0) {
            // Redirect user to authorization page
            goto(`/authorize/pincode?token=${cookies.get('token')}&return=/start/profile/complete`);
          } else {
            // Let's save this security code to our local storage
            // and update user profile
            storage.set(`AT-${$profile.id}`, response.data.token);

            setTimeout(() => {
              profile.loadProfile(cookies.get('token'))
              .then(() => {
                goto('/start/profile/complete');
              }).catch((error) => {
                if (error == "AuthorizePincode") {
                  goto(`/authorize/pincode?token=${cookies.get('token')}&return=/start/profile/complete`);
                } else {
                  goto('/authorize');
                };
              });
            });
          };
        }).catch((error) => {
          loading = false;
        });
      } else {
        loading = false;
      };
    };
  };

  onMount(() => {
    if ($page.query.nextStep) {
      loading = true;

      pincode    = storage.get('temp-wizard-pincode');

      setTimeout(() => {
        nextStep();

        storage.remove('temp-wizard-pincode');
      }, 250);
    };
  });
</script>

<!-- Page Transition -->
<PageTransition />

<!-- Page's Layout -->
<div style="background-image: url('/background/1.svg'); z-index: 1;" class="background absolute inset-0 w-full h-full"></div>

<div style="z-index: 2;" class="w-1/3 h-4/6 flex flex-col items-center justify-center">
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

  <div class="my-8 text-center w-5/6">
    <h1 class="text-xl text-white font-medium">Хотите дополнительную защиту?</h1>
    <p class="text-sm mt-1 text-gray-100 opacity-75">Для того, что бы защитить Ваш новосозданный аккаунт, вы можете придумать для него какой-либо пароль или пинкод. При каждой <span class="border-b border-dotted border-gray-100">(почти)</span> новой авторизацией будет требоваться этот пароль.</p>
  </div>

  <!-- Pincode -->
  <div class="flex w-5/6 bg-input p-2 rounded-md mr-3">
    <!-- Icon -->
    <div class="w-8 h-8 rounded-md bg-icon-button flex justify-center items-center mr-2">
      <Icon name="lock" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
    </div>

    <!-- Input itself -->
    <input bind:value={pincode} disabled={ loading } class="{ loading ? "opacity-60" : "" } text-sm w-full text-gray-400 bg-input" placeholder="Пароль" type="password">
  </div>

  <p class="mt-2 text-xs text-white opacity-60 w-5/6">Принимаются любые символы, пробелы, иероглифы, номера кредитных карточек, день рождения вашей Мамы, день первого секса, день когда от вас ушёл отец. Пинкод можно изменить. А вот прошлое нельзя. Отца не вернуть.</p>

  <!-- Buttons -->
  <div class="mt-8 w-5/6 flex justify-center items-stretch">
    <button class="w-full mr-4 bg-input rounded-md px-4 py-2 flex justify-center items-center">
      
      <!-- Title -->
      <p class="text-white text-sm opacity-75">Назад</p>
    </button>

    <button on:click={() => {
      nextStep();
    }} style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="w-full bg-input rounded-md px-4 py-2 flex justify-center items-center relative">
      { #if loading }
        <div in:fade style="z-index: 2; background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="absolute inset-0 w-full h-full rounded-md bg-input flex justify-center items-center">
          <Spinner size={15} color="#fff" />
        </div>
      { /if }

      <!-- Title -->
      <div>
        <p class="text-white text-sm opacity-75">Закончить</p>
        
        { #if pincode == null && pincode != null ? pincode.split('').length < 0 : false }
          <p class="text-xs text-gray-100 opacity-75">Без пинкода</p>
        { /if }
      </div>
    </button>
  </div>

</div>