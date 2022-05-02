import Phaser from 'phaser';
import type { Store } from 'pinia';

import { useGameStore } from '@/stores/game';
import { GameState } from '@/consts/game_state';

import Scene from './scene';

export default class TitleScene extends Scene {
  private title?: Phaser.GameObjects.Image;
  private play?: Phaser.GameObjects.Image;

  private gameStore: Store<'game', { state: GameState }>;

  constructor() {
    super('Title');

    this.gameStore = useGameStore();
  }

  create() {
    this.gameSize = this.sys.game.scale.gameSize;

    const { width, height } = this.gameSize;

    this.cameras.main.setBackgroundColor(0x5d988d);

    const tilemap = this.add.tilemap('title_background', 32, 32, 10, 10);
    const tileset = tilemap.addTilesetImage('sheet');

    for (const layer of tilemap.layers) {
      tilemap.createLayer(layer.name, tileset);
    }

    this.add.sprite(32 * 3, 32 * 6, 'player_1');

    this.title = this.add.image(width / 2, height * 0.15, 'title');
    this.scaleObject(this.title, width * 0.8, height * 0.3, 50, 1);

    this.play = this.add
      .image(width / 2, height / 2, 'play')
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.playTheGame, this);
    this.scaleObject(this.play, width * 0.3, height / 2, 50, 1);
  }

  resize(gameSize: Phaser.Structs.Size) {
    this.gameSize = gameSize;

    const { width, height } = this.gameSize;

    if (this.play) {
      this.scaleObject(this.play, width * 0.3, height / 2, 50, 1);
      this.play.x = width / 2;
      this.play.y = height / 2;
    }

    if (this.title) {
      this.scaleObject(this.title, width * 0.8, height * 0.3, 50, 1);
      this.title.x = width / 2;
      this.title.y = height * 0.15;
    }
  }

  playTheGame() {
    this.scene.start('Game');
    this.gameStore.state = GameState.BUILDING;
  }
}
