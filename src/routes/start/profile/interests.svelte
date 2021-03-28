<script>
  // Importing modules
  import profile from "../../../stores/profile.js";

  // Importing components
  import Icon from "../../../components/Icon.svelte";
  import PageTransition from "../../../components/Loader/PageTransition.svelte";

  // Tags list
  let tags = [0,1,2,3,4,5];
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
      <h1 class="text-xl text-white">{ $profile.displayName }</h1>
      <p class="text-sm text-gray-100">{ $profile.email }</p>

      <p class="text-xs text-gray-100 opacity-80">Не вы? <a class="border-b border-dotted border-gray-100" href="/authorize?return=/start/profile">Поменяйте аккаунт</a></p>
    </div>
  </div>

  <h1 class="mt-8 mb-4 text-xl text-white font-medium text-center">Выберите только то, что <span class="border-b border-dotted border-gray-100">Вам Нравится</span></h1>

  <!-- Tag's List -->
  <div style="overflow: hidden; overflow-y: auto;" class="w-full flex-grow relative">
    <div class="absolute flex flex-wrap w-full h-full">
      <!--  -->
      { #each tags as tag }
        <div class="w-1/3 relative p-2">
          <div class="pt-100% w-full relative">
            <div class="absolute inset-0 w-full h-full bg-input rounded-md flex flex-col justify-center items-center">
              <!-- Icon -->
              <img class="w-1/6" src="./icons/hugging-face.png" alt="Tag Icon">

              <!-- Text -->
              <div class="w-full text-center mt-2 opacity-75 px-2">
                <h1 class="text-base text-white font-bold">Популярное</h1>
                <p class="text-xs text-gray-100">Всё то, во что сейчас играют игроки Лококову!</p>
              </div>
            </div>
          </div>
        </div>
      { /each }
    </div>
  </div>

  <p class="mt-2 text-xs text-white opacity-60 w-5/6">Выберите именно те режимы, которые Вам нравятся. Мы будем информировать Вас о новых играх с данными характеристиками, а так же будем подбирать игры специально для Вас.</p>

  <!-- Buttons -->
  <div class="mt-8 w-5/6 flex justify-center items-center">
    <button class="w-full mr-4 bg-input rounded-md px-4 py-2 flex justify-center items-center">
      
      <!-- Title -->
      <p class="text-white text-sm opacity-75">Отмена</p>
    </button>

    <button style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="w-full bg-input rounded-md px-4 py-2 flex justify-center items-center">
      
      <!-- Title -->
      <p class="text-white text-sm opacity-75">Продолжить</p>
    </button>
  </div>

</div>