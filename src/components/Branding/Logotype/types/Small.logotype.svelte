<script>
  // Exporting attributes object (without default values)
  export let attrs = {};
</script>

<!-- { attrs.color != null ? !attrs.color.includes("#") ? `text-${ attrs.color }` : "" : "text-white" } h-{ attrs.size || "8" } -->
<svg style="{ attrs.color != null ? attrs.color.includes("#") ? `color: ${ attrs.color }` : "" : "" }" class="{ attrs.color != null ? !attrs.color.includes("#") ? `text-${ attrs.color }` : "" : "text-white" } w-{ attrs.size || "8" } h-{ attrs.size || "8" }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150.4 150.45" fill="currentColor" xmlns:v="https://vecta.io/nano"><path d="M15.562 108.032l32.16-55.703a6.7 6.7 0 0 1 9.152-2.452l24.162 13.95-49.4 85.563a2.13 2.13 0 0 1-2.944.76l-2.217-1.28c-14.281-8.271-19.165-26.546-10.913-40.838z"/><path d="M46.821 1.051l76.97 133.316-24.119 13.925a6.7 6.7 0 0 1-9.152-2.452L30.795 42.393C22.545 28.104 27.424 9.834 41.699 1.56L43.916.28a2.13 2.13 0 0 1 2.91.78l-.005-.009z"/><path d="M137.13 114.994H72.64l18.48 32a5.44 5.44 0 0 0 3.63 2.6h19.94a24.23 24.23 0 0 0 24.16-24.16v-8.72a1.72 1.72 0 0 0-1.72-1.72z"/></svg>
