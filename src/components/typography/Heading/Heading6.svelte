<script>
  // Importing template component
  import Template from "./_template.svelte";

  export let white;
  export let dark;

  export let classes;
  export let style;
</script>

<Template style={style} white={white} dark={dark} size="6" classes="text-xl { classes }"><slot></slot></Template>