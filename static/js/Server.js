const button1 = document.querySelector(".button1");
const button2 = document.querySelector(".button2");
const layer = document.querySelector(".layer");
const layer1 = document.querySelector(".layer1");
const nameInfoDiv = document.querySelector(".name_info");
const TempFaceNamesArray = [];
const RealTimeFaceNames = [];


//add your name here (i know i should make this automatic but that would either need node or gotta use another python script with flask to get the details so pardon me for now)

var labels = ["Chaitanya Saradhi Eerla","Rishi Gupta","Sayantan Roy","Krish Mehta","Aadtiya Jha","Saksham Lamba"];


//-------------------------------------------------------------------------
Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("../../models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../../models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../../models"),
  faceapi.nets.faceExpressionNet.loadFromUri("../../models"),
]).then(callStartFunctioning); //after loading everything then load the camera


function CreateAiDatafromStoredImages() {
  //as the name suggests imports images from the "images" folder then turns them into ai data for further processing




  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(
          `../../data/Section_Name/dataset images/${label}/image${i}.jpg`
        );
        const detections = await faceapi // converts the images into ai data
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
          
      return new faceapi.LabeledFaceDescriptors(label, descriptions); //returns the ai data along with the name of the person (which is the name of the folder)
    })
  );
}



function GetCurrentUserFace(){
  return Promise.all(
    [1].map(async () => { // Using [1] just for a single iteration
      const descriptions = [];
      let detections = null; // Initialize detections outside the loop
      for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(
          `../../data/Section_Name/current_user/image${i}.jpg`
        );
        detections = await faceapi // converts the images into ai data
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      console.log("images recived and started processing! ")
      return detections; //returns the ai data along with the name of the person (which is the name of the folder)
    })
  );
}


async function StartFunctioning() {
  let displaySize = { width: 640, height: 480 };
  // console.log("everyting is loaded!")
  const labeledFaceDescriptors = await CreateAiDatafromStoredImages();

  const faceMatcherData1 = new faceapi.FaceMatcher(labeledFaceDescriptors);
  const detections=await GetCurrentUserFace();
  const resizedDetections = await faceapi.resizeResults(
    detections,
    displaySize
    );

  const FinalResults = resizedDetections.map((d) => {//vid
    return faceMatcherData1.findBestMatch(d.descriptor);//from images
  });
  // console.log("ITS THE FINAL RESULTS!")
  // console.log(FinalResults)


  FinalResults.forEach((result, i) => {
    if (
      result.label !== "unknown" &&
      1 - result.distance >= 0.4 &&
      !TempFaceNamesArray.includes(result.label)
    ) {
      // Append only the face names (labels) to the array
      TempFaceNamesArray.push(result.label);
      // console.log(TempFaceNamesArray)
    }
  });
  FinalResults.forEach((result) => {
    if (result) {
      // Check if descriptor exists
      result.device = "mobile";
      // or 'PC' based on your condition
    } // or 'PC' based on your condition
  });
  console.log("Identified Users : ")
  console.log(TempFaceNamesArray)
  updateArrayItems()

}


//-------------------------------------------
// const TempFaceNamesArray = []; array2
// var labels = ["Chaitanya_Saradhi_Eerla","e"]; array1
// Assuming labels and TempFaceNamesArray are defined somewhere

const array1List = document.getElementById('array1-list');

// Populate array1 items in the HTML
labels.forEach(item => {
  const li = document.createElement('li');
  li.classList.add('array-item', 'red');
  li.textContent = item;
  const button = document.createElement('button');
  button.classList.add('attendance-button'); 
  button.textContent = 'Give Attendence';
  button.addEventListener('click', () => {
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
  const arrayItems = document.querySelectorAll('.array-item');
  arrayItems.forEach(item => {
    const itemText = item.firstChild.textContent.trim();
    if (TempFaceNamesArray.includes(itemText)) {
      item.classList.remove('red');
      item.classList.add('green');
      // Remove the button if the color is green
      const button = item.querySelector('button');
      if (button) {
        item.removeChild(button);
      }
    } else {
      item.classList.remove('green');
      item.classList.add('red');
      // Add the button if the color is red and there is no button
      if (!item.querySelector('button')) {
        const button = document.createElement('button');
        button.textContent = 'Give Attendance';
        button.addEventListener('click', () => {
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

async function callStartFunctioning() {
  setInterval(async () => {
    await StartFunctioning();
  }, 5000); // 2000 milliseconds = 2 seconds
}
//-------------------------------------
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