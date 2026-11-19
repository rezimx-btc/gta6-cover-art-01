// Leonida Cover Studio — cover renderer.
// Draws the multi-panel poster, its colour grades and its caption lettering
// onto a canvas. No network, no external assets: everything is drawn here.

export const SIZES = {
  "1080x1080": { width: 1080, height: 1080 },
  "1080x1350": { width: 1080, height: 1350 },
  "1920x1080": { width: 1920, height: 1080 },
};

export const GRADES = {
  sunset: {
    label: "Sunset",
    photoFilter: "saturate(1.3) contrast(1.06)",
    wash: ["rgba(255,122,61,0.20)", "rgba(255,46,136,0.16)"],
    caption: "#fff3d6",
    accent: "#ffc24b",
  },
  neon: {
    label: "Neon night",
    photoFilter: "saturate(1.55) contrast(1.12) hue-rotate(-12deg)",
    wash: ["rgba(255,46,136,0.26)", "rgba(46,230,214,0.20)"],
    caption: "#ffffff",
    accent: "#2ee6d6",
  },
  dusk: {
    label: "Palm dusk",
    photoFilter: "saturate(1.15) contrast(1.05) hue-rotate(18deg)",
    wash: ["rgba(64,40,140,0.24)", "rgba(46,230,214,0.12)"],
    caption: "#ffe9f4",
    accent: "#ff7ad9",
  },
  ink: {
    label: "Ink",
    photoFilter: "grayscale(1) contrast(1.22) brightness(1.05)",
    wash: ["rgba(0,0,0,0.10)", "rgba(255,255,255,0.06)"],
    caption: "#ffffff",
    accent: "#e8e8e8",
  },
};

// Panel rectangles for each layout, in fractions of the cover size.
export function layoutPanels(layout) {
  if (layout === "triple") {
    return [
      { x: 0, y: 0, w: 1 / 3, h: 1 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 1 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 1 },
    ];
  }
  if (layout === "grid") {
    return [
      { x: 0, y: 0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
      { x: 0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ];
  }
  if (layout === "full") {
    return [{ x: 0, y: 0, w: 1, h: 1 }];
  }
  return [
    { x: 0, y: 0, w: 0.62, h: 1 },
    { x: 0.62, y: 0, w: 0.38, h: 0.5 },
    { x: 0.62, y: 0.5, w: 0.38, h: 0.5 },
  ];
}

// A procedural sample scene, drawn with canvas only — the app's own art,
// used as the demo photo so the editor works before the user loads a photo.
export function makeSampleScene(kind, width, height) {
  const scene = document.createElement("canvas");
  scene.width = width;
  scene.height = height;
  const ctx = scene.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, height * 0.62);
  if (kind === "pier") {
    sky.addColorStop(0, "#2a1b5e");
    sky.addColorStop(0.55, "#c94b7c");
    sky.addColorStop(1, "#ff9a52");
  } else if (kind === "palms") {
    sky.addColorStop(0, "#12082e");
    sky.addColorStop(0.55, "#5b1040");
    sky.addColorStop(1, "#ff6a3d");
  } else {
    sky.addColorStop(0, "#ff9a52");
    sky.addColorStop(0.55, "#ff5e7a");
    sky.addColorStop(1, "#7a2a8a");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height * 0.62);
  drawSun(ctx, width * 0.68, height * 0.34, width * 0.13);
  drawSkyline(ctx, width, height);
  drawGround(ctx, kind, width, height);
  if (kind !== "pier") drawPalm(ctx, width * 0.12, height * 0.62, height * 0.42);
  if (kind === "palms") drawPalm(ctx, width * 0.86, height * 0.62, height * 0.5);
  return scene;
}

function drawSun(ctx, x, y, radius) {
  const glow = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.4);
  glow.addColorStop(0, "rgba(255,236,170,0.95)");
  glow.addColorStop(0.4, "rgba(255,170,90,0.45)");
  glow.addColorStop(1, "rgba(255,120,60,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius * 2.4, y - radius * 2.4, radius * 4.8, radius * 4.8);
  ctx.fillStyle = "#ffedbe";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawSkyline(ctx, width, height) {
  const base = height * 0.62;
  ctx.fillStyle = "rgba(30,10,50,0.85)";
  let x = 0;
  let seed = 7;
  while (x < width) {
    seed = (seed * 31 + 17) % 97;
    const bw = width * (0.06 + (seed % 9) * 0.012);
    const bh = height * (0.08 + (seed % 13) * 0.012);
    ctx.fillRect(x, base - bh, bw, bh);
    x += bw + width * 0.012;
  }
}

function drawGround(ctx, kind, width, height) {
  const top = height * 0.62;
  if (kind === "pier") {
    const sea = ctx.createLinearGradient(0, top, 0, height);
    sea.addColorStop(0, "#b83a6e");
    sea.addColorStop(1, "#2a1040");
    ctx.fillStyle = sea;
    ctx.fillRect(0, top, width, height - top);
    ctx.strokeStyle = "rgba(255,220,180,0.5)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const y = top + (height - top) * (0.12 + i * 0.14);
      ctx.beginPath();
      ctx.moveTo(width * 0.1, y);
      ctx.lineTo(width * 0.9, y);
      ctx.stroke();
    }
    ctx.fillStyle = "#3a1c22";
    ctx.fillRect(width * 0.42, top, width * 0.16, height - top);
    ctx.fillStyle = "#5a2c30";
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(width * 0.42, top + i * ((height - top) / 7), width * 0.16, 3);
    }
    return;
  }
  const road = ctx.createLinearGradient(0, top, 0, height);
  road.addColorStop(0, "#241533");
  road.addColorStop(1, "#0d0a14");
  ctx.fillStyle = road;
  ctx.fillRect(0, top, width, height - top);
  ctx.fillStyle = "#ffc24b";
  ctx.beginPath();
  ctx.moveTo(width * 0.48, top);
  ctx.lineTo(width * 0.52, top);
  ctx.lineTo(width * 0.62, height);
  ctx.lineTo(width * 0.38, height);
  ctx.closePath();
  ctx.fill();
}

