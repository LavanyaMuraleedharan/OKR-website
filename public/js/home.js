document.addEventListener("DOMContentLoaded", () => {
  // Draw progress chart
  const canvas = document.getElementById("userProgress");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [72, 28],
            backgroundColor: ["#3498db", "#eee"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });
  }

  // Add section switching
  window.showSection = (id) => {
    document.querySelectorAll(".section").forEach((sec) => {
      sec.style.display = "none";
    });
    const sec = document.getElementById(id);
    if (sec) sec.style.display = "block";

    const titles = {
      dashboard: "Dashboard",
      "company-okrs": "Company OKRs",
      "team-okrs": "Team OKRs",
      "my-okrs": "My OKRs",
    };
    document.getElementById("pageTitle").innerText = titles[id] || "MyOKR";
  };

  // Default section
  showSection("dashboard");
});
const compCanvas = document.getElementById("companyProgress");
if (compCanvas) {
  const ctx2 = compCanvas.getContext("2d");
  new Chart(ctx2, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [60, 40],
          backgroundColor: ["#2ecc71", "#eee"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
    },
  });
}
