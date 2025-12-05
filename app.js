// Funktion som kallas när "Meny"-knappen klickas
function toggleDropdown() {
	// Hämtar meny-elementet med dess ID
	const dropdown = document.getElementById("myDropdown");

	// Växlar (togglar) klassen 'show'.
	// Om klassen finns, tas den bort (menyn döljs).
	// Om klassen inte finns, läggs den till (menyn visas).
	dropdown.classList.toggle("show");
}

// Stänger dropdown-menyn om användaren klickar utanför den
window.onclick = function (event) {
	// Kollar om det klickade elementet INTE har klassen 'textbutton'
	if (!event.target.matches(".textbutton")) {
		const dropdowns = document.getElementsByClassName("dropdown-menu");

		// Går igenom alla drop-downs (även om vi bara har en)
		for (let i = 0; i < dropdowns.length; i++) {
			const openDropdown = dropdowns[i];

			// Om menyn är öppen, dölj den genom att ta bort 'show'-klassen
			if (openDropdown.classList.contains("show")) {
				openDropdown.classList.remove("show");
			}
		}
	}
};
