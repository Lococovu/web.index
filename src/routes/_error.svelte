<script>
	// Importing components
	import Background from "../components/Layout/Background.svelte";
	import PageTransition from "../components/Loader/PageTransition.svelte";

	import { H2, Paragraph } from "../components/typography";

	let images = [
		"/icons/sad_man.gif",
		"/icons/sad_man_2.gif",
		"/icons/sad_spiderman.gif",
	];
</script>

<!-- Background && PageTransition -->
<Background /> <PageTransition />

<!-- Page's Layout -->
<main class="relative w-full h-screen flex justify-center items-center">
	<div class="w-1/3 h-1/2 flex items-center justify-center text-center rounded-md bg-input relative">
		<div style="z-index: 2;" class="flex flex-col items-center text-center px-6">
			<H2>Ничего не найденно</H2>
			<Paragraph>Вероятнее всего, произошла какая-то ошибка. Просто проигнорируйте. Ну или не проигнорируйте. Всё от вас зависит.</Paragraph>
		</div>

		<!-- Sad Background -->
		<div style="background-image: url({ images[Math.floor(Math.random() * images.length )] }); background-size: cover;" class="absolute inset-0 w-full h-full rounded-md opacity-60"></div>
	</div>
</main>