<script>
  // Importing modules
  import { afterUpdate } from "svelte";

  // Importing actions
  import getProfile from "../../../../actions/profile/getProfile.action";
  import checkCode from "../../../../actions/profile/security/codes/checkCode.action";

  // Importing components
  // - animation
  import { fade, slide } from "svelte/transition";
  
  // - icons
  import Icon from "../../../Icon.svelte";
  
  // - loaders
  import Spinner from "../../../Loader/Spinner.svelte";
  
  // - typography
  import { H6 } from "../../../typography";

  // - images

  let account = {
    loaded: false,
    security: {}
  };

  let bottomMenu = false;

  // Exporting variables

  // @export colors
  export let dark  = false;
  export let white = false;

  // @export id
  // - Account id
  export let id;

  // @export loading
  // - Determines if we need to show
  // loading screen or no
  export let loading = false; 

  // @export classes
  export let classes;

  // @export attrs
  // - Attributes object
  export let attrs = {
    // @attribute showPasswordAvailability
    // - Do we need to show if this account
    // have any password protection or no.
    showPasswordAvailability: false,
    
    // @attribute checkSecurityCode
    // - Do we need to check if this
    // account needs authorization or
    // no?
    checkSecurityCode: null
  };

  let prevId;

  // Some exported variables changed.
  // we need to update this account's information
  afterUpdate(async () => {
    // Checking some variables
    if (!white && !dark) {
      white = true;
    };

    // Getting profile information
    if (prevId != id) {
      prevId = id;
      account = { loaded: false };
      
      // Let's now try to load this account's information
      try {
        account = await getProfile(id);

        // Checking if we need to check for Security Code
        if (attrs.checkSecurityCode) {
          if (account.security.pincode != null) {
            try {
              await checkCode(attrs.checkSecurityCode);
              
              // Nothing happened, so no errors :thumbsup:
              account.needPassword = false;
            } catch {
              account.needPassword = true;
            };

            // NOW account information is fully loaded
            account.loaded = true;
          } else {
            // Account information is fully loaded
            account.loaded = true;
          };
        } else {
          // Account information is loaded
          account.loaded = true;
        };
      } catch {
        // Error loading account
      };
    };
  });
</script>

<!-- Component's Layout -->
<div in:fade class="relative w-full pb-4">
  <button class="transition duration-200 ease-in-out relative w-full p-3 { dark ? "bg-input" : "bg-icon-button" } rounded-md flex items-center opacity-80 { classes }">
    <!-- Loading state -->
    { #if loading }
      <div style="z-index: 999;" in:fade class="absolute { dark ? "bg-input" : "bg-icon-button" } rounded-md inset-0 w-full h-full flex justify-center items-center">
        <Spinner size={20} color="#fff" />
      </div>
    { /if }
    
    <!-- Icon -->
    <div style="background-image: url('{ account.internalAvatar }'); background-size: cover; background-position: center;" class="transition duration-300 ease-in-out relative w-12 h-12 rounded-md bg-input { !account.loaded ? "bg-input opacity-50" : "" }">
      <!-- Account has extra password -->
      { #if account.loaded }
        { #if account.security.pincode && attrs.showPasswordAvailability }
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
        
        <slot account={account} name="subtext"></slot>
      </div>
    { /if }

    <!-- Buttons -->
    <div class="absolute flex items-center right-0 h-full pr-3">
      <slot account={account} name="buttons"></slot>
    </div>
  </button>

  <!-- Bottom Menu -->
  { #if bottomMenu }
    <div transition:slide class="relative w-full bg-input rounded-b-md flex justify-center items-stretch p-3">
      <slot account={account} name="bottomMenu"></slot>
    </div>
  { /if }
</div>