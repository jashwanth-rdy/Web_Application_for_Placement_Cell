const edit = document.querySelector("#editprof");
const comp = document.querySelector("#inputCompany");
const url = document.querySelector("#inputUrl");
const sector = document.querySelector("#inputSector");
const industry = document.querySelector("#inputIndustry");
const coord = document.querySelector("#inputCoordinator");
const num = document.querySelector("#inputNumber");
const alemail = document.querySelector("#inputAlEmail");
const address = document.querySelector("#inputAddress");
const state = document.querySelector("#inputState");
const pin = document.querySelector("#inputZip");

edit.addEventListener("click", () => {
  // if (edit.innerText === "Edit") {
  //   edit.innerText = "Done";
  // } else if (edit.innerText === "Done") {
  //   edit.innerText = "Edit";
  // }
  edit.classList.add("visually-hidden")
  if (comp.hasAttribute("readonly")) {
    comp.removeAttribute("readonly");
  } else {
    comp.setAttribute("readonly", "true");
  }
  if (url.hasAttribute("readonly")) {
    url.removeAttribute("readonly");
  } else {
    url.setAttribute("readonly", "true");
  }
  if (sector.hasAttribute("style")) {
    sector.removeAttribute("style");
  } else {
    sector.setAttribute("style", "pointer-events: none");
  }
  if (industry.hasAttribute("style")) {
    industry.removeAttribute("style");
  } else {
    industry.setAttribute("style", "pointer-events: none");
  }
  if (coord.hasAttribute("readonly")) {
    coord.removeAttribute("readonly");
  } else {
    coord.setAttribute("readonly", "true");
  }
  if (num.hasAttribute("readonly")) {
    num.removeAttribute("readonly");
  } else {
    num.setAttribute("readonly", "true");
  }
  if (alemail.hasAttribute("readonly")) {
    alemail.removeAttribute("readonly");
  } else {
    alemail.setAttribute("readonly", "true");
  }
  if (address.hasAttribute("readonly")) {
    address.removeAttribute("readonly");
  } else {
    address.setAttribute("readonly", "true");
  }
  if (state.hasAttribute("style")) {
    state.removeAttribute("style");
  } else {
    state.setAttribute("style", "pointer-events: none");
  }
  if (pin.hasAttribute("readonly")) {
    pin.removeAttribute("readonly");
  } else {
    pin.setAttribute("readonly", "true");
  }
});
