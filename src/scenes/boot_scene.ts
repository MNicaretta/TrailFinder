import Scene from './scene';
import DevLogo from '../assets/images/dev_logo.png';
import DevBackground from '../assets/images/dev_background.png';

export default class BootScene extends Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('dev_logo', DevLogo);
    this.load.image('dev_background', DevBackground);
  }

  create() {
    this.scene.start('Preloader');
  }
}