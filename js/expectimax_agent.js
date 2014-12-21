function ExpectimaxAgent(n, actions, game) {
  this.n = n;
  this.actions = actions;
  this.game = game;
}

ExpectimaxAgent.prototype.getAction = function(grid) {
  function expectimax(adversary, grid, depth, score, actions, game) {
    if (depth === 0) {
      // At the max depth
      return { score : score, action : null};
    }

    var bestScore = 0;
    var bestAction = -1;
    if (adversary) {
      var available = grid.availableCells();
      for (var cell in available) {
        for (var val = 2; val <= 4; val += 2) {
          // Clone grid
          var localGrid = new Grid(grid.size, grid.cells);

          // Place tile
          localGrid.insertTile(new Tile(cell, val));

          // simulate!
          var localScore = expectimax(false, localGrid, depth-1, score);

          // Val propability
          var p = val === 2 ? 0.9 : 0.1;

          bestScore += (localScore / available.length) * p;
        }
      }
    } else {
      for (var action in actions) {
        var nextState = game.simulateMove(action, score, grid);
        var nextScore = expectimax(true, nextState.grid, depth,
                                   nextState.score).score;
        if (nextScore >= bestScore) {
          bestScore = nextScore;
          bestAction = action;
        }
      }
    }
    console.log(bestScore);
    console.log(bestAction);
    return { score : bestScore, action : bestAction };
  }

  return expectimax(false, grid, this.n, 0, this.actions, this.game);

};
