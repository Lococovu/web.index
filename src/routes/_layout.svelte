<script>
	// Importing modules
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	import { goto, stores } from "@sapper/app";
	const { page } = stores();

	import Cookie from "cookie-universal";
	const cookies = Cookie();

	import storage from "local-storage";
	
	import profile from "../stores/profile.js";
	import accounts from "../stores/accounts.js";

	let loaded = false;

	// Importing components
	import Icon from "../components/Icon.svelte";

	onMount(() => {
		if ($profile.id == null) {
			// Let's now check if we have
			// any logged in user.
			if (cookies.get('token')) {
				// And now let's try to load this user
				// into our temporary datastore
				profile.loadProfile(cookies.get('token'))
				.then(() => {
					loaded = true;
				}).catch((error) => {
					if (error.error == "authorizePincode") {
						if (!$page.path.includes("pincode")) {
							if ($page.query.return != null) {
								storage.set("auth.callback", JSON.stringify({ url: $page.query.return, query: $page.query.query }));
							} else {
								// Checking for current page path
								storage.set("auth.callback", JSON.stringify({ url: $page.path, query: new URLSearchParams(window.location.search).toString() }));
							};

							goto(`/authorize/pincode?token=${cookies.get('token')}`);
						} else {
							loaded = true;
						};
					} else {
						loaded = true;
					};
				});
			} else {
				loaded = true;
			};
		} else {
			loaded = true;
		};

		// Let's check if we have any other accounts
		// (and let's load their information if they exists)
		if (cookies.get('tokens')) {
			let token  = cookies.get('token');
			let tokens = cookies.get('tokens').split(',');

			// Performing some actions (i dunno how to name them)
			if (tokens == null) {
				if (cookies.get('token')) {
					tokens = [cookies.get('token')];
				};
			} else {
				if (!tokens.includes(token)) {
					tokens.push(token);
				};
			};

			accounts.loadTokens(tokens == null ? [] : tokens);
		} else {
			if (cookies.get('token')) {
				accounts.loadTokens([cookies.get('token')]);
			};
		}
	});

	// Listening for changes
	page.subscribe((obj) => {
		if (obj.path.includes("pincode")) {
			loaded = true;
		};
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="./animations.css">
</svelte:head>

{ #if !loaded}
	<div style="z-index: 999;" out:fade class="absolute bg-container w-full h-screen flex justify-center items-center">
		<!-- Logotype -->
		<div style="animation: pulse 1.5s infinite ease-in-out;" class="w-full md:w-2/3 lg:w-1/3 flex justify-center items-center">
			<img id="logotype" class="w-1/12" src="./logotype/small-white.svg" alt="Lococovu Logotype">
		</div>
	</div>
{ :else }
	<main id="container" class="w-full min-h-screen bg-container">
		<!-- WIP Notification -->
		<div style="z-index: 999;" class="fixed top-0 w-full h-7 flex items-center justify-start px-4 bg-indigo-400">
			<Icon name="alert-triangle" attrs={{ class: "w-4 h-4 text-white" }} />

			<p class="text-xs text-white ml-2">
				Этот проект находится в стадии разработки.
			</p>

			<!-- Read more button -->
		</div>

		<slot />
	</main>
{ /if }