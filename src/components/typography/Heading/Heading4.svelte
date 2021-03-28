<script>
  // Importing template component
  import Template from "./_template.svelte";

  export let white;
  export let dark;

  export let classes;
  export let style;
</script>

<Template style={style} white={white} dark={dark} size="4" classes="text-3xl font-medium { classes }"><slot></slot></Template>