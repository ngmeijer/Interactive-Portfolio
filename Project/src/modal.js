let modal = document.getElementsByClassName("modal");
let iFrame = document.getElementsByClassName("videoContainer");
let modalActive = false;

console.log(iFrame);

function showModal(pSrc) {
  if (modalActive == false) {
    modal[0].style.display = "flex";
    iFrame[0].src = pSrc;
    modalActive = true;
  }
}

function closeModal() {
  modal[0].style.display = "none";
  modalActive = false;
  iFrame[0].src = "";
}
