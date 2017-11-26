(function(f) {

  'use strict';
  return f(document, sigma); // eslint-disable-line no-undef

})(function(document, Sigma) {

  'use strict';

  const cache = {};
  const promises = {};

  Sigma.utils.pkg('sigma.canvas.nodes');
  Sigma.canvas.nodes.image = function(node, context, settings) {

    const args = arguments;
    const prefix = settings('prefix') || '';
    const size = node[prefix + 'size'];
    const url = node.url;

    // we don't have image, render normally for now
    if (!cache[url]) {
      Sigma.canvas.nodes.image.cache(url);
      Sigma.canvas.nodes.def.apply(Sigma.canvas.nodes, args);
      return;
    }

    context.save();

    // Draw the clipping disc:
    context.beginPath();
    context.arc(
      node[prefix + 'x'],
      node[prefix + 'y'],
      size,
      0,
      Math.PI * 2,
      true
    );
    context.closePath();
    context.clip();

    // Draw the image
    context.drawImage(
      cache[url],
      node[prefix + 'x'] - size,
      node[prefix + 'y'] - size,
      2 * size,
      2 * size
    );

    // Quit the "clipping mode":
    context.restore();

    // Draw the border:
    context.beginPath();
    context.arc(
      node[prefix + 'x'],
      node[prefix + 'y'],
      size,
      0,
      Math.PI * 2,
      true
    );
    context.lineWidth = size / 5;
    context.strokeStyle = node.color || settings('defaultNodeColor');
    context.stroke();
  };

  //  makes it possible to preload images before the initial rendering:
  Sigma.canvas.nodes.image.cache = function(url) {

    if (cache[url]) {
      return Promise.resolve();
    }

    if (promises[url]) {
      return promises[url].promise;
    }

    const container = {};
    container.promise = new Promise(function(resolve, reject) {
      container.resolve = resolve;
      container.reject = reject;
    });
    promises[url] = container;

    const img = document.createElement('img');

    img.onload = function() {
      cache[url] = img;
      promises[url].resolve(img);
      delete promises[url];
    };

    img.onerror = container.reject;
    img.src = url;

    return container.promise;

  };

});
