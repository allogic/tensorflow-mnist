import {layers, sequential, Sequential, Tensor, nextFrame, model} from '@tensorflow/tfjs';

import {WIDTH, HEIGHT} from './data';

export const cnn = (): Sequential => {
  const model: Sequential = sequential();

  model.add(layers.conv2d({
    inputShape: [WIDTH, HEIGHT, 1],
    kernelSize: 3,
    filters: 16,
    activation: 'relu',
  }));

  model.add(layers.maxPool2d({
    poolSize: 2,
    strides: 2
  }));

  model.add(layers.conv2d({
    kernelSize: 3,
    filters: 32,
    activation: 'relu'
  }));

  model.add(layers.maxPool2d({
    poolSize: 2,
    strides: 2
  }));

  model.add(layers.conv2d({
    kernelSize: 3,
    filters: 32,
    activation: 'relu'
  }));

  model.add(layers.flatten());

  model.add(layers.dense({
    units: 64,
    activation: 'relu'
  }));

  model.add(layers.dense({
    units: 10,
    activation: 'softmax'
  }));

  return model;
};

export const train = async (model: Sequential, images: Tensor, labels: Tensor): Promise<void> => {
  model.compile({
    optimizer: 'rmsprop',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  await model.fit(images, labels, {
    batchSize: 6000,
    validationSplit: 0.15,
    epochs: 1000,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        console.log(`Batch ${batch} ${logs}`);

        await nextFrame();
      },
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch} ${logs}`);

        await nextFrame();
      }
    }
  });
};
