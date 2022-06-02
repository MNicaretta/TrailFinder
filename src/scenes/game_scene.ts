import Scene from './scene';

import { useGameStore } from '@/stores/game';

import { Move, MoveState, MoveType } from '@/models/move';

import { GameResult } from '@/consts/game';
import { TilesetConst } from '@/consts/tileset';

export default class GameScene extends Scene {
  private tilemap?: Phaser.Tilemaps.Tilemap;

  private start?: Phaser.Tilemaps.Tile;
  private ends: {
    tile: Phaser.Tilemaps.Tile;
    sprite?: Phaser.GameObjects.Sprite;
    open?: boolean;
  }[] = [];

  private grid?: Phaser.GameObjects.Grid;
  private text?: Phaser.GameObjects.Text;
  private changePlayer?: Phaser.GameObjects.Sprite;

  private player?: Phaser.GameObjects.Sprite;
  private gameStore = useGameStore();

  private summaryGrid?: Phaser.Tilemaps.Tile[];

  constructor() {
    super('Game');
  }

  create() {
    this.gameSize = this.sys.game.scale.gameSize;

    this.cameras.main.setBackgroundColor(0x5d988d);
  }

  update(_: number, delta: number) {
    if (this.gameStore.isBuilding) {
      this.reset();
    } else if (this.gameStore.isPlaying) {
      this.play(delta);
    }
  }

  private play(delta: number) {
    if (this.grid && this.changePlayer) {
      this.grid.visible = false;
      this.changePlayer.visible = false;
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

        if (currentMove.type === MoveType.OPEN) {
          this.player.anims.stop();
          this.player.setFrame(0);

          const end = this.getCurrentEnd(currentMove);
          end?.sprite?.anims.play('open');
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              if (end) end.open = true;
              this.gameStore.classifyMove(MoveState.FINISHED);
            },
          });
        } else if (currentMove.type === MoveType.LOOP_START) {
          this.gameStore.startLoop();
        } else if (currentMove.type === MoveType.LOOP_END) {
          this.gameStore.endLoop();
        } else {
          this.player.anims.play(
            (currentMove.x ? 'walk--' : 'climb--') + this.gameStore.currentChar,
            true
          );
          this.player.flipX = currentMove.x === -1;
        }
      }

      if (
        currentMove.type !== MoveType.OPEN &&
        currentMove.type !== MoveType.LOOP_START &&
        currentMove.type !== MoveType.LOOP_END
      ) {
        const diff_x =
          (this.player.x - (currentMove.end_x ? currentMove.end_x : 0)) *
          currentMove.x;
        const diff_y =
          (this.player.y - (currentMove.end_y ? currentMove.end_y : 0)) *
          currentMove.y;

        if (diff_x > 0 || diff_y > 0) {
          this.player.x = currentMove.end_x;
          this.player.y = currentMove.end_y;
          this.gameStore.classifyMove(MoveState.FINISHED);
        } else {
          this.player.x += (currentMove.x * delta) / 16;
          this.player.y += (currentMove.y * delta) / 16;
        }
      }
    } else {
      this.endLevel();
    }
  }

  private endLevel() {
    this.player?.anims.stop();
    this.player?.setFrame(0);

    const success = this.ends.reduce(
      (result, end) => result && !!end.open,
      true
    );

    if (this.text) {
      this.text.visible = true;
      this.text.text = success ? 'SUCCESS' : 'FAILED';
    }

    this.gameStore.finishPhase(
      success ? GameResult.SUCCESS : GameResult.FAILED
    );
  }

  private validateMove(currentMove: Move): boolean {
    if (this.player) {
      if (currentMove.x) {
        const x = Math.floor(this.player.x / TilesetConst.SIZE) + currentMove.x;
        const y = Math.floor(this.player.y / TilesetConst.SIZE) + 1;

        return !!this.summaryGrid?.find(
          (tile) =>
            tile.x === x &&
            tile.y === y &&
            TilesetConst.GROUND.includes(tile.index)
        );
      } else if (currentMove.y) {
        const x = Math.floor(this.player.x / TilesetConst.SIZE);
        const y =
          Math.floor(this.player.y / TilesetConst.SIZE) +
          Math.max(currentMove.y, 0);

        return !!this.summaryGrid?.find(
          (tile) =>
            tile.x === x &&
            tile.y === y &&
            TilesetConst.LADDER.includes(tile.index)
        );
      } else if (currentMove.type === MoveType.OPEN) {
        return !!this.getCurrentEnd(currentMove);
      } else if (currentMove.type === MoveType.LOOP_START) {
        let index = 0;
        for (const move of this.gameStore.nextMoves) {
          if (move.type === MoveType.LOOP_START) {
            index++;
          } else if (move.type === MoveType.LOOP_END) {
            if (index === 0) {
              return true;
            } else {
              index--;
            }
          }
        }
      } else if (currentMove.type === MoveType.LOOP_END) {
        let index = 0;
        for (const move of this.gameStore.previousMoves.reverse()) {
          if (move.type === MoveType.LOOP_END) {
            index++;
          } else if (move.type === MoveType.LOOP_START) {
            if (index === 0) {
              return true;
            } else {
              index--;
            }
          }
        }
      }
    }

    return false;
  }

  private getCurrentEnd(currentMove: Move) {
    return this.ends.find(
      (end) =>
        Math.floor(currentMove.start_x / TilesetConst.SIZE) === end.tile.x &&
        Math.floor(currentMove.start_y / TilesetConst.SIZE) === end.tile.y
    );
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
      this.loadPlayer();
      this.loadGrid();
    }

    this.ends.forEach((end) => {
      end.sprite?.destroy();
      end.sprite = this.add
        .sprite(end.tile.pixelX, end.tile.pixelY, 'chest')
        .setOrigin(0);
    });

    if (this.player) {
      this.player.anims.stop();
      this.player.setFrame(0);

      this.player.x = TilesetConst.SIZE * (this.start?.x ?? 0) + 16;
      this.player.y = TilesetConst.SIZE * (this.start?.y ?? 0);
    }

    if (this.text) this.text.visible = false;
    if (this.grid) this.grid.visible = true;
    if (this.changePlayer) this.changePlayer.visible = true;
  }

  private loadGrid() {
    if (this.gameSize) {
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

      this.changePlayer = this.add
        .sprite(0, 0, this.gameStore.nextChar)
        .setOrigin(0)
        .setScale(0.5)
        .setInteractive({ useHandCursor: true })
        .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.changeChar, this)
        .setDepth(1);
    }
  }

  private changeChar() {
    this.gameStore.changeChar();
    this.changePlayer?.setTexture(this.gameStore.nextChar);
    this.player?.setTexture(this.gameStore.currentChar);
  }

  private loadPlayer() {
    if (this.start) {
      this.player = this.add.sprite(
        TilesetConst.SIZE * this.start.x + 16,
        TilesetConst.SIZE * this.start.y,
        this.gameStore.currentChar
      );
      this.player.depth = 1;
    }
  }

  private loadTilemap() {
    if (this.tilemap) {
      this.tilemap.destroy();
      this.player?.destroy();
      this.grid?.destroy();
      this.text?.destroy();
    }
    this.summaryGrid = [];

    this.ends.forEach((end) => end.sprite?.destroy());
    this.ends = [];

    console.log(this.gameStore.currentPhase);

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

    let tile = null;
    while (
      (tile = this.tilemap.findByIndex(TilesetConst.END, this.ends.length))
    )
      this.ends.push({ tile });

    this.gameStore.load();
  }
}
