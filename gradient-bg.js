/**
 * Animated, mouse-reactive gradient background.
 * Drop <script src="gradient-bg.js"></script> anywhere in the page —
 * it self-injects its own styles and markup, sits behind all content,
 * and never intercepts clicks/scroll (pointer-events: none throughout).
 */
(function () {
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var style = document.createElement("style");
  style.textContent = [
    ".gradient-bg-root {",
    "  position: fixed;",
    "  inset: 0;",
    "  z-index: -1;",
    "  overflow: hidden;",
    "  pointer-events: none;",
    "  background: #151515;",
    "}",
    ".gradient-bg-root .blob {",
    "  position: absolute;",
    "  border-radius: 50%;",
    "  filter: blur(90px);",
    "  opacity: 0.38;",
    "  mix-blend-mode: screen;",
    "  will-change: transform;",
    "}",
    ".gradient-bg-root .blob-1 {",
    "  width: 46vw;",
    "  height: 46vw;",
    "  left: -10vw;",
    "  top: -10vw;",
    "  background: radial-gradient(circle, #7c3aed 0%, transparent 70%);",
    "  animation: drift1 26s ease-in-out infinite;",
    "}",
    ".gradient-bg-root .blob-2 {",
    "  width: 38vw;",
    "  height: 38vw;",
    "  right: -8vw;",
    "  bottom: -8vw;",
    "  background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);",
    "  animation: drift2 32s ease-in-out infinite;",
    "}",
    ".gradient-bg-root .blob-3 {",
    "  width: 30vw;",
    "  height: 30vw;",
    "  left: 50%;",
    "  top: 50%;",
    "  margin-left: -15vw;",
    "  margin-top: -15vw;",
    "  background: radial-gradient(circle, #db2777 0%, transparent 70%);",
    "  opacity: 0.32;",
    "}",
    "@keyframes drift1 {",
    "  0%, 100% { transform: translate(0, 0) scale(1); }",
    "  50% { transform: translate(6vw, 8vw) scale(1.1); }",
    "}",
    "@keyframes drift2 {",
    "  0%, 100% { transform: translate(0, 0) scale(1); }",
    "  50% { transform: translate(-7vw, -5vw) scale(1.08); }",
    "}",
  ].join("\n");
  document.head.appendChild(style);

  var root = document.createElement("div");
  root.className = "gradient-bg-root";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML =
    '<div class="blob blob-1"></div>' +
    '<div class="blob blob-2"></div>' +
    '<div class="blob blob-3" id="gradient-bg-cursor-blob"></div>';
  document.body.insertBefore(root, document.body.firstChild);

  if (prefersReducedMotion) {
    // Keep the static gradient but skip mouse-tracking/animation for
    // people who've asked their OS to reduce motion.
    return;
  }

  var cursorBlob = document.getElementById("gradient-bg-cursor-blob");
  var targetX = window.innerWidth / 2;
  var targetY = window.innerHeight / 2;
  var currentX = targetX;
  var currentY = targetY;

  function setTarget(x, y) {
    targetX = x;
    targetY = y;
  }

  window.addEventListener(
    "mousemove",
    function (e) {
      setTarget(e.clientX, e.clientY);
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches && e.touches[0]) {
        setTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true },
  );

  function tick() {
    // Ease toward the target so the blob glides instead of snapping.
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    cursorBlob.style.transform =
      "translate3d(" +
      (currentX - window.innerWidth * 0.15) +
      "px," +
      (currentY - window.innerHeight * 0.15) +
      "px,0)";
    cursorBlob.style.left = "0";
    cursorBlob.style.top = "0";
    cursorBlob.style.marginLeft = "0";
    cursorBlob.style.marginTop = "0";
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
