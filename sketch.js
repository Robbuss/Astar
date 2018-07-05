var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];
var wallprob = 0.4; // probability of walls in the image

/** Dom init */
var canvas;
var consoleWindow;
var consoleOutput;
var reset;

function setup() {

  var resetButton = select('.reset');
  resetButton.mousePressed(reset);

  reset();
}

function reset() {
  openSet = [];
  closedSet = [];
  path = [];

  consoleOutput = [];

  var canvas = createCanvas(600, 600);
  canvas.parent('#canvas');

  w = width / cols;
  h = height / rows;

  // making a 2d array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < cols; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  initialize();

}
function initialize() {
  consoleOutput.push('Starting A* Search algo<br> Searching...');
  drawOutput(consoleOutput);
  /** 
   * Define start and end spot
   * Make sure they aren't a wall
   * 
   */
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openSet.push(start);
  loop();
}

function draw() {

  /** 
   * The loop in which we check for each step
   */
  if (openSet.length > 0) {
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    /** 
     * Maze solved
     */
    if (current === end) {
      noLoop();
      end.show(color(200, 60, 255));

      consoleOutput.push('<br>Done.');
      consoleOutput.push('<br>Optimal path found in ' + path.length + ' steps');
      consoleOutput.push('<br>Press reset to run again.');
      drawOutput(consoleOutput);

      return;
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + 1;

        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }

  } else {
    consoleOutput.push('<br>No Path possible.');
    drawOutput(consoleOutput);

    noLoop();
    return;
  }



  // function to show the spots
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }

  // a visited spot from closedSet
  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }

  // an open Spot
  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }

  // evaluate the current path
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  // the current path 
  for (var i = 0; i < path.length; i++) {
    path[i].show(color(0, 0, 255));
  }

}