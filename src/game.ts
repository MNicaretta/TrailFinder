import Phaser from 'phaser';
import Controller from './scenes/controller';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Trail Finder',
  type: Phaser.AUTO,
  scale: {
    width: 1080,
    height: 1080,
    mode: Phaser.Scale.NONE,
  },
  parent: 'game',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);

export function startGame() {
  game.scene.add('Controller', new Controller());
  game.scene.start('Controller');
}
