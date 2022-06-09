import Phaser from 'phaser';

import Scene from './scene';

import { TilesetConst } from '@/consts/tileset';
import { GameChar, GamePhase } from '@/models/game';

import Player0 from '@/assets/images/player_0.png';
import Player1 from '@/assets/images/player_1.png';
import Player2 from '@/assets/images/player_2.png';

import Chest from '@/assets/images/chest.png';

import Sheet from '@/assets/images/sheet.png';
import Title from '@/assets/images/title.png';
import Play from '@/assets/images/play.png';

import TitleBackground from '@/assets/tilemaps/title_background.json';

import Phase1 from '@/assets/tilemaps/phase_1.json';
import Thumbnail1 from '@/assets/images/phase_1.png';
import Phase2 from '@/assets/tilemaps/phase_2.json';
import Thumbnail2 from '@/assets/images/phase_2.png';
import Phase3 from '@/assets/tilemaps/phase_3.json';
import Thumbnail3 from '@/assets/images/phase_3.png';
import Phase4 from '@/assets/tilemaps/phase_4.json';
import Thumbnail4 from '@/assets/images/phase_4.png';
import Phase5 from '@/assets/tilemaps/phase_5.json';
import Thumbnail5 from '@/assets/images/phase_5.png';
import Phase6 from '@/assets/tilemaps/phase_6.json';
import Thumbnail6 from '@/assets/images/phase_6.png';
import Phase7 from '@/assets/tilemaps/phase_7.json';
import Thumbnail7 from '@/assets/images/phase_7.png';
import Phase8 from '@/assets/tilemaps/phase_8.json';
import Thumbnail8 from '@/assets/images/phase_8.png';
import Phase9 from '@/assets/tilemaps/phase_9.json';
import Thumbnail9 from '@/assets/images/phase_9.png';
import Phase10 from '@/assets/tilemaps/phase_10.json';
import Thumbnail10 from '@/assets/images/phase_10.png';
import Phase11 from '@/assets/tilemaps/phase_11.json';
import Thumbnail11 from '@/assets/images/phase_11.png';

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
    this.gameStore.addChar(new GameChar('player_0'));

    this.load.spritesheet('player_1', Player1, {
      frameWidth: 64,
    });
    this.gameStore.addChar(new GameChar('player_1'));

    this.load.spritesheet('player_2', Player2, {
      frameWidth: 64,
    });
    this.gameStore.addChar(new GameChar('player_2'));

    this.load.spritesheet('chest', Chest, {
      frameWidth: 32,
    });

    this.load.image('sheet', Sheet);
    this.load.image('title', Title);
    this.load.image('play', Play);

    this.load.tilemapTiledJSON('title_background', TitleBackground);

    this.loadPhases();

    this.load.on(Phaser.Loader.Events.PROGRESS, this.progress, this);

    this.load.on(Phaser.Loader.Events.COMPLETE, this.complete, this);

    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this);
  }

  private loadPhases() {
    this.load.tilemapTiledJSON('phase_1', Phase1);
    this.gameStore.addPhase(new GamePhase('phase_1', Thumbnail1, 4));
    this.load.tilemapTiledJSON('phase_2', Phase2);
    this.gameStore.addPhase(new GamePhase('phase_2', Thumbnail2, 4));
    this.load.tilemapTiledJSON('phase_3', Phase3);
    this.gameStore.addPhase(new GamePhase('phase_3', Thumbnail3, 9));
    this.load.tilemapTiledJSON('phase_4', Phase4);
    this.gameStore.addPhase(new GamePhase('phase_4', Thumbnail4, 6));
    this.load.tilemapTiledJSON('phase_5', Phase5);
    this.gameStore.addPhase(new GamePhase('phase_5', Thumbnail5, 6));
    this.load.tilemapTiledJSON('phase_6', Phase6);
    this.gameStore.addPhase(new GamePhase('phase_6', Thumbnail6, 13));
    this.load.tilemapTiledJSON('phase_7', Phase7);
    this.gameStore.addPhase(new GamePhase('phase_7', Thumbnail7, 7));
    this.load.tilemapTiledJSON('phase_8', Phase8);
    this.gameStore.addPhase(new GamePhase('phase_8', Thumbnail8, 16));
    this.load.tilemapTiledJSON('phase_9', Phase9);
    this.gameStore.addPhase(new GamePhase('phase_9', Thumbnail9, 20));
    this.load.tilemapTiledJSON('phase_10', Phase10);
    this.gameStore.addPhase(new GamePhase('phase_10', Thumbnail10, 9));
    this.load.tilemapTiledJSON('phase_11', Phase11);
    this.gameStore.addPhase(new GamePhase('phase_11', Thumbnail11, 22));
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

    for (const player of this.gameStore.chars) {
      this.anims.create({
        key: 'walk--' + player.name,
        frames: this.anims.generateFrameNumbers(player.name, {
          start: TilesetConst.WALK_START,
          end: TilesetConst.WALK_END,
        }),
        frameRate: 5,
        repeat: -1,
      });
      this.anims.create({
        key: 'climb--' + player.name,
        frames: this.anims.generateFrameNumbers(player.name, {
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
