<script>
  // Importing modules
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";

  import Cookie from "cookie-universal";
  const cookies = Cookie();

  // Importing stores
  import { stores } from "@sapper/app";
  const { page } = stores();

  onMount(() => {
    if (cookies.get('tutorial')) {
      // Tutorial is skipped

      if (!$page.path.includes("profile")) {
        goto('/start/complete');
      };
    };
  });

</script>

<svelte:window on:mousemove={(e) => {
	Array.prototype.forEach.call(document.getElementsByClassName("background"), function(element) {
		element.style.backgroundPositionX = -Math.round(e.pageX/20) + "px";
		element.style.backgroundPositionY = -Math.round(e.pageY/20) + "px";
	});
}} />

<div style="z-index: 998;" class="lg:hidden fixed inset-0 w-full h-screen flex justify-center items-center bg-container">
	<div class="w-full md:w-2/3 flex flex-col items-center px-4 md:px-0">
		<!-- logotype -->
		<img class="w-2/12" src="./logotype/small-white.svg" alt="Lococovu Logotype">

		<!-- Heading -->
		<h1 class="text-2xl ml-2 text-white mt-4 text-center">Нам жаль, но вам лучше зайти с Компьютера</h1>

		<!-- Description -->
		<p class="my-6 text-md opacity-75 text-gray-100 text-center">На данный момент разработки мы не поддерживаем отображение сайта для мобильных экранов. Ибо сделать весь сайт максимально адаптивным - довольно-таки сложно. Но не переживайте, в скором времени мы обязательно добавим мобильную версию!<br /><br />Кстати, вы можете зайти в наш Дискорд сервер и спросить у разработчиков когда появится мобильная версия.</p>

		<!-- Discord Button -->
		<button style="background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);" class="px-3 py-1 rounded-md flex items-center">
			<!-- Icon -->
			<img style="height: 1.2rem; width: 1.2rem;" src="./icons/Discord-Logo-White.svg" alt="Discord Logo">
		
			<!-- Text -->
			<p class="text-sm text-white ml-2">Наш Дискорд</p>
		</button>
	</div>
</div>

<main class="w-full h-screen relative flex justify-center items-center">
  <!-- Header -->
  <header style="z-index: 999;" class="absolute top-0 w-full pt-4 flex justify-center items-center">
    <!-- Logotype -->
    <img class="w-1/12" src="./logotype/white-full.svg" alt="">

    <!-- Divider -->
    <div style="height: 1.2rem; width: 1px;" class="mx-2 bg-white rounded-sm"></div>

    <!-- Text -->
    <p class="text-sm text-white mb-0.5">{ $page.path == "/start/profile" ? "Профиль" : "Обучение" }</p>
  </header>

  <!-- Container -->
  <slot></slot>
</main>