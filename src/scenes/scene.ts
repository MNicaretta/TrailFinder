import Phaser from 'phaser'

export default class Scene extends Phaser.Scene {
  protected gameSize: Phaser.Structs.Size;

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