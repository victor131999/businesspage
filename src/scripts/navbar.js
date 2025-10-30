window.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("products-trigger");
  const panel = document.getElementById("products-panel");
  console.log("trigger:", !!trigger, "panel:", !!panel);

  if (!trigger || !panel) return;
   console.log("Adding event listener to trigger");
  trigger.addEventListener("click", () => panel.classList.toggle("hidden"));
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !trigger.contains(e.target)) {
      panel.classList.add("hidden");
    }
  });
});