import * as pdfjsLib from
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


const PDF_FILE = "./document.pdf";

let pdf = null;
let currentPage = 1;
let scale = 1.3;


const viewer =
  document.getElementById("viewer");

const loading =
  document.getElementById("loading");

const pageNum =
  document.getElementById("page-num");

const pageCount =
  document.getElementById("page-count");


async function loadPDF() {

  try {

    pdf = await pdfjsLib
      .getDocument(PDF_FILE)
      .promise;

    pageCount.textContent =
      pdf.numPages;

    loading.remove();

    await renderPDF();

  } catch (error) {

    console.error(error);

    loading.textContent =
      "Impossible de charger le PDF.";

  }

}


async function renderPDF() {

  viewer.innerHTML = "";

  for (
    let number = 1;
    number <= pdf.numPages;
    number++
  ) {

    const page =
      await pdf.getPage(number);

    const viewport =
      page.getViewport({
        scale: scale
      });

    const container =
      document.createElement("div");

    container.className = "page";


    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("2d");


    const ratio =
      window.devicePixelRatio || 1;


    canvas.width =
      viewport.width * ratio;

    canvas.height =
      viewport.height * ratio;

    canvas.style.width =
      viewport.width + "px";

    canvas.style.height =
      viewport.height + "px";


    container.appendChild(canvas);

    viewer.appendChild(container);


    await page.render({

      canvasContext: context,

      viewport: viewport,

      transform:
        ratio !== 1
          ? [ratio, 0, 0, ratio, 0, 0]
          : null

    }).promise;

  }

  updatePage();

}


function updatePage() {

  pageNum.textContent =
    currentPage;

}


function goToPage(number) {

  if (!pdf) return;

  currentPage =
    Math.max(
      1,
      Math.min(
        pdf.numPages,
        number
      )
    );

  const pages =
    viewer.querySelectorAll(".page");

  if (pages[currentPage - 1]) {

    pages[currentPage - 1]
      .scrollIntoView({
        behavior: "smooth"
      });

  }

  updatePage();

}


document
  .getElementById("prev")
  .addEventListener(
    "click",
    () => goToPage(currentPage - 1)
  );


document
  .getElementById("next")
  .addEventListener(
    "click",
    () => goToPage(currentPage + 1)
  );


document
  .getElementById("zoom-in")
  .addEventListener(
    "click",
    async () => {

      scale += 0.2;

      await renderPDF();

    }
  );


document
  .getElementById("zoom-out")
  .addEventListener(
    "click",
    async () => {

      scale =
        Math.max(
          0.5,
          scale - 0.2
        );

      await renderPDF();

    }
  );


loadPDF();
