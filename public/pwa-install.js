(function () {
  let deferredPrompt = null;
  const ensureBtn = () => {
    let btn = document.getElementById("installBtn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "installBtn";
      btn.textContent = "Install StreamList";
      btn.style.cssText = "position:fixed;right:16px;bottom:16px;display:none;padding:10px 14px;border-radius:10px;border:1px solid #0ea5e9;background:#fff;cursor:pointer;z-index:9999;";
      document.body.appendChild(btn);
    }
    return btn;
  };
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = ensureBtn();
    btn.style.display = "inline-flex";
    btn.onclick = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      btn.style.display = "none";
    };
  });
})();
