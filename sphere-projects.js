import * as THREE from "./three.module.min.js";

/* === TUO ARRAY DI TECNOLOGIE === */
const TECHS = [
  {
    id: "html",
    name: "HTML",
    logo: "./Loghi/HTML.png",
    description: "Ho sviluppato conoscenze in HTMl e CSS durante il mio percorso di studi e anche nel mio percorso accademico. Negl'anni ho avuto la possibilità di utilizzare diverse librerie (es. bootstrap) che mi hanno permesso di eseguire lavori grafici di livello. In questi anni ho avuto modo di operare su diversi sviluppi di siti web, tra cui questo medesimo.",
    projects: [
      { label: "Sito personale portfolio", url: "https://loryidol02.github.io/Sito_Portfolio_BroggiLorenzo/" }
    ]
  },
  {
    id: "AI",
    name: "Machine Learning",
    logo: "./Loghi/AI.png",
    description: "Machine Learning e Deep Learning sono ambiti che ho studiato e operato durante il mio percorso di tesi nel 2025. Durante questo percorso ho imparato ad utilizzare librerie quali pytorch e tensorflow, addesterando dei modelli preaddestrati a riconoscere e classificare immagini mediche. Nel link sottostante è possibile visualizzare e scaricare i codici che ho scritto personalmente e che hanno avuto risultati determinanti per il mio studio di tesi.",
    projects: [
      { label: "Addestramento modelli multimodali al classificamento di differenti malattie cutanee", url: "https://github.com/LoryIdol02/Tesi_AIderm" }
    ]
  },
  {
    id: "js",
    name: "JavaScript",
    logo: "./Loghi/JS.png",
    description: "Le mia consocenze nel linguaggio javascript nascono durante lo sviluppo dei miei primi sitiweb, in cui era possibile modificare e implementare script. Successivamente ho sviluppato consocienze tramite corsi al fine di migliorare interazione e animazioni. Un esempio dei risultati ottenuti è la sfera di questo sito, sviluppata tramite la libreria di 'Three.js'."
  },
  {
    id: "python",
    name: "Python",
    logo: "./Loghi/Python.png",
    description: "Linguaggio versatile che ho imparato autonomamente, e successivamente rinforzato nel mio percorso accademico durante il corso di 'Bigdata'. Esperienza e conoscienza base, con una logica forte derivata da esprienza in altri linguaggi orientati ad oggetti."
  },
  {
    id: "java",
    name: "Java",
    logo: "./Loghi/Java.png",
    description: "Linguaggio orientato ad oggetti che ho utilizzato maggiormente, in particolar modo nel mio percorso accedemico, l'esame di 'Programmazione' riguardava la logica e la sintassi di Java. Ho sviluppato anche un progetto con dei miei colleghi universitari per un'altro esame interamente con questo linguaggio di programmazione. Sottostante sono presenti i link di questo progetto.",
    projects: [
      { label: "App Java sviluppata per esame universitario", url: "https://github.com/LoryIdol02/Laboratorio-B---climate-monitoring" }
    ]
  },
  {
    id: "sql",
    name: "SQL",
    logo: "./Loghi/SQL.png",
    description: "Linguaggio che ho appreso durante il mio percorso accademico, sviluppatoe e imparato con particolare attenzione. Durante il mio percorso di studi, ho voluto scegliere come insegnamento facoltativo il secondo esame di 'Base di dati', con esperienza in PostgreSQL. ",
    projects: [
      { label: "Database relazionale utilizzato nell'app sviluppata in esame universitario", url: "https://github.com/LoryIdol02/Laboratorio-B---climate-monitoring" }
    ]
  },
  {
    id: "Dokerc",
    name: "docker",
    logo: "./Loghi/Docker.png",
    description: "Studi fatti in autonomia per sviluppare competenze nel mondo DevOps e Cloud"
  }
];

