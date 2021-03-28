<script>
  // Importing modules
  import { onMount } from "svelte";
  import Icon from "../../components/Icon.svelte";

  import profile from "../../stores/profile.js";
  import accounts from "../../stores/accounts.js";

  import { goto } from "@sapper/app";

  import { stores } from "@sapper/app";
  const { page } = stores();

  import pages from "../../config/pages.json";

  // Importing components
  import { Caption } from "../typography";

  // currentPage variable
  let currentPage = "index";
  
  // Subscribe to page store
  // to determine page changes
  page.subscribe((obj) => {
    if (obj.path == "/app") {
      currentPage = "index";
    } else {
      // Now let's check what
      // current page it is
      pages.forEach((p) => {
        if (p.id != "index") {
          if (obj.path.includes(p.id)) {
            currentPage = p.id;
          };
        };
      });
    };
  });

  // onMount Event
  onMount(() => {
    // Let's now update our notifications
    // list (in index page)...
    let exploreIndex = pages.findIndex(p => p.id == "index");

    // And now let's update index's information.
    let explore = pages.find(p => p.id == "index");
    explore.subtitle = "4 Уведомления";
    explore.notifications = 4;

    pages[exploreIndex] = explore;
  });
</script>

<sidebar style="z-index: 1;" class="h-screen w-1/5 pt-6 flex flex-col items-center relative">
  <!-- Background -->
  <div style="z-index: 0;" class="absolute inset-0 w-full h-full bg-input opacity-80 rounded-md"></div>

  <!-- Logotype -->
  <div style="z-index: 1;" class="px-4 my-1 w-full flex justify-between items-center">
    <img class="w-2/12" src="./logotype/small-white.svg" alt="">
  
    <!-- Button -->
    <button class="w-8 h-8 rounded-md bg-icon-button flex justify-center items-center">
      <Icon name="chevron-left" attrs={{ width: "1rem", height: "1rem", color: "#fff" }} />
    </button>
  </div>

  <!-- Links -->
  <div class="mt-3 px-4 w-full relative">
    { #each pages.filter((x) => x.id != null) as page }
      <div class="w-full flex items-center rounded-md { currentPage == page.id ? "bg-icon-button" : "" } opacity-80 py-3 px-4 my-2 relative">
        <!-- Icon -->
        <Icon name="{ page.icon }" attrs={{ width: "1.2rem", height: "1.2rem", color: "#fff" }} />
        
        <!-- Text -->
        <Caption opacity={ currentPage == page.id } classes="ml-2">{ page.title }</Caption>

        <!-- Notifications -->
        { #if page.notifications != null }
          <div class="absolute inset-y-0 right-0 flex items-center pr-2">
            <div class="rounded-full w-5 h-5 bg-red-400 flex justify-center items-center">
              <Caption opacity={false}>{ page.notifications }</Caption>
            </div>
          </div>   
        { /if }
      </div>
    { /each }
  </div>

  <!-- <div class="absolute top-0 left-0 pl-5 pt-2">
    <div class="rounded-full px-1 bg-red-400 text-white text-xs">
      { page.notifications }
    </div>
  </div> -->

  <!-- Divider -->
  <div style="height: .15rem" class="w-4/5 my-2 bg-icon-button opacity-70 rounded-md"></div>

  <!-- Last Actions -->
  <div style="overflow: hidden; overflow-y: auto;" class="px-4 flex-grow w-full relative">
    <!-- <div class="absolute inset-0 w-full h-full"> -->
      <!-- @action game -->
      <div class="w-full px-4 py-3 my-2 flex items-center relative">
        <!-- Game Logo -->
        <div style="background: url('https://www.godisageek.com/wp-content/uploads/Forager-review.jpg'); background-size: cover; background-position: center;" class="w-10 h-10 bg-icon-button rounded-md"></div>

        <!-- Text -->
        <div class="ml-2">
          <p class="text-xs text-gray-100 opacity-70">Игра</p>
          <h1 class="text-base text-white font-medium">Forager</h1>
        </div>
      </div>

      <!-- @action chat -->
      <div class="w-full px-4 py-3 my-2 flex items-center relative">
        <!-- Avatar -->
        <div style="background: url('https://lh3.googleusercontent.com/a-/AOh14GhCCJJ9gEkj3KVGPO8e2_cmgWftECmmlE5TDRWv=s96-c'); background-size: cover; background-position: center;" class="w-10 h-10 bg-icon-button rounded-md"></div>

        <!-- Game Badge -->
        <div class="absolute top-0 left-0 pt-2 pl-11">
          <div class="rounded-full w-4 h-4 bg-indigo-400 flex justify-center items-center">
            <!-- <Icon name="hash" attrs={{ width: ".75rem", height: ".75rem", color: "#fff" }} />-->
          </div>
        </div>

        <!-- Text -->
        <div class="ml-2">
          <p class="text-xs text-gray-100 opacity-70">Чат</p>
          <h1 class="text-base text-white font-medium">Ови Баркинс</h1>
        </div>
      </div>

      <!-- Change Layout -->
      <div class="mx-2 px-4 py-3 my-2 cursor-pointer rounded-md border border-dashed border-gray-700 flex items-center justify-center opacity-80">
        <!-- Texts -->
        <div>
          <!-- Title -->
          <h1 class="text-sm text-white font-medium">Настроить секцию</h1>

          <!-- Subtitle -->
          <p class="text-extra-xs text-gray-100 opacity-80">Настройте секцию <span class="border-b border-dotted border-gray-100">Быстрого доступа</span> под себя.</p>
        </div>
      </div>
    <!-- </div> -->
  </div>
</sidebar>