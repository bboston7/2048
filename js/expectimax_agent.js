function ExpectimaxAgent(n, actions, scoreFn) {
  this.n = n;
  this.actions = actions;
  this.scoreFn = scoreFn;
}

ExpectimaxAgent.getAction = function(grid) {
  function expectimax(adversary, grid, depth, score) {
    if (depth === 0) {
      // At the max depth
      return { score : score, action : null};
    }

    var bestScore = 0;
    var bestAction = -1;
    if (adversary) {
      var available = grid.availableCells();
      for (var cell : available) {
        for (var val = 2; val <= 4; val += 2) {
          // Clone grid
          var localGrid = new Grid(grid.size, grid);

          // Place tile
          localGrid.cells[cell.x][cell.y] = val;

          // simulate!
          var localScore = expectimax(false, localGrid, depth-1, score);

          bestScore += localScore / (available.length * 2);
        }
      }
    } else {
      for (var action : this.actions) {
        var nextState = this.scoreFn(action, score, grid);
        var nextScore = expectimax(true, nextState.grid, depth,
                                   nextState.score).score;
        if (nextScore >= bestScore) {
          bestScore = nextScore;
          bestAction = action;
        }
      }
    }
    return { score = bestScore, action = bestAction };
  }

  return expectimax(false, grid, this.n, 0);

};
