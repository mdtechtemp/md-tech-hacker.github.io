document.addEventListener("DOMContentLoaded", async () => {
  const vpnGrid = document.getElementById("vpn-grid");
  const loader = document.getElementById("loader");
  const errorContainer = document.getElementById("error-message");

  try {
    const response = await fetch("http://localhost:5000/api/vpn");
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Error fetching VPN data");
    }

    // Clear loader
    if (loader) {
      loader.style.display = "none";
    }

    // Render VPN cards
    result.data.forEach(vpn => {
      const card = document.createElement("div");
      card.className = "vpn-card";
      card.innerHTML = `
        <div class="vpn-title" style="background-image: url('${vpn.image}'); background-size: cover; background-position: center; height: 120px; border-radius: 10px 10px 0 0; position: relative;">
          <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <i class="fas fa-shield-alt text-teal-400"></i>
            <span class="ml-2 text-white">${vpn.provider}</span>
          </div>
        </div>
        <div class="vpn-content p-4">
          <ul class="features-list">
            ${vpn.features.map(feature => `
              <li class="flex items-center mb-2">
                <i class="fas fa-check text-teal-400 mr-2"></i>
                <span class="text-gray-300">${feature}</span>
              </li>
            `).join("")}
          </ul>
          <div class="credentials mt-4 bg-gray-900 p-3 rounded">
            <div class="text-sm text-gray-400 mb-1">Username: <span class="text-teal-400">${vpn.credentials.username}</span></div>
            <div class="text-sm text-gray-400">Password: <span class="text-teal-400">${vpn.credentials.password}</span></div>
          </div>
          <a href="${vpn.download}" class="download-btn mt-4 bg-teal-500 hover:bg-teal-600 transition-colors duration-300">
            <i class="fas fa-download mr-2"></i> Download Config
          </a>
        </div>
      `;
      vpnGrid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading VPN data:", error);
    if (loader) {
      loader.style.display = "none";
    }
    if (errorContainer) {
      errorContainer.textContent = "Failed to load VPN details. Please try again later.";
      errorContainer.style.display = "block";
    }
  }
});
