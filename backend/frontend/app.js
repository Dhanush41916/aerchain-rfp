async function uploadRfp() {
  const fileInput = document.getElementById("fileInput");
  const result = document.getElementById("result");

  if (!fileInput.files.length) {
    alert("Please select a PDF file");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch("http://localhost:7000/api/rfp/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    result.textContent = JSON.stringify(data, null, 2);

  } catch (err) {
    result.textContent = "Error: " + err.message;
  }
}
