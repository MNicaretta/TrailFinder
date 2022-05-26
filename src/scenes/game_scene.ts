import Scene from './scene';

import { useGameStore } from '@/stores/game';

import { Move, MoveState } from '@/models/move';

import { GameResult } from '@/consts/game';
import { TilesetConst } from '@/consts/tileset';

export default class GameScene extends Scene {
  private tilemap?: Phaser.Tilemaps.Tilemap;

  private start?: Phaser.Tilemaps.Tile;
  private end?: Phaser.Tilemaps.Tile;

  private grid?: Phaser.GameObjects.Grid;
  private text?: Phaser.GameObjects.Text;

  private player?: Phaser.GameObjects.Sprite;
  private gameStore = useGameStore();

  private summaryGrid?: Phaser.Tilemaps.Tile[];

  constructor() {
    super('Game');
  }

  create() {
    this.gameSize = this.sys.game.scale.gameSize;

    this.cameras.main.setBackgroundColor(0x5d988d);

    this.loadTilemap();

    const walkConfig = {
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player_1', {
        start: TilesetConst.WALK_START,
        end: TilesetConst.WALK_END,
      }),
      frameRate: 5,
      repeat: -1,
    };

    const climbConfig = {
      key: 'climb',
      frames: this.anims.generateFrameNumbers('player_1', {
        start: TilesetConst.CLIMB_START,
        end: TilesetConst.CLIMB_END,
      }),
      frameRate: 5,
      repeat: -1,
    };

    this.anims.create(walkConfig);
    this.anims.create(climbConfig);

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

    this.text = this.add.text(
      this.gameSize.width / 2,
      this.gameSize.height / 4,
      'SUCCESS',
      {
        fontFamily: 'Minecraft',
        fontSize: '40px',
      }
    );
    this.text.setOrigin(0.5);
    this.text.visible = false;
  }

  update(_: number, delta: number) {
    if (this.gameStore.isBuilding) {
      this.reset();
    } else if (this.gameStore.isPlaying) {
      this.play(delta);
    }
  }

  private play(delta: number) {
    if (this.grid) {
      this.grid.visible = false;
    }

    const currentMove = this.gameStore.currentMove as Move;

    if (this.player && currentMove) {
      if (!currentMove.start_x && !currentMove.start_y) {
        this.prepareMove(currentMove);

        if (!this.validateMove(currentMove)) {
          this.player.anims.stop();
          this.player.setFrame(0);
          this.gameStore.classifyMove(MoveState.INVALID);

          this.endLevel();
          return;
        }

        this.player.anims.play(currentMove.x ? 'walk' : 'climb');
        this.player.flipX = currentMove.x === -1;
      }

      const diff_x =
        (this.player.x - (currentMove.end_x ? currentMove.end_x : 0)) *
        currentMove.x;
      const diff_y =
        (this.player.y - (currentMove.end_y ? currentMove.end_y : 0)) *
        currentMove.y;

      if (diff_x > 0 || diff_y > 0) {
        this.player.anims.stop();
        this.player.setFrame(0);
        this.gameStore.classifyMove(MoveState.FINISHED);
      }
    } else {
      this.endLevel();
    }

    if (this.player && this.player.anims.isPlaying) {
      this.player.x += (currentMove.x * delta) / 16;
      this.player.y += (currentMove.y * delta) / 16;
    }
  }

  private endLevel() {
    let isAtEnd = false;

    if (this.player && this.end) {
      isAtEnd =
        Math.floor(this.player.x / TilesetConst.SIZE) === this.end.x &&
        Math.floor(this.player.y / TilesetConst.SIZE) === this.end.y;
    }

    if (this.text) {
      this.text.visible = true;
      this.text.text = isAtEnd ? 'SUCCESS' : 'FAILED';
    }

    this.gameStore.finishPhase(
      isAtEnd ? GameResult.SUCCESS : GameResult.FAILED
    );
  }

  private validateMove(currentMove: Move) {
    let validMove = false;

    if (this.player) {
      if (currentMove.x) {
        const x = Math.floor(this.player.x / TilesetConst.SIZE) + currentMove.x;
        const y = Math.floor(this.player.y / TilesetConst.SIZE) + 1;

        validMove = !!this.summaryGrid?.find(
          (tile) =>
            tile.x === x &&
            tile.y === y &&
            TilesetConst.GROUND.includes(tile.index)
        );
      } else {
        const x = Math.floor(this.player.x / TilesetConst.SIZE);
        const y =
          Math.floor(this.player.y / TilesetConst.SIZE) +
          Math.max(currentMove.y, 0);

        validMove = !!this.summaryGrid?.find(
          (tile) =>
            tile.x === x &&
            tile.y === y &&
            TilesetConst.LADDER.includes(tile.index)
        );
      }
    }
    return validMove;
  }

  private prepareMove(currentMove: Move) {
    if (this.player) {
      currentMove.start_x = this.player.x;
      currentMove.start_y = this.player.y;
      currentMove.end_x = this.player.x + TilesetConst.SIZE * currentMove.x;
      currentMove.end_y = this.player.y + TilesetConst.SIZE * currentMove.y;

      currentMove.state = MoveState.RUNNING;
    }
  }

  private reset() {
    if (!this.gameStore.isLoaded) {
      this.loadTilemap();
    }

    if (this.player) {
      this.player.anims.stop();
      this.player.setFrame(0);

      this.player.x = TilesetConst.SIZE * (this.start?.x ?? 0) + 16;
      this.player.y = TilesetConst.SIZE * (this.start?.y ?? 0);
    }

    if (this.text) this.text.visible = false;
    if (this.grid) this.grid.visible = true;
  }

  private loadTilemap() {
    if (this.tilemap) {
      this.tilemap.destroy();
    }
    this.summaryGrid = [];

    this.tilemap = this.add.tilemap(
      this.gameStore.currentPhase,
      TilesetConst.SIZE,
      TilesetConst.SIZE,
      10,
      10
    );
    const tileset = this.tilemap.addTilesetImage('sheet');

    for (const layer of this.tilemap.layers) {
      this.tilemap.createLayer(layer.name, tileset).depth = -1;

      for (const row of layer.data)
        for (const tile of row)
          if (
            TilesetConst.GROUND.includes(tile.index) ||
            TilesetConst.LADDER.includes(tile.index)
          )
            this.summaryGrid?.push(tile);
    }

    this.start = this.tilemap.findByIndex(TilesetConst.START);
    this.end = this.tilemap.findByIndex(TilesetConst.END);

    this.gameStore.load();
  }
}
