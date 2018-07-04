function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  /** 
   * Euclidean distance, pythagoras theorem
   */
  var d = dist(a.i, a.j, b.i, b.j);

  /** 
   * Manhattan distance / taxicab distance : dist diff in x + diff in y
   * Not great if you use a diagonal
   * var d = abs(a.i-b.i) + abs(a.j - b.j);
   */
  return d;
}


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

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.wall = false;

  // make walls
  if (random(1) < wallprob) {
    this.wall = true;
  }

  this.show = function (color) {
    fill(color);
    if( this.wall){
      fill(0);
    }
    rect(this.i * w, this.j * h, w - 1, h - 1);
  }

  this.addNeighbors = function (grid) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    /** add diagonals */
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i > 0 && j < rows -1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }    
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }        
  }
}

function setup() {
  createCanvas(600, 600);
  console.log('A* ');

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
      console.log('Done.');
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
        if(newPath){ 
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }
    }

  } else {
    console.log('No Path possible');
    noLoop();
    return;
  }

  background(0);

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