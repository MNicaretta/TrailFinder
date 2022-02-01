import Phaser from 'phaser';

export default class TitleScene extends Phaser.Scene {
  private gameSize: Phaser.Structs.Size;

  private title: Phaser.GameObjects.Image;
  private play: Phaser.GameObjects.Image;

  constructor() {
    super('Title');
  }

  create() {
    this.gameSize = this.sys.game.scale.gameSize;

    const { width, height } = this.gameSize;

    this.cameras.main.setBackgroundColor(0x5d988d);

    const tilemap = this.add.tilemap('title_background', 32, 32, 10, 10);
    const tileset = tilemap.addTilesetImage('sheet');

    tilemap.createLayer('agua', tileset);
    tilemap.createLayer('fundo', tileset);
    tilemap.createLayer('montanha_1', tileset);
    tilemap.createLayer('montanha_2', tileset);
    tilemap.createLayer('escada', tileset);
    tilemap.createLayer('chao', tileset);

    this.add.sprite(32 * 3, 32 * 6, 'player_1');

    this.title = this.add.image(width / 2, height * 0.15, 'title');
    this.scaleObject(this.title, width * 0.8, height * 0.3, 50, 1);

    this.play = this.add.image(width / 2, height / 2, 'play');
    this.scaleObject(this.play, width * 0.3, height / 2, 50, 1);
  }

  scaleObject(object: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, availableWidth: number, availableHeight: number, padding: number, scaleMultiplier: number) {
    const objectSize = this.getObjectSize(object);
    const scale = this.calcObjectScale(objectSize.width, objectSize.height, availableWidth, availableHeight, padding);

    object.scale = scale * scaleMultiplier;
  }

  getObjectSize(object: Phaser.GameObjects.GameObject & Partial<Phaser.GameObjects.Components.Size>) {
    if (object.width && object.height) {
      return {
        width: object.width,
        height: object.height
      }
    } else {
      return {
        width: parseFloat(object.getData('width') ?? 0),
        height: parseFloat(object.getData('height') ?? 0)
      }
    }
  }

  calcObjectScale(width: number, height: number, availableWidth: number, availableHeight: number, padding: number) {
    let ratio = 1;
    const currentDevicePixelRatio = window.devicePixelRatio;
    // Sprite needs to fit in either width or height
    const widthRatio = (width * currentDevicePixelRatio + 2 * padding) / availableWidth;
    const heightRatio = (height * currentDevicePixelRatio + 2 * padding) / availableHeight;

    if (widthRatio > 1 || heightRatio > 1) {
      ratio = 1 / Math.max(widthRatio, heightRatio);
    }

    return ratio * currentDevicePixelRatio;	
  }
}