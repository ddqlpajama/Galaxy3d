<script lang="ts">
	import { onMount } from 'svelte';

	import * as Three from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	let renderer: Three.WebGLRenderer;
	let camera: Three.PerspectiveCamera;
	const scene = new Three.Scene();
	scene.background = new Three.Color('black');

	onMount(() => {
		renderer = new Three.WebGLRenderer({
			canvas: document.getElementById('canvas') as HTMLCanvasElement,
			antialias: true
		});
		camera = new Three.PerspectiveCamera(100, renderer.domElement.clientWidth / renderer.domElement.clientHeight, 0.1, 1000);
		camera.position.set(0, -10, 25);

		const loader = new GLTFLoader();
		loader.load(
			'src/lib/resources/models/earth/scene.gltf',
			(gltf) => {
				scene.add(gltf.scene);
				requestAnimationFrame(render);
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			}
		);
	});

	function resizeCanvas(): void {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		if (canvas.width !== width || canvas.height !== height) {
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}
	}

	function render(): void {
		resizeCanvas();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}
</script>

<canvas class="size-full" id="canvas"></canvas>
