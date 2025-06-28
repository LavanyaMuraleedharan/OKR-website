function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((sec) => {
    sec.style.display = "none";
  });

  document.getElementById(sectionId).style.display = "block";

  if (sectionId === "company-okrs") {
    drawCompanyOKRCharts();
  }
}

function drawCompanyOKRCharts() {
  document.querySelectorAll(".okrChart").forEach((canvas) => {
    const progress = parseInt(canvas.getAttribute("data-progress")) || 0;

    new Chart(canvas.getContext("2d"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [progress, 100 - progress],
            backgroundColor: ["#3498db", "#ecf0f1"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });
  });
}

window.onload = () => showSection("dashboard");