function initNeonSphere() {
  const container = document.getElementById("container-3d");
  if (!container) return;

  // AGGIUNGI QUI:
  const panelContainer = document.getElementById("tech-panel"); 
  
  const panelTitle = document.getElementById("tech-title");
  const panelDescription = document.getElementById("tech-description");
  const panelProjects = document.getElementById("tech-projects");
  const panelClose = document.getElementById("tech-panel-close");

  // dimensioni iniziali
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight * 0.8;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  container.appendChild(renderer.domElement);

  function updateRendererSize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight * 0.8;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  // gruppo sfera+loghi
  const group = new THREE.Group();
  scene.add(group);

  const initialGroupQuat = group.quaternion.clone();
  const initialGroupScale = new THREE.Vector3(1, 1, 1);
  group.scale.copy(initialGroupScale);

  // luci
  scene.add(new THREE.AmbientLight(0x00ff99, 0.6));
  const point = new THREE.PointLight(0x00ff99, 1.5, 50);
  point.position.set(5, 5, 5);
  scene.add(point);

  // sfera
  const sphereGeom = new THREE.SphereGeometry(0.9, 64, 64);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x00ff66,
    emissive: 0x00ff66,
    emissiveIntensity: 0.8,
    metalness: 0.3,
    roughness: 0.1,
    wireframe: true
  });
  group.add(new THREE.Mesh(sphereGeom, sphereMat));

  // alone
  const haloGeom = new THREE.SphereGeometry(1.0, 64, 64);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x00ff66,
    transparent: true,
    opacity: 0.15
  });
  group.add(new THREE.Mesh(haloGeom, haloMat));

  // loghi
  const textureLoader = new THREE.TextureLoader();
  const clickableObjects = [];
  const logosRadius = 1.25;

  const logoPositions = [];
  const N = TECHS.length;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // angolo aureo

  for (let i = 0; i < N; i++) {
    // Fibonacci sphere
    const t = N === 1 ? 0.5 : i / (N - 1);  // [0,1]
    const yNorm = 1 - 2 * t;               // da +1 a -1
    const r = Math.sqrt(1 - yNorm * yNorm);
    const theta = goldenAngle * i;

    let x = logosRadius * r * Math.cos(theta);
    let y = logosRadius * yNorm;
    let z = logosRadius * r * Math.sin(theta);

    // opzionale: tieni solo l'emisfero frontale
    if (z < 0) z = -z;

    logoPositions.push(new THREE.Vector3(x, y, z));
  }

  // === CREA GLI SPRITE USANDO LE POSIZIONI FISSE ===
  TECHS.forEach((tech, index) => {
    const tex = textureLoader.load(tech.logo);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);

    const pos = logoPositions[index];
    sprite.position.copy(pos);
    sprite.scale.set(0.6, 0.6, 0.6);
    sprite.userData.techId = tech.id;

    group.add(sprite);
    clickableObjects.push(sprite);
  });

  // stato interazione
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;
  let deltaMoveX = 0, deltaMoveY = 0;
  let isDetailOpen = false;
  let isFocusing = false;

  // animazione focus
  let focusStartTime = 0;
  const focusDuration = 900;
  let focusFromQuat = new THREE.Quaternion();
  let focusToQuat = new THREE.Quaternion();
  let focusFromScale = new THREE.Vector3();
  let focusToScale = new THREE.Vector3(0.8, 0.8, 0.8);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function getClientXY(e) {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  function onPointerDown(e) {
    if (isFocusing || isDetailOpen) return;
    if (e.button !== undefined && e.button !== 0) return;

    isDragging = true;
    deltaMoveX = deltaMoveY = 0;
    const { clientX, clientY } = getClientXY(e);
    lastMouseX = clientX;
    lastMouseY = clientY;
  }

  function onPointerMove(e) {
    if (!isDragging || isFocusing || isDetailOpen) return;
    const { clientX, clientY } = getClientXY(e);
    const dx = clientX - lastMouseX;
    const dy = clientY - lastMouseY;
    lastMouseX = clientX;
    lastMouseY = clientY;

    deltaMoveX += Math.abs(dx);
    deltaMoveY += Math.abs(dy);

    const speed = 0.005;
    const qY = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      dx * speed
    );
    const qX = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      dy * speed
    );
    group.quaternion.multiplyQuaternions(qY, group.quaternion);
    group.quaternion.multiplyQuaternions(qX, group.quaternion);
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
  
    const moveX = Math.abs(deltaMoveX);
    const moveY = Math.abs(deltaMoveY);
  
    // soglia più alta, molto più "umana"
    if (moveX < 15 && moveY < 15) {
      handleClick(e);
    }
  }
  

  function handleClick(e) {
    if (isFocusing || isDetailOpen) return;

    const rect = renderer.domElement.getBoundingClientRect();
    const { clientX, clientY } = getClientXY(e);
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickableObjects);
    if (hits.length > 0) {
      const sprite = hits[0].object;
      startFocus(sprite);
    }
  }

  function setPanelContent(techId) {
    const tech = TECHS.find(t => t.id === techId);
    if (!tech) return;
    if (panelTitle) panelTitle.textContent = tech.name;
    if (panelDescription) panelDescription.textContent = tech.description;
    if (panelProjects) {
      panelProjects.innerHTML = "";
      tech.projects.forEach(p => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = p.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = p.label;
        li.appendChild(a);
        panelProjects.appendChild(li);
      });
    }
  }

  // 👉 Focus: pannello aperto SUBITO, sfera si rimpicciolisce e ruota per
  // portare il logo PRECISAMENTE al centro frontale.
 // sphere-projects.js

 function startFocus(sprite) {
  const techId = sprite.userData.techId;
  if (!techId) return;

  // stessa soglia del CSS: sotto i 992px consideriamo "mobile"
  const isMobile = window.innerWidth < 992;

  // il dettaglio viene aperto in ogni caso
  isDetailOpen = true;

  // 1) aggiorna il contenuto del pannello
  setPanelContent(techId);

  // 2) aggiungi la classe che fa comparire il pannello + sistema il canvas
  setTimeout(() => {
    document.body.classList.add("detail-open");
    updateRendererSize();
  }, 10);

  // 📱 — MOBILE: niente animazione sfera, solo scroll al pannello
  if (isMobile) {
    isFocusing = false; // nessuna animazione di focus

    const panel =
      document.getElementById("tech-panel") ||
      document.querySelector(".projects-section.tech-panel");

    if (panel) {
      // delay per far comparire il pannello e far assestare il layout
      setTimeout(() => {
        const rect = panel.getBoundingClientRect();

        // offset per la navbar (70px) così il pannello non resta nascosto sotto
        const offset = 80;

        const targetY = rect.top + window.scrollY - offset;

        window.scrollTo({
          top: targetY,
          behavior: "smooth"
        });
      }, 300);
    }

    // non eseguire l'animazione desktop
    return;
  }


  // 💻 — DESKTOP: comportamento vecchio (animazione sfera)
  isFocusing = true;
  focusStartTime = performance.now();

  // stato iniziale
  focusFromQuat.copy(group.quaternion);
  focusFromScale.copy(group.scale);

  // calcola la direzione del logo nello spazio mondo
  const worldPos = sprite.getWorldPosition(new THREE.Vector3());
  const worldDir = worldPos.clone().normalize(); // da origine al logo
  const frontDir = new THREE.Vector3(0, 0, 1);   // verso la camera

  // rotazione che porta worldDir -> frontDir
  const rotQuat = new THREE.Quaternion().setFromUnitVectors(
    worldDir,
    frontDir
  );

  // nuova rotazione target: R * orientazione corrente
  const currentQuat = group.quaternion.clone();
  focusToQuat.copy(rotQuat).multiply(currentQuat);

  // sfera un po' più piccola in focus
  focusToScale.set(0.8, 0.8, 0.8);
}





  function closePanel() {
    // sblocchiamo lo stato "dettaglio"
    isDetailOpen = false;
    isFocusing = false;
    document.body.classList.remove("detail-open");

    // riportiamo la sfera allo stato iniziale
    group.quaternion.copy(initialGroupQuat);
    group.scale.copy(initialGroupScale);
    setTimeout(updateRendererSize, 0);
  }

  if (panelClose) panelClose.addEventListener("click", closePanel);

  // eventi mouse
  container.addEventListener("mousedown", onPointerDown);
  container.addEventListener("mousemove", onPointerMove);
  container.addEventListener("mouseup", onPointerUp);
  container.addEventListener("mouseleave", onPointerUp);

  // eventi touch
  container.addEventListener("touchstart", onPointerDown, { passive: true });
  container.addEventListener("touchmove", onPointerMove, { passive: true });
  container.addEventListener("touchend", onPointerUp);

  // resize
  window.addEventListener("resize", updateRendererSize);

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();

    // auto-rotazione solo quando non stai trascinando e non sei in dettaglio
    if (!isDragging && !isDetailOpen && !isFocusing) {
      group.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.004);
    }

    // animazione di focus (rotazione + scala)
    if (isFocusing) {
      const t = Math.min((now - focusStartTime) / focusDuration, 1);
      const s = easeInOutQuad(t);

      // ⚠️ FIX: niente THREE.Quaternion.slerp statico
      group.quaternion.copy(focusFromQuat).slerp(focusToQuat, s);

      const currScale = new THREE.Vector3();
      currScale.lerpVectors(focusFromScale, focusToScale, s);
      group.scale.copy(currScale);

      if (t >= 1) isFocusing = false;
    }

    renderer.render(scene, camera);
  }

  updateRendererSize();
  animate();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNeonSphere);
} else {
  initNeonSphere();
}
