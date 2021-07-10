import Phaser from 'phaser';
import Controller from './scenes/controller';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Phaser 3 Setup',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1920,
    height: 1080,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  parent: 'app',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);
game.scene.add('Controller', new Controller());
game.scene.start('Controller');
