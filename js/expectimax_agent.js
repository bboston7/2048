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
      for (var i = 0; i < available.length; ++i) {
        for (var val = 2; val <= 4; val += 2) {
          // Clone grid
          var localGrid = new Grid(grid.size, grid.cells);

          // Place tile
          localGrid.insertTile(new Tile(available[i], val));

          // simulate!
          var localScore = expectimax(false, localGrid, depth-1, score,
                                      actions, game).score;

          // Val propability
          var p = val === 2 ? 0.9 : 0.1;

          bestScore += (localScore / available.length) * p;
        }
      }
    } else {
      //for (var action in actions) {
      for (var action = 0; action < 4; ++action) {
        var nextState = game.simulateMove(action, 0, grid);

        // No points for an illegal move
        if (nextState.grid.equals(grid)) {
          console.log("illegal move");
          continue;
        }

        var nextScore = expectimax(true, nextState.grid, depth,
                                   nextState.score, actions, game).score;

        // TODO: Check for losing states!

        if (nextScore  >= bestScore) {
          bestScore = nextScore;
          bestAction = action;
        }
      }
    }
    return { score : bestScore + score, action : bestAction };
  }

  var res = expectimax(false, grid, this.n, 0, this.actions, this.game);
  console.log(res);
  return res;

};
