import Scene from './scene';
import BootScene from './boot_scene';
import PreloaderScene from './preloader_scene';
import TitleScene from './title_scene';
import GameScene from './game_scene';

export default class Controller extends Scene {
  constructor() {
    super('Controller');
  }

  create() {
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Game', GameScene);

    this.scene.start('Boot');
  }
}
