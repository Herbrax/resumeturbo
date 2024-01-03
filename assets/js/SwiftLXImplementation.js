import { exportLatex } from './templates.js'; // Adjust the path as necessary

const compileBtn = document.getElementById("compilebtn");
const globalEn = new XeTeXEngine();
const dvipdfmxEn = new DvipdfmxEngine();
let lastCompiledStyle = null; // Global variable to track the last compiled style

    async function init() {
    await globalEn.loadEngine();
    await dvipdfmxEn.loadEngine();
    compileBtn.innerHTML = "Compile PDF";
    compileBtn.className = "primaryButton";
    compileBtn.disabled = false;
    }

    async function compile() {
    if (!globalEn.isReady() || !dvipdfmxEn.isReady()) {
        console.log("Engine not ready yet");
        return;
    }
    const currentStyle = document.querySelector(".spinner-value").textContent;
    if (lastCompiledStyle === "Omar\'s Resume" && currentStyle !== "Omar\'s Resume") {
      // Because the Omar\'s Resume crash the other styles, we need to close the worker and reload the engine
      await globalEn.closeWorker();
      await globalEn.loadEngine(); // Assuming there's a method to reload the engine
    }

    compileBtn.disabled = true;
    compileBtn.innerHTML = "Compiling... (30s)";
    compileBtn.className = "secondaryButton";
    const latexSource =  exportLatex();
    console.log(latexSource); // Log the LaTeX document
    lastCompiledStyle = currentStyle;
    globalEn.writeMemFSFile("Resume.tex", latexSource);
    globalEn.setEngineMainFile("Resume.tex");
    let r = await globalEn.compileLaTeX();
    compileBtn.innerHTML = "Rendering PDF";

  if (r.status === 0) {
    dvipdfmxEn.writeMemFSFile("main.xdv", r.pdf);
    dvipdfmxEn.setEngineMainFile("main.xdv");
    let r1 = await dvipdfmxEn.compilePDF();
    console.log("pdf ready")
    compileBtn.innerHTML = "Compile PDF";
    compileBtn.className = "primaryButton";
    compileBtn.disabled = false;
    const pdfblob = new Blob([r1.pdf], {type: 'application/pdf'});
    const objectURL = URL.createObjectURL(pdfblob);
    setTimeout(() => {
      URL.revokeObjectURL(objectURL);
    }, 30000);
    // Hide the carousel when the viewer is active
    const carouselElement = document.getElementById("carousel");
    if (carouselElement) {
        carouselElement.style.display = "none";
    }    
    const pdfViewer = document.getElementById("pdf-viewer");
    pdfViewer.src = `assets/js/pdfjs/web/viewer.html?file=${encodeURIComponent(objectURL)}`;
  } else {
    alert("Compilation failed. Invalid characters in LaTeX");
    compileBtn.innerHTML = "Compile PDF";
    compileBtn.className = "primaryButton";
    compileBtn.disabled = false;
  }
}

init();

document.addEventListener('DOMContentLoaded', function() {
  const editorInkElement = document.getElementById("editorInk");

  // Check if the element exists
  if (editorInkElement) {
      editorInkElement.addEventListener('click', function() {
          downloadLatexFile();
          console.log("Downloaded latex")
      });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  
  const compileBtn = document.getElementById("compilebtn");
  if (compileBtn) {
      compileBtn.addEventListener('click', compile);
  }
});
