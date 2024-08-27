
export async function CreateAiDatafromStoredImages(labels) {
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(
          `../../../data/Section_Name/dataset images/${label}/image${i}.jpg`
        );
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}
