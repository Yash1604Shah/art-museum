let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 1.6, 10);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lights
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Floor
  const floorTexture = new THREE.TextureLoader().load("https://cdn.pixabay.com/photo/2020/01/17/17/28/floor-4772000_1280.jpg");
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(40, 40);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ map: floorTexture }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Wall
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
  const wall = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 1), wallMaterial);
  wall.position.set(0, 5, -20);
  scene.add(wall);

  // Frame
  const frameTexture = new THREE.TextureLoader().load("https://cdn.pixabay.com/photo/2018/07/10/19/45/frame-3526843_1280.png");
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), new THREE.MeshBasicMaterial({ map: frameTexture, transparent: true }));
  frame.position.set(0, 4, -19.4);
  scene.add(frame);

  // Bench
  const benchMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const bench = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 0.5), benchMaterial);
  bench.position.set(0, 0.15, -5);
  scene.add(bench);

  // Controls
  controls = new THREE.PointerLockControls(camera, document.body);
  document.addEventListener('click', () => controls.lock(), false);

  const blocker = document.createElement('div');
  blocker.id = 'intro';
  blocker.style.position = 'absolute';
  blocker.style.top = 0;
  blocker.style.left = 0;
  blocker.style.width = '100vw';
  blocker.style.height = '100vh';
  blocker.style.zIndex = 2;
  blocker.style.cursor = 'pointer';
  blocker.innerText = 'Click to Enter Museum';
  blocker.style.color = 'white';
  blocker.style.display = 'flex';
  blocker.style.alignItems = 'center';
  blocker.style.justifyContent = 'center';
  blocker.style.fontSize = '30px';
  blocker.style.background = 'rgba(0,0,0,0.7)';
  document.body.appendChild(blocker);

  // Auto-hide blocker after 2 seconds
  setTimeout(() => {
    const intro = document.getElementById('intro');
    if (intro) intro.remove();
    controls.lock();
  }, 2000);

  controls.addEventListener('lock', () => {
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'none';
  });

  controls.addEventListener('unlock', () => {
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'flex';
  });

  scene.add(controls.getObject());

  // Movement
  const onKeyDown = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const delta = 0.1;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  if (moveForward || moveBackward) velocity.z -= direction.z * 50.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 50.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  renderer.render(scene, camera);
}

init();
