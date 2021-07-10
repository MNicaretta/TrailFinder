import Phaser from 'phaser';
import BootScene from './boot_scene';
import PreloaderScene from './preloader_scene';
import TitleScene from './title_scene';

export default class Controller extends Phaser.Scene {
  constructor() {
    super('Controller');
  }

  create() {
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);

    this.scene.start('Boot');
  }
}
