<script context="module">
	export const metadata = {"title":"Awesome title","x":1,"y":20};
	const { title, x, y } = metadata;
</script>
<script>
	import Layout_MDSVEX_DEFAULT from '/home/conor/Repos/snowsvex/snowsvex/example/src/_layout.svelte';
  import Button from '../components/Button.svelte'
</script>
<Layout_MDSVEX_DEFAULT {...metadata}>

<h1>Amazzzing</h1>
<blockquote>
<p>Cool stuff</p>
</blockquote>
<Button />
</Layout_MDSVEX_DEFAULT>