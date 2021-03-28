<svelte:window on:mousemove={(e) => {
  let el = document.getElementById("background");

  el.style.backgroundPositionX = -Math.round(e.pageX/20) + "px";
  el.style.backgroundPositionY = -Math.round(e.pageY/20) + "px";
}} />

<!-- Background Itself -->
<div id="background" style="background-image: url('./background/1.svg');" class="absolute inset-0 w-full h-full"></div>