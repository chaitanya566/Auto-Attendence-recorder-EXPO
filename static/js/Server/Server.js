const button1 = document.querySelector(".button1");
const button2 = document.querySelector(".button2");
const layer = document.querySelector(".layer");
const layer1 = document.querySelector(".layer1");
const nameInfoDiv = document.querySelector(".name_info");
const TempFaceNamesArray = [];
const RealTimeFaceNames = [];

import { CreateAiDatafromStoredImages } from "./aiDataProcessing.js";
import { config } from "./config.js";

//-------------------------------------------------------------------------

console.log("loading models...");
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("../../../models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../../../models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../../../models"),
  faceapi.nets.faceExpressionNet.loadFromUri("../../../models"),
]).then(callStartFunctioning); //after loading everything then load the camera

function fetchAndProcessUserFaceData(device) {
  return Promise.all(
    [1].map(async () => {
      const descriptions = [];
      let detections = null; // Initialize detections outside the loop
      for (let i = 1; i <= 5; i++) {
        // only 5 images more than 7 exceeds data limit
        console.log(`Processing image${i}.jpg`);
        const img = await faceapi.fetchImage(
          `../../../data/Section_Name/${device}/image${i}.jpg`
        );
        detections = await faceapi // converts the images into ai data
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      console.log("images received and started processing! ");
      return detections; //returns the ai data along with the name of the person (which is the name of the folder)
    })
  );
}

async function analyzeFaceMatches(device) {
  let displaySize = { width: 640, height: 480 };
  const labeledFaceDescriptors = await CreateAiDatafromStoredImages(
    config.labels
  );
  const faceMatcherData1 = new faceapi.FaceMatcher(labeledFaceDescriptors);
  const detections = await fetchAndProcessUserFaceData(device);
  const resizedDetections = await faceapi.resizeResults(
    detections,
    displaySize
  );

  const FinalResults = resizedDetections.map((d) => {
    return faceMatcherData1.findBestMatch(d.descriptor);
  });

  FinalResults.forEach((result, i) => {
    if (
      result.label !== "unknown" &&
      1 - result.distance >= 0.4 &&
      !TempFaceNamesArray.includes(result.label)
    ) {
      TempFaceNamesArray.push(result.label);
    }
  });
  console.log("Identified Users : ");
  console.log(TempFaceNamesArray);
  updateArrayItems();
}

//-------------------------------------------

const array1List = document.getElementById("array1-list");

// Populate array1 items in the HTML
config.labels.forEach((item) => {
  const li = document.createElement("li");
  li.classList.add("array-item", "red");
  li.textContent = item;
  const button = document.createElement("button");
  button.classList.add("attendance-button");
  button.textContent = "Give Attendance";
  button.addEventListener("click", () => {
    if (!TempFaceNamesArray.includes(item)) {
      TempFaceNamesArray.push(item);
      updateArrayItems(); // Call the function to update colors after adding to array2
    }
  });
  li.appendChild(button);
  array1List.appendChild(li);
});

// Update the colors of array1 items based on array2
function updateArrayItems() {
  const arrayItems = document.querySelectorAll(".array-item");
  arrayItems.forEach((item) => {
    const itemText = item.firstChild.textContent.trim();
    if (TempFaceNamesArray.includes(itemText)) {
      item.classList.remove("red");
      item.classList.add("green");
      // Remove the button if the color is green
      const button = item.querySelector("button");
      if (button) {
        item.removeChild(button);
      }
    } else {
      item.classList.remove("green");
      item.classList.add("red");
      // Add the button if the color is red and there is no button
      if (!item.querySelector("button")) {
        const button = document.createElement("button");
        button.textContent = "Give Attendance";
        button.addEventListener("click", () => {
          if (!TempFaceNamesArray.includes(itemText)) {
            TempFaceNamesArray.push(itemText);
            updateArrayItems(); // Call the function to update colors after adding to array2
          }
        });
        item.appendChild(button);
      }
    }
  });
}

//-------------------------------------------

async function analyzeFaceMatchesForDevice(device) {
  // Implement the analysis logic for the specific device here
  // For example:
  console.log(`Analyzing face matches for ${device}`);
  await analyzeFaceMatches(device); // Pass the device parameter if needed
}

async function callStartFunctioning() {
  // Function to analyze all devices
  const analyzeAllDevices = async () => {
    for (const device of config.devices) {
      await analyzeFaceMatchesForDevice(device);
    }
  };

  // Start the interval to call analyzeAllDevices every 20 seconds
  setInterval(async () => {
    await analyzeAllDevices();
    console.log(config.devices);
  }, 20000); // 20 seconds
}

layer.addEventListener("click", () => {
  if (!button1.classList.contains("active")) {
    button1.classList.add("active");
    button2.classList.remove("active");
  }
});

layer1.addEventListener("click", () => {
  if (!button2.classList.contains("active")) {
    button2.classList.add("active");
    button1.classList.remove("active");
  }
});
