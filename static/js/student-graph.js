window.StudentGraph = (function(graph) {
  'use strict';

  // eslint-disable-next-line no-undef
  return graph(window, document, sigma);

})(function(window, document, Sigma) {
  'use strict';

  const colors = [
    '#617db4',
    '#668f3c',
    '#c6583e',
    '#b956af'
  ];

  class StudentGraph {

    constructor(container, students) {
      this.maxEdges = 100;
      this.sigma = new Sigma({
        renderer: {
          container: document.getElementById(container),
          type: 'canvas'
        },
        settings: {
          minNodeSize: 8,
          maxNodeSize: 16,
          defaultLabelColor: '#fff',
        }
      });

      Promise.all(this._loadStudents(students))
        .then(() => this._removeOverlap())
        .then(() => this._addEdges());
    }

    _loadStudents(students) {
      return students.map((student, i) => {
        return Sigma.canvas.nodes.image.cache(student.image)
          .then(() => {
            this.sigma.graph.addNode({
              id: 'n' + i,
              label: student.name,
              type: 'image',
              url: student.image,
              x: Math.random(),
              y: Math.random(),
              size: Math.random(),
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          })
          .catch(() => {
            this.sigma.graph.addNode({
              id: 'n' + i,
              label: student.name,
              x: Math.random(),
              y: Math.random(),
              size: Math.random(),
              color: colors[Math.floor(Math.random() * colors.length)]
            });
          })
          .then(() => this.sigma.refresh());
      });

    }

    _removeOverlap() {
      // Configure the noverlap layout:
      this.sigma.configNoverlap({
        nodeMargin: 100,
        scaleNodes: 1.05,
        gridSize: 10,
        easing: 'quadraticInOut', // animation transition function
        duration: 10000   // animation duration. Long here for the purposes of this example only
      });
      this.sigma.startNoverlap();
    }

    _addEdges() {
      let count = 0;
      const interval = window.setInterval(() => {

        if (count === this.maxEdges) {
          return window.clearInterval(interval);
        }

        if (Math.floor(Math.random() * 10) < 4) {
          return; // add some randomness to the interval
        }

        this.sigma.graph.addEdge({
          id: 'e' + count++,
          source: 'n' + (Math.random() * this.sigma.graph.nodes().length | 0),
          target: 'n' + (Math.random() * this.sigma.graph.nodes().length | 0),
          size: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)]
        });

        this.sigma.refresh();

      }, 150);
    }

  }

  return StudentGraph;

});
