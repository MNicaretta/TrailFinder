import Phaser from 'phaser';

import Scene from './scene';

import { GameChars, GamePhases } from '@/consts/game';

import Player0 from '@/assets/images/player_0.png';
import Player1 from '@/assets/images/player_1.png';
import Player2 from '@/assets/images/player_2.png';

import Chest from '@/assets/images/chest.png';

import Sheet from '@/assets/images/sheet.png';
import Title from '@/assets/images/title.png';
import Play from '@/assets/images/play.png';

import TitleBackground from '@/assets/tilemaps/title_background.json';
import Phase1 from '@/assets/tilemaps/phase_1.json';
import Phase2 from '@/assets/tilemaps/phase_2.json';
import { TilesetConst } from '@/consts/tileset';

export default class PreloaderScene extends Scene {
  private readyCount: number = 0;

  private background?: Phaser.GameObjects.Image;
  private logo?: Phaser.GameObjects.Image;

  private progressBar?: Phaser.GameObjects.Graphics;
  private progressBox?: Phaser.GameObjects.Graphics;
  private percentText?: Phaser.GameObjects.Text;

  constructor() {
    super('Preloader');
  }

  preload() {
    this.gameSize = this.sys.game.scale.gameSize;

    const { width, height } = this.gameSize;

    this.background = this.add.image(0, 0, 'dev_background');
    this.background.setOrigin(0);
    this.background.displayWidth = Math.max(this.background.width, width);
    this.background.displayHeight = Math.max(this.background.height, height);

    this.logo = this.add.image(width / 2, (height * 2) / 3 / 2, 'dev_logo');
    this.scaleObject(this.logo, width, (height * 2) / 3, 50, 1);

    this.progressBox = this.add.graphics();
    this.progressBox.setData('width', this.logo.displayWidth * 0.8);
    this.progressBox.setData('height', this.progressBox.getData('width') / 10);
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(
      (width - this.progressBox.getData('width')) / 2,
      (height * 2) / 3,
      this.progressBox.getData('width'),
      this.progressBox.getData('height')
    );

    this.progressBar = this.add.graphics();

    this.percentText = this.make.text({
      x: width / 2,
      y: (height * 2) / 3 + this.progressBox.getData('height') / 2,
      text: '0%',
      style: {
        fontSize: `${this.progressBox.getData('height') / 3}px`,
        fontFamily: 'monospace',
        color: '#000000',
      },
    });
    this.percentText.setOrigin(0.5);

    this.load.spritesheet('player_0', Player0, {
      frameWidth: 64,
    });
    GameChars.push('player_0');

    this.load.spritesheet('player_1', Player1, {
      frameWidth: 64,
    });
    GameChars.push('player_1');

    this.load.spritesheet('player_2', Player2, {
      frameWidth: 64,
    });
    GameChars.push('player_2');

    this.load.spritesheet('chest', Chest, {
      frameWidth: 32,
    });

    this.load.image('sheet', Sheet);
    this.load.image('title', Title);
    this.load.image('play', Play);

    this.load.tilemapTiledJSON('title_background', TitleBackground);

    this.load.tilemapTiledJSON('phase_1', Phase1);
    GamePhases.push('phase_1');
    this.load.tilemapTiledJSON('phase_2', Phase2);
    GamePhases.push('phase_2');

    this.load.on(Phaser.Loader.Events.PROGRESS, this.progress, this);

    this.load.on(Phaser.Loader.Events.COMPLETE, this.complete, this);

    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this);
  }

  progress(value: number) {
    if (this.gameSize) {
      const { width, height } = this.gameSize;

      if (this.percentText) {
        this.percentText.setText(
          new Intl.NumberFormat(window.navigator.language, {
            style: 'percent',
          }).format(value)
        );
      }

      if (this.progressBar) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.setData('progress', value);
        this.progressBar.setData(
          'width',
          this.progressBox?.getData('width') *
            0.95 *
            this.progressBar.getData('progress')
        );
        this.progressBar.setData(
          'height',
          this.progressBox?.getData('height') * 0.8
        );
        this.progressBar.fillRect(
          (width - this.progressBar.getData('width')) / 2,
          (height * 2) / 3 +
            this.progressBox?.getData('height') / 2 -
            this.progressBar.getData('height') / 2,
          this.progressBar.getData('width'),
          this.progressBar.getData('height')
        );
      }
    }
  }

  complete() {
    this.progressBar?.destroy();
    this.progressBox?.destroy();
    this.percentText?.destroy();

    for (const player of GameChars) {
      this.anims.create({
        key: 'walk--' + player,
        frames: this.anims.generateFrameNumbers(player, {
          start: TilesetConst.WALK_START,
          end: TilesetConst.WALK_END,
        }),
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: 'climb--' + player,
        frames: this.anims.generateFrameNumbers(player, {
          start: TilesetConst.CLIMB_START,
          end: TilesetConst.CLIMB_END,
        }),
        frameRate: 5,
        repeat: -1,
      });
    }

    this.anims.create({
      key: 'open',
      frames: this.anims.generateFrameNumbers('chest', {
        start: TilesetConst.OPEN_START,
        end: TilesetConst.OPEN_END,
      }),
      frameRate: 5,
    });

    this.ready();
  }

  resize(gameSize: Phaser.Structs.Size) {
    this.gameSize = gameSize;

    const { width, height } = this.gameSize;

    if (this.background) {
      this.background.displayWidth = Math.max(this.background.width, width);
      this.background.displayHeight = Math.max(this.background.height, height);
    }

    if (this.logo) {
      this.scaleObject(this.logo, width, height / 2, 50, 1);
      this.logo.x = width / 2;
      this.logo.y = (height * 2) / 3 / 2;
    }

    if (this.progressBox) {
      this.progressBox.clear();
      this.progressBox.setData('width', this.logo?.displayWidth ?? 0 * 0.8);
      this.progressBox.setData(
        'height',
        this.progressBox.getData('width') / 10
      );
      this.progressBox.fillStyle(0x222222, 0.8);
      this.progressBox.fillRect(
        (width - this.progressBox.getData('width')) / 2,
        (height * 2) / 3,
        this.progressBox.getData('width'),
        this.progressBox.getData('height')
      );
    }

    if (this.progressBar) {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.setData(
        'width',
        this.progressBox?.getData('width') *
          0.95 *
          this.progressBar.getData('progress')
      );
      this.progressBar.setData(
        'height',
        this.progressBox?.getData('height') * 0.8
      );
      this.progressBar.fillRect(
        (width - this.progressBar.getData('width')) / 2,
        (height * 2) / 3 +
          this.progressBox?.getData('height') / 2 -
          this.progressBar.getData('height') / 2,
        this.progressBar.getData('width'),
        this.progressBar.getData('height')
      );
    }

    if (this.percentText) {
      this.percentText.x = width / 2;
      this.percentText.y =
        (height * 2) / 3 + this.progressBox?.getData('height') / 2;
      this.percentText.setFontSize(this.progressBox?.getData('height') / 3);
    }
  }

  ready() {
    this.scene.start('Title');
    this.readyCount++;

    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}
