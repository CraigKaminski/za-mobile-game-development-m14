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

        this.add(tile);
      }
    }
  }
}
