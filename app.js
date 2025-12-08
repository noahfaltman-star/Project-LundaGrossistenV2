// Funktion som växlar mellan att visa och dölja dropdown-menyn
function toggleDropdown() {
	const dropdown = document.getElementById("myDropdown");
	dropdown.classList.toggle("show");
}

// Stänger dropdown-menyn om användaren klickar utanför den
window.onclick = function (event) {
	// ANVÄND .closest() FÖR ATT FÅNGA KLICK PÅ KNAPPEN ELLER IKONEN INUTI
	if (!event.target.closest(".menyKnapp")) {
		const dropdown = document.getElementById("myDropdown");

		// Stänger menyn om den är öppen
		if (dropdown && dropdown.classList.contains("show")) {
			dropdown.classList.remove("show");
		}
	}
};