function drawPalm(ctx, x, baseY, size) {
  ctx.strokeStyle = "#140a24";
  ctx.lineWidth = size * 0.045;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.quadraticCurveTo(x + size * 0.08, baseY - size * 0.55, x + size * 0.16, baseY - size);
  ctx.stroke();
  const topX = x + size * 0.16;
  const topY = baseY - size;
  ctx.lineWidth = size * 0.03;
  for (let i = 0; i < 7; i++) {
    const angle = Math.PI * (0.08 + i * 0.14);
    const len = size * (0.42 + (i % 3) * 0.06);
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(
      topX + Math.cos(angle) * len * 0.6,
      topY - Math.sin(angle) * len * 0.4 + size * 0.12,
      topX + Math.cos(angle) * len,
      topY - Math.sin(angle) * len * 0.5 + size * 0.22
    );
    ctx.stroke();
  }
}

// Draw one photo into a panel rect with cover-fit, zoom and pan offsets.
function drawPhotoCover(ctx, image, rect, zoom, offsetX, offsetY) {
  const iw = image.width;
  const ih = image.height;
  const scale = Math.max(rect.w / iw, rect.h / ih) * zoom;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = rect.x + (rect.w - dw) / 2 + offsetX * rect.w;
  const dy = rect.y + (rect.h - dh) / 2 + offsetY * rect.h;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
  ctx.clip();
  ctx.drawImage(image, dx, dy, dw, dh);
  ctx.restore();
}

