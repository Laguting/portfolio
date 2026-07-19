// Find the toggle button in the DOM
const toggle = document.getElementById("theme-toggle");

// Apply or remove the dark-mode class based on the boolean
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");
        toggle.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        toggle.textContent = "🌙 Dark Mode";
    }
}

// Check if the user previously chose a theme
const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "dark");

// Listen for clicks and toggle the theme
toggle.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    toggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});