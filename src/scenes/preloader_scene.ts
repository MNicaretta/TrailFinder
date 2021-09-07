import Phaser from 'phaser';
import Player0 from '../assets/images/player_0.png';
import Player1 from '../assets/images/player_1.png';
import Player2 from '../assets/images/player_2.png';

export default class PreloaderScene extends Phaser.Scene {
  private readyCount: number;

  private background: Phaser.GameObjects.Image;
  private logo: Phaser.GameObjects.Image;

  private progressBar: Phaser.GameObjects.Graphics;
  private progressBox: Phaser.GameObjects.Graphics;
  private percentText: Phaser.GameObjects.Text;

  private gameSize: Phaser.Structs.Size;

  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    this.gameSize = this.sys.game.scale.gameSize;

    const { width, height } = this.gameSize;

    this.background = this.add.image(0, 0, 'dev_background');
    this.background.setOrigin(0);
    this.background.displayWidth = Math.max(this.background.width, width);
    this.background.displayHeight = Math.max(this.background.height, height);

    this.logo = this.add.image(width / 2, (height * 2 / 3) / 2, 'dev_logo');
    this.scaleObject(this.logo, width, height * 2 / 3, 50, 1);

    this.progressBox = this.add.graphics();
    this.progressBox.setData('width', this.logo.displayWidth * 0.8);
    this.progressBox.setData('height', this.progressBox.getData('width') / 10);
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect((width - this.progressBox.getData('width')) / 2,
                              height * 2 / 3,
                              this.progressBox.getData('width'),
                              this.progressBox.getData('height'));

    this.progressBar = this.add.graphics();

    this.percentText = this.make.text({
      x: width / 2,
      y: height * 2 / 3 + this.progressBox.getData('height') / 2,
      text: '0%',
      style: {
        fontSize: `${this.progressBox.getData('height') / 3}px`,
        fontFamily: 'monospace',
        color: '#000000',
      },
    });
    this.percentText.setOrigin(0.5);

    this.load.on(Phaser.Loader.Events.PROGRESS, this.progress, this);

    this.load.on(Phaser.Loader.Events.COMPLETE, this.complete, this);

    this.load.spritesheet('player_0', Player0, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player_1', Player1, {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('player_2', Player2, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this);
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

  progress(value: number) {
    const { width, height } = this.gameSize;

    this.percentText.setText(new Intl.NumberFormat(window.navigator.language, { style: 'percent' }).format(value));

    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.setData('progress', value);
    this.progressBar.setData('width', this.progressBox.getData('width') * 0.95 * this.progressBar.getData('progress'));
    this.progressBar.setData('height', this.progressBox.getData('height') * 0.8);
    this.progressBar.fillRect((width - this.progressBar.getData('width')) / 2,
                              height * 2 / 3 + (this.progressBox.getData('height') / 2) - (this.progressBar.getData('height') / 2),
                              this.progressBar.getData('width'),
                              this.progressBar.getData('height'));
  }

  complete() {
    this.progressBar.destroy();
    this.progressBox.destroy();
    this.percentText.destroy();
    this.ready();
  }

  resize(gameSize: Phaser.Structs.Size) {
    this.gameSize = gameSize;

    const { width, height } = this.gameSize;

    this.background.displayWidth = Math.max(this.background.width, width);
    this.background.displayHeight = Math.max(this.background.height, height);

    this.scaleObject(this.logo, width, height / 2, 50, 1);
    this.logo.x = width / 2;
    this.logo.y = (height * 2 / 3) / 2;

    this.progressBox.clear();
    this.progressBox.setData('width', this.logo.displayWidth * 0.8);
    this.progressBox.setData('height', this.progressBox.getData('width') / 10);
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect((width - this.progressBox.getData('width')) / 2,
                              height * 2 / 3,
                              this.progressBox.getData('width'),
                              this.progressBox.getData('height'));

    this.progressBar.clear();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.setData('width', this.progressBox.getData('width') * 0.95 * this.progressBar.getData('progress'));
    this.progressBar.setData('height', this.progressBox.getData('height') * 0.8);
    this.progressBar.fillRect((width - this.progressBar.getData('width')) / 2,
                              height * 2 / 3 + (this.progressBox.getData('height') / 2) - (this.progressBar.getData('height') / 2),
                              this.progressBar.getData('width'),
                              this.progressBar.getData('height'));

    this.percentText.x = width / 2;
    this.percentText.y = height * 2 / 3 + this.progressBox.getData('height') / 2;
    this.percentText.setFontSize(this.progressBox.getData('height') / 3);
  }

  ready() {
    this.scene.start('Title');
    this.readyCount++;

    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}