// Bold condensed poster lettering: squashed, outlined, slightly tilted.
function drawCaptionText(ctx, text, x, y, size, color, align) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.02);
  ctx.scale(0.84, 1);
  ctx.font = "900 " + size + "px 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif";
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.lineWidth = size / 9;
  ctx.strokeStyle = "rgba(10,4,20,0.92)";
  ctx.strokeText(text, 0, 0);
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawTagText(ctx, text, x, y, size, color) {
  ctx.save();
  ctx.font = "700 " + size + "px 'Helvetica Neue', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const width = ctx.measureText(text).width;
  ctx.fillStyle = "rgba(10,4,20,0.72)";
  ctx.fillRect(x - 10, y - size - 8, width + 20, size + 16);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// Colour grade wash + vignette over the whole cover.
function applyGradeWash(ctx, width, height, grade) {
  const wash = ctx.createLinearGradient(0, 0, width, height);
  wash.addColorStop(0, grade.wash[0]);
  wash.addColorStop(1, grade.wash[1]);
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.35,
    width / 2, height / 2, Math.max(width, height) * 0.75
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.34)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function fitCaptionSize(ctx, text, maxWidth, startSize) {
  let size = startSize;
  ctx.font = "900 " + size + "px 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif";
  while (size > 24 && ctx.measureText(text).width * 0.84 > maxWidth) {
    size -= 4;
    ctx.font = "900 " + size + "px 'Arial Narrow', 'Helvetica Neue', Arial, sans-serif";
  }
  return size;
}

// Render the whole cover onto the given canvas.
// state: { width, height, layout, grade, captionTop, captionBottom,
//   captionTag, panels: [{ image, zoom, offsetX, offsetY }] }
export function renderCover(canvas, state) {
  const grade = GRADES[state.grade] || GRADES.sunset;
  const width = state.width;
  const height = state.height;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0d0a14";
  ctx.fillRect(0, 0, width, height);

  const panels = layoutPanels(state.layout);
  const gutter = Math.max(6, Math.round(Math.min(width, height) * 0.008));
  panels.forEach((panel, index) => {
    const rect = {
      x: panel.x * width + (panel.x > 0 ? gutter / 2 : 0),
      y: panel.y * height + (panel.y > 0 ? gutter / 2 : 0),
      w: panel.w * width - (panel.x > 0 ? gutter / 2 : 0) - (panel.x + panel.w < 1 ? gutter / 2 : 0),
      h: panel.h * height - (panel.y > 0 ? gutter / 2 : 0) - (panel.y + panel.h < 1 ? gutter / 2 : 0),
    };
    const slot = state.panels[index] || state.panels[0];
    if (slot && slot.image) {
      ctx.save();
      ctx.filter = grade.photoFilter;
      drawPhotoCover(ctx, slot.image, rect, slot.zoom || 1, slot.offsetX || 0, slot.offsetY || 0);
      ctx.restore();
    } else {
      const fallback = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
      fallback.addColorStop(0, "#3a2158");
      fallback.addColorStop(1, "#12081f");
      ctx.fillStyle = fallback;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
  });

  applyGradeWash(ctx, width, height, grade);

  const margin = Math.round(width * 0.045);
  if (state.captionTop) {
    const topSize = fitCaptionSize(ctx, state.captionTop, width - margin * 2, Math.round(width * 0.115));
    drawCaptionText(ctx, state.captionTop, margin, margin + topSize, topSize, grade.caption, "left");
  }
  if (state.captionBottom) {
    const bottomSize = fitCaptionSize(ctx, state.captionBottom, width - margin * 2, Math.round(width * 0.085));
    drawCaptionText(ctx, state.captionBottom, margin, height - margin, bottomSize, grade.accent, "left");
  }
  if (state.captionTag) {
    drawTagText(ctx, state.captionTag, margin, height - margin - Math.round(width * 0.085) - 14, Math.round(width * 0.024), "#ffffff");
  }
  return canvas;
}

// Export the current cover as a PNG blob.
export function exportCoverPng(state) {
  const offscreen = document.createElement("canvas");
  renderCover(offscreen, state);
  return new Promise((resolve) => {
    offscreen.toBlob((blob) => resolve(blob), "image/png");
  });
}
