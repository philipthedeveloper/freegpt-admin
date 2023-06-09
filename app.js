const formEl = document.forms["request-form"];
const fillAll = document.querySelector(".fill_all");
const fillAllText = fillAll.querySelector("p");

formEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formEl);
  let name = formData.get("name");
  let email = formData.get("email");
  let description = formData.get("description");
  if (!name || !email || !description) {
    return handleFillAll("Please fill all fields");
  }

  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return handleFillAll("Please enter a valid email");
  }

  if (description.length < 15) {
    return handleFillAll("Description cannot be less than 15 characters");
  }

  submitRequest({ name, email, description });
});

const submitRequest = async (data) => {
  try {
    let response = await fetch(
      "https://freegpt-d7zp.onrender.com/api/v1/user-request",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      }
    );
    let jsonResponse = await response.json();
    if (jsonResponse.success) {
      location.pathname = "/success.html";
    } else {
      return handleFillAll(
        jsonResponse?.msg || "An error occured. Please try again."
      );
    }
  } catch (error) {
    console.log(error);
    return handleFillAll(JSON.stringify(error?.message));
  }
};

function handleFillAll(data) {
  fillAllText.textContent = data;
  fillAll.classList.add("show");
  let timeOut = setTimeout(() => {
    fillAll.classList.remove("show");
    clearTimeout(timeOut);
  }, 1500);
}
