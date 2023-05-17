const edit = document.querySelector("#editprof");
const fname = document.querySelector("#inputFirstName");
const lname = document.querySelector("#inputLastName");
const desg = document.querySelector("#inputDesg");
const dept = document.querySelector("#inputDept");
const pemail = document.querySelector("#inputPEmail");
const num = document.querySelector("#inputNumber");

edit.addEventListener("click", () => {
  edit.classList.add("visually-hidden");
  if (fname.hasAttribute("readonly")) {
    fname.removeAttribute("readonly");
  } else {
    fname.setAttribute("readonly", "true");
  }
  if (lname.hasAttribute("readonly")) {
    lname.removeAttribute("readonly");
  } else {
    lname.setAttribute("readonly", "true");
  }
  if (desg.hasAttribute("style")) {
    desg.removeAttribute("style");
  } else {
    desg.setAttribute("style", "pointer-events: none");
  }
  if (dept.hasAttribute("style")) {
    dept.removeAttribute("style");
  } else {
    dept.setAttribute("style", "pointer-events: none");
  }
  if (pemail.hasAttribute("readonly")) {
    pemail.removeAttribute("readonly");
  } else {
    pemail.setAttribute("readonly", "true");
  }
  if (num.hasAttribute("readonly")) {
    num.removeAttribute("readonly");
  } else {
    num.setAttribute("readonly", "true");
  }
});
