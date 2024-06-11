<script lang="ts">
	import { onMount } from 'svelte';
	import * as Three from 'three';
	import { Object3D } from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

	let renderer: Three.WebGLRenderer;
	let camera: Three.PerspectiveCamera;
	const scene = new Three.Scene();
	scene.background = new Three.Color('black');
	let earthObject: Object3D;

	onMount(() => {
		initializeRendererAndCamera();
		loadGLTFModel();
		addAxisHelper();
	});

	function initializeRendererAndCamera(): void {
		renderer = new Three.WebGLRenderer({
			canvas: document.getElementById('canvas') as HTMLCanvasElement,
			antialias: true
		});
		camera = new Three.PerspectiveCamera(
			70,
			renderer.domElement.clientWidth / renderer.domElement.clientHeight,
			0.1,
			2000
		);
		camera.position.set(0, 0, 25);
	}

	function loadGLTFModel(): void {
		const loader = new GLTFLoader();
		loader.load(
			'src/lib/resources/models/earth/scene.gltf',
			(gltf) => {
				earthObject = gltf.scene;
				center3dObject(earthObject);
				const axesHelper = new Three.AxesHelper(20);
				scene.add(axesHelper);
				scene.add(earthObject);
				// console.log(_dumpObject(earthObject).join('\n'));
				requestAnimationFrame(render);
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			}
		);
	}

	function addAxisHelper(): void {
		const axesHelper = new Three.AxesHelper(5);
		scene.add(axesHelper);
	}

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
		rotateEarth();
		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}

	function rotateEarth(): void {
		const rootNode = earthObject.getObjectByName('RootNode');
		if (rootNode) {
			rotateAroundObjectAxis(rootNode, new Three.Vector3(0, 0, 1), .02);
		}
	}

	function rotateAroundObjectAxis(object: Object3D, axis: Three.Vector3, radians: number): void {
		const rotObjectMatrix = new Three.Matrix4();
		rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
		object.matrix.multiply(rotObjectMatrix);
		object.rotation.setFromRotationMatrix(object.matrix);
	}

	function _dumpObject(obj: Object3D, lines: string[] = [], isLast = true, prefix = ''): string[] {
		const localPrefix = isLast ? '└─' : '├─';
		lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
		const newPrefix = prefix + (isLast ? '  ' : '│ ');
		const lastNdx = obj.children.length - 1;
		obj.children.forEach((child, ndx) => {
			const isLast = ndx === lastNdx;
			_dumpObject(child, lines, isLast, newPrefix);
		});
		return lines;
	}

	function center3dObject(object: Object3D): void {
		const box = new Three.Box3().setFromObject(object);
		const averageCoordinate = box.getCenter(object.position).negate();
		object.position.set(averageCoordinate.x, averageCoordinate.y, averageCoordinate.z);
	}
</script>

<canvas class="size-full" id="canvas"></canvas>
