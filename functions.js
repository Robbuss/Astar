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