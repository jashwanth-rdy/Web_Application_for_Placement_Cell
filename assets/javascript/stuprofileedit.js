const edit = document.querySelector("#editprof");
const fname = document.querySelector("#inputFirstName");
const lname = document.querySelector("#inputLastName");
const course = document.querySelector("#inputCourse");
const dept = document.querySelector("#inputDept");
const year = document.querySelector("#inputYear");
const pemail = document.querySelector("#inputPEmail");
const num = document.querySelector("#inputNumber");
const cgpa = document.querySelector("#inputCGPA");

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
  if (course.hasAttribute("style")) {
    course.removeAttribute("style");
  } else {
    course.setAttribute("style", "pointer-events: none");
  }
  if (dept.hasAttribute("style")) {
    dept.removeAttribute("style");
  } else {
    dept.setAttribute("style", "pointer-events: none");
  }
  if (year.hasAttribute("style")) {
    year.removeAttribute("style");
  } else {
    year.setAttribute("style", "pointer-events: none");
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
  if (cgpa.hasAttribute("readonly")) {
    cgpa.removeAttribute("readonly");
  } else {
    cgpa.setAttribute("readonly", "true");
  }
});
