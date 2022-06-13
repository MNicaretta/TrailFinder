import Phaser from 'phaser';

import Scene from './scene';

export default class TitleScene extends Scene {
  private title?: Phaser.GameObjects.Image;
  private play?: Phaser.GameObjects.Image;

  constructor() {
    super('Title');
  }

  create() {
    this.gameSize = this.sys.game.scale.gameSize;

    this.cameras.main.setBackgroundColor(0x5d988d);

    const tilemap = this.add.tilemap('title_background', 32, 32, 10, 10);
    this.game.scale.resize(tilemap.widthInPixels, tilemap.heightInPixels);
    const tileset = tilemap.addTilesetImage('sheet');

    for (const layer of tilemap.layers) {
      tilemap.createLayer(layer.name, tileset);
    }

    this.add.sprite(32 * 3, 32 * 6, this.gameStore.currentChar.name);

    const { width, height } = this.gameSize;

    this.title = this.add.image(width / 2, height * 0.15, 'title');
    this.scaleObject(this.title, width * 0.8, height * 0.3, 50, 1);

    this.play = this.add
      .image(width / 2, height / 2, 'play')
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.playTheGame, this);
    this.scaleObject(this.play, width * 0.3, height / 2, 50, 1);
  }

  playTheGame() {
    this.gameStore.build();
    this.scene.start('Game');
  }
}
