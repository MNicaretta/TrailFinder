import Scene from './scene';
import type { Store } from 'pinia';

import { useGameStore } from '@/stores/game';
import { GameState } from '@/consts/game_state';

import { TilesetConst } from '../consts/tileset';

export default class GameScene extends Scene {
  private start?: Phaser.Tilemaps.Tile;
  private end?: Phaser.Tilemaps.Tile;

  private grid?: Phaser.GameObjects.Grid;

  private player?: Phaser.GameObjects.Sprite;
  private gameStore = useGameStore();

  constructor() {
    super('Game');
  }

  create() {
    this.gameSize = this.sys.game.scale.gameSize;

    this.cameras.main.setBackgroundColor(0x5d988d);

    this.loadTilemap('phase_1');

    const config = {
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player_1', {
        start: TilesetConst.WALK_START,
        end: TilesetConst.WALK_END,
      }),
      frameRate: 5,
      repeat: -1,
    };

    this.anims.create(config);

    if (this.start) {
      this.player = this.add.sprite(
        TilesetConst.SIZE * this.start.x + 16,
        TilesetConst.SIZE * this.start.y,
        'player_1'
      );
    }

    this.grid = this.add.grid(
      this.gameSize.width / 2,
      this.gameSize.height / 2,
      this.gameSize.width,
      this.gameSize.height,
      TilesetConst.SIZE,
      TilesetConst.SIZE,
      0,
      0,
      0x3c3c3c,
      0x1f
    );
  }

  update(_: number, delta: number) {
    if (this.gameStore.state === GameState.BUILDING) {
      this.reset();
    } else if (this.gameStore.state === GameState.PLAYING) {
      this.play(delta);
    }
  }

  private play(delta: number) {
    if (this.grid) {
      this.grid.visible = false;
    }

    const currentMove = this.gameStore.nextMove;

    if (this.player && currentMove) {
      if (!currentMove.start_x && !currentMove.start_y) {
        currentMove.start_x = this.player.x;
        currentMove.start_y = this.player.y;
        currentMove.end_x = this.player.x + TilesetConst.SIZE * currentMove.x;
        currentMove.end_y = this.player.y + TilesetConst.SIZE * currentMove.y;

        // validar o movimento

        this.player.anims.play(this.player.x ? 'walk' : 'climb');
      }

      const diff_x =
        (this.player.x - (currentMove.end_x ? currentMove.end_x : 0)) *
        currentMove.x;
      const diff_y =
        (this.player.y - (currentMove.end_y ? currentMove.end_y : 0)) *
        currentMove.y;

      if (diff_x > 0 || diff_y > 0) {
        this.player.anims.stop();
        this.gameStore.shiftMove();
      }
    } else {
      // esta no fim
    }

    if (this.player && this.player.anims.isPlaying) {
      this.player.x += (currentMove.x * delta) / 10;
      this.player.y += (currentMove.y * delta) / 10;
    }
  }

  private reset() {
    if (this.player) {
      this.player.anims.stop();

      this.player.x = TilesetConst.SIZE * (this.start?.x ?? 0) + 16;
      this.player.y = TilesetConst.SIZE * (this.start?.y ?? 0);
    }

    if (this.grid) {
      this.grid.visible = true;
    }
  }

  private loadTilemap(key: string) {
    const tilemap = this.add.tilemap(
      key,
      TilesetConst.SIZE,
      TilesetConst.SIZE,
      10,
      10
    );
    const tileset = tilemap.addTilesetImage('sheet');

    tilemap.layers.forEach((layer) => {
      tilemap.createLayer(layer.name, tileset);
    });

    this.start = tilemap.findByIndex(TilesetConst.START);
    this.end = tilemap.findByIndex(TilesetConst.END);

    this.gameStore.build();
  }
}
