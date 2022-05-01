import Phaser from 'phaser';
import Controller from './scenes/controller';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Trail Finder',
  type: Phaser.AUTO,
  scale: {
    width: 320,
    height: 320,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  parent: 'game',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);

export function startGame() {
  game.scene.add('Controller', new Controller());
  game.scene.start('Controller');
}
