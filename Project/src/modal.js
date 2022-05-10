let modal = document.getElementsByClassName("modal");
let iFrame = document.getElementsByClassName("videoContainer");
let closeButton = document.getElementsByClassName("modal-close");
closeButton[0].addEventListener("click", closeModal, false);
let modalActive = false;

export function showModal(pSrc) {
  if (modalActive == false) {
    modal[0].style.display = "flex";
    iFrame[0].src = pSrc;
    modalActive = true;
  }
}

export function closeModal() {
  console.log("closing modal");
  modal[0].style.display = "none";
  modalActive = false;
  iFrame[0].src = "";
}