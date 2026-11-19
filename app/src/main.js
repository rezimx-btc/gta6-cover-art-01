// Leonida Cover Studio — editor wiring.
// Loads photos, drives the crop sliders, layout / grade / size choices,
// keeps the live preview fresh and exports the finished cover as a PNG.

import {
  SIZES,
  layoutPanels,
  makeSampleScene,
  renderCover,
  exportCoverPng,
} from "./cover.js";

const preview = document.getElementById("preview");
const previewLabel = document.getElementById("previewLabel");
const panelPhotos = document.getElementById("panelPhotos");
const panelSelect = document.getElementById("panelSelect");
const zoomRange = document.getElementById("zoomRange");
const zoomVal = document.getElementById("zoomVal");
const offsetXRange = document.getElementById("offsetXRange");
const offsetXVal = document.getElementById("offsetXVal");
const offsetYRange = document.getElementById("offsetYRange");
const offsetYVal = document.getElementById("offsetYVal");

const state = {
  width: 1080,
  height: 1080,
  sizeKey: "1080x1080",
  layout: "hero",
  grade: "sunset",
  captionTop: "LEONIDA",
  captionBottom: "VICE NIGHTS",
  captionTag: "SUNSET STATE · EST. 2026",
  panels: [
    { image: null, zoom: 1, offsetX: 0, offsetY: 0 },
    { image: null, zoom: 1, offsetX: 0, offsetY: 0 },
    { image: null, zoom: 1, offsetX: 0, offsetY: 0 },
    { image: null, zoom: 1, offsetX: 0, offsetY: 0 },
  ],
};

let selectedPanel = 0;

function panelCount() {
  return layoutPanels(state.layout).length;
}

function renderPreview() {
  renderCover(preview, state);
  previewLabel.textContent =
    "Live preview — " + state.width + " × " + state.height;
}

function buildPanelControls() {
  panelPhotos.innerHTML = "";
  panelSelect.innerHTML = "";
  const count = panelCount();
  for (let i = 0; i < count; i++) {
    const label = document.createElement("label");
    label.className = "file-label";
    label.textContent = "Photo — panel " + (i + 1);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.dataset.panel = String(i);
    input.addEventListener("change", onPhotoFile);
    label.appendChild(input);
    panelPhotos.appendChild(label);
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = "Panel " + (i + 1);
    panelSelect.appendChild(option);
  }
  if (selectedPanel >= count) selectedPanel = 0;
  panelSelect.value = String(selectedPanel);
  syncSliders();
}

function syncSliders() {
  const slot = state.panels[selectedPanel];
  zoomRange.value = String(Math.round(slot.zoom * 100));
  zoomVal.textContent = Math.round(slot.zoom * 100) + "%";
  offsetXRange.value = String(Math.round(slot.offsetX * 100));
  offsetXVal.textContent = String(Math.round(slot.offsetX * 100));
  offsetYRange.value = String(Math.round(slot.offsetY * 100));
  offsetYVal.textContent = String(Math.round(slot.offsetY * 100));
}

function loadImageFile(file, index) {
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      state.panels[index].image = image;
      renderPreview();
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
}

function onPhotoFile(event) {
  const input = event.target;
  const index = Number(input.dataset.panel || 0);
  const file = input.files && input.files[0];
  if (file) loadImageFile(file, index);
  input.value = "";
}

function loadSamplePhotos() {
  const kinds = ["sunset", "pier", "palms", "sunset"];
  for (let i = 0; i < state.panels.length; i++) {
    state.panels[i].image = makeSampleScene(kinds[i % kinds.length], 1080, 1080);
    state.panels[i].zoom = 1;
    state.panels[i].offsetX = 0;
    state.panels[i].offsetY = 0;
  }
  syncSliders();
  renderPreview();
}

function bindChoiceRow(rowId, onPick) {
  const row = document.getElementById(rowId);
  row.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    row.querySelectorAll(".choice").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    onPick(button);
  });
}

function bindControls() {
  document.getElementById("photoAll").addEventListener("change", (event) => {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        state.panels.forEach((slot) => {
          slot.image = image;
        });
        renderPreview();
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    input.value = "";
  });

  document.getElementById("sampleBtn").addEventListener("click", loadSamplePhotos);

  panelSelect.addEventListener("change", () => {
    selectedPanel = Number(panelSelect.value);
    syncSliders();
  });
  zoomRange.addEventListener("input", () => {
    state.panels[selectedPanel].zoom = Number(zoomRange.value) / 100;
    zoomVal.textContent = zoomRange.value + "%";
    renderPreview();
  });
  offsetXRange.addEventListener("input", () => {
    state.panels[selectedPanel].offsetX = Number(offsetXRange.value) / 100;
    offsetXVal.textContent = offsetXRange.value;
    renderPreview();
  });
  offsetYRange.addEventListener("input", () => {
    state.panels[selectedPanel].offsetY = Number(offsetYRange.value) / 100;
    offsetYVal.textContent = offsetYRange.value;
    renderPreview();
  });

  bindChoiceRow("layoutRow", (button) => {
    state.layout = button.dataset.layout;
    buildPanelControls();
    renderPreview();
  });
  bindChoiceRow("gradeRow", (button) => {
    state.grade = button.dataset.grade;
    renderPreview();
  });
  bindChoiceRow("sizeRow", (button) => {
    state.sizeKey = button.dataset.size;
    const size = SIZES[state.sizeKey];
    state.width = size.width;
    state.height = size.height;
    renderPreview();
  });

  document.getElementById("captionTop").addEventListener("input", (event) => {
    state.captionTop = event.target.value.toUpperCase();
    renderPreview();
  });
  document.getElementById("captionBottom").addEventListener("input", (event) => {
    state.captionBottom = event.target.value.toUpperCase();
    renderPreview();
  });
  document.getElementById("captionTag").addEventListener("input", (event) => {
    state.captionTag = event.target.value.toUpperCase();
    renderPreview();
  });

  document.getElementById("exportBtn").addEventListener("click", async () => {
    const button = document.getElementById("exportBtn");
    button.textContent = "Exporting…";
    const blob = await exportCoverPng(state);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leonida-cover-" + state.sizeKey + ".png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    button.textContent = "Export PNG";
  });
}

// Boot: sample photos in, controls live, first preview drawn.
buildPanelControls();
bindControls();
loadSamplePhotos();
