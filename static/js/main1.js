var videoFootageDetails = document.querySelector(".video-footage-details");
var imageCount = 0;


// Function to change text color to red
function startWebcam() {
    navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
        var video = document.getElementById("video");
        video.srcObject = stream;
        video.play();
    })
    .catch(function (err) {
        console.error("Error accessing camera: ", err);
    });
}
document.getElementById("video").addEventListener("play", function () {
  var video = this;
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  setInterval(function () {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Check image quality
    var blurScore = calculateBlurScore(context, canvas.width, canvas.height);
    if (blurScore < 50) {
      // Adjust value as needed
      console.log("Camera is blurry");
      FrameIsBlurryChangeDetails();
      return;
    }

    var brightness = calculateBrightness(context, canvas.width, canvas.height);
    if (brightness > 170) {
      // Adjust value as needed
      FrameHasHighLightingChangeDetails();
      console.log("Camera has high lighting in the background");
      return;
    }
    FrameIsGoodChangeDetails();
    console.log("Camera quality is acceptable");
    captureImage(canvas.toDataURL('image/jpeg'));
  }, 1000);
});

function calculateBlurScore(context, width, height) {
  var imageData = context.getImageData(0, 0, width, height);
  var pixels = imageData.data;
  var sum = 0;

  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    sum += (r + g + b) / 3;
  }

  var avg = sum / (width * height);
  var variance = 0;

  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    variance += Math.pow((r + g + b) / 3 - avg, 2);
  }

  return Math.sqrt(variance / (width * height));
}

function calculateBrightness(context, width, height) {
  var imageData = context.getImageData(0, 0, width, height);
  var pixels = imageData.data;
  var sum = 0;

  for (var i = 0; i < pixels.length; i += 4) {
    var r = pixels[i];
    var g = pixels[i + 1];
    var b = pixels[i + 2];
    sum += (r + g + b) / 3;
  }

  return sum / (width * height);
}

function FrameIsBlurryChangeDetails() {
  //vid blurry
  videoFootageDetails.style.color = "red";
  videoFootageDetails.textContent = "Camera is blurry";
}

function FrameHasHighLightingChangeDetails() {
  //vid with high lighting
  videoFootageDetails.style.color = "yellow";
  videoFootageDetails.textContent =
    "Camera has high lighting in the background";
}

function FrameIsGoodChangeDetails() {
  // vid good
  videoFootageDetails.style.color = "green";
  videoFootageDetails.textContent = "Camera quality is acceptable";
}
startWebcam();




function captureImage(imageDataUrl) {
    // Convert base64 image to blob
    fetch(imageDataUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create form data
        const formData = new FormData();
        formData.append('image', blob, 'image.jpg');
  
        // Send image data to server
        fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData
        })
        .then(response => response.text())
        .then(data => {
          console.log(data);
          // Increment image count
          imageCount++;
  
          // Check if total images reached 10
          if (imageCount === 10) {
            console.log("Total 10 images captured. Further processing can be done.");
            // Call your function for further processing
            // Example: furtherProcessingFunction();
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }