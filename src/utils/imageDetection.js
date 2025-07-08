// src/utils/imageDetection.js
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export const detectObjects = async (imageElement) => {
  const model = await cocoSsd.load();
  const predictions = await model.detect(imageElement);
  return predictions.map(pred => pred.class);
};
