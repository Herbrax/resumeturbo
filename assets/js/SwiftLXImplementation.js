import { exportLatex } from './templates.js'; // Adjust the path as necessary

const compileBtn = document.getElementById("compilebtn");
const globalEn = new XeTeXEngine();
const dvipdfmxEn = new DvipdfmxEngine();

    async function init() {
    await globalEn.loadEngine();
    await dvipdfmxEn.loadEngine();
    compileBtn.innerHTML = "Compile";
    compileBtn.className = "primaryButton";
    compileBtn.disabled = false;
    }

    async function compile() {
    if (!globalEn.isReady() || !dvipdfmxEn.isReady()) {
        console.log("Engine not ready yet");
        return;
    }
    compileBtn.disabled = true;
    compileBtn.innerHTML = "Compiling...";
    compileBtn.className = "secondaryButton";
    const latexSource =  exportLatex();
    console.log(latexSource); // Log the LaTeX document
    globalEn.writeMemFSFile("main.tex", latexSource);
    globalEn.setEngineMainFile("main.tex");
    let r = await globalEn.compileLaTeX();
    compileBtn.innerHTML = "Compile";
    compileBtn.className = "primaryButton";
    compileBtn.disabled = false;

  if (r.status === 0) {
    dvipdfmxEn.writeMemFSFile("main.xdv", r.pdf);
    dvipdfmxEn.setEngineMainFile("main.xdv");
    let r1 = await dvipdfmxEn.compilePDF();
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
