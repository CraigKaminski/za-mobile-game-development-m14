import { Game } from '../states/Game';

interface ITerrain {
  asset: string;
  blocked?: boolean;
}

export class Board extends Phaser.Group {
  private cols: number;
  private grid: number[][];
  private rows: number;
  private state: Game;
  private readonly terrains: ITerrain[] = [
    { asset: 'grass' },
    { asset: 'water', blocked: true },
    { asset: 'rocks' },
    { asset: 'grasstrees' },
    { asset: 'grasstrees2' },
  ];

  constructor(state: Game, grid: number[][]) {
    super(state.game);

    this.state = state;
    this.grid = grid;
    this.rows = grid.length;
    this.cols = grid[0].length;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let x;
        if (row % 2 === 0) {
          x = this.state.MARGIN_X + col * this.state.TILE_W;
        } else {
          x = this.state.MARGIN_X + col * this.state.TILE_W + this.state.TILE_W / 2;
        }

        const y = this.state.MARGIN_Y + row * this.state.TILE_H * 3 / 4;

        const tile = new Phaser.Sprite(this.game, x, y, this.terrains[this.grid[row][col]].asset);

        tile.data.row = row;
        tile.data.col = col;
        tile.data.terrainAsset = this.terrains[this.grid[row][col]].asset;
        tile.data.blocked = this.terrains[this.grid[row][col]].blocked;

        tile.inputEnabled = true;
        tile.input.pixelPerfectClick = true;
        tile.events.onInputDown.add((sprite: Phaser.Sprite) => {
          const adj = this.getAdjacent(sprite, true);
          adj.forEach((adjSprite) => adjSprite.alpha = 0.3);
        }, this);

        this.add(tile);
      }
    }
  }

  public getXYFromRowCol(row: number, col: number) {
    const pos = {
      x: 0,
      y: 0,
    };

    if (row % 2 === 0) {
      pos.x = this.state.MARGIN_X + col * this.state.TILE_W + this.state.TILE_W / 2;
    } else {
      pos.x = this.state.MARGIN_X + col * this.state.TILE_W + this.state.TILE_W / 2 + this.state.TILE_W / 2;
    }

    pos.y = this.state.MARGIN_Y + row * this.state.TILE_H * 3 / 4 + this.state.TILE_H / 2;

    return pos;
  }

  private getAdjacent(tile: Phaser.Sprite, rejectBlocked: boolean = false) {
    const adjacentTiles: Phaser.Sprite[] = [];
    const row: number = tile.data.row;
    const col: number = tile.data.col;

    let relativePositions: Array<{ r: number, c: number }> = [];

    if (row % 2 === 0) {
      relativePositions = [
        { r: -1, c: 0 },
        { r: -1, c: -1 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
        { r: 1, c: 0 },
        { r: 1, c: -1 },
      ];
    } else {
      relativePositions = [
        { r: -1, c: 0 },
        { r: -1, c: 1 },
        { r: 0, c: -1 },
        { r: 0, c: 1 },
        { r: 1, c: 0 },
        { r: 1, c: 1 },
      ];
    }

    relativePositions.forEach((pos) => {
      if (
        (row + pos.r >= 0) && (row + pos.r < this.rows)
        && (col + pos.c >= 0) && (col + pos.c < this.cols)
      ) {
        const adjTile = this.getFromRowCol(row + pos.r, col + pos.c);

        if (!rejectBlocked || !adjTile.data.blocked) {
          adjacentTiles.push(adjTile);
        }
      }
    }, this);

    return adjacentTiles;
  }

  private getFromRowCol(row: number, col: number) {
    let foundTile: Phaser.Sprite = this.getFirstExists(true);

    this.forEach((tile: Phaser.Sprite) => {
      if (tile.data.row === row && tile.data.col === col) {
        foundTile = tile;
      }
    }, this);

    return foundTile;
  }
}
