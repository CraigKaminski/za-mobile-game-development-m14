export class Preload extends Phaser.State {
  public preload() {
    const preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'bar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(100, 1);
    this.load.setPreloadSprite(preloadBar);

    this.load.image('grass', 'images/grass2.png');
    this.load.image('grasstrees', 'images/grass3.png');
    this.load.image('grasstrees2', 'images/grass4.png');
    this.load.image('rocks', 'images/rocks.png');
    this.load.image('water', 'images/water.png');
    this.load.image('black', 'images/black.png');
    this.load.image('sacredWarrior', 'images/leopard-warrior.png');
    this.load.image('warrior', 'images/warrior.png');
    this.load.image('wolf', 'images/wolf.png');
    this.load.image('orc', 'images/orc.png');
    this.load.image('ogre', 'images/ogre.png');
    this.load.image('house', 'images/house-1.png');
    this.load.image('darkTemple', 'images/dark-temple.png');

    this.load.text('map', 'data/map.json');
    this.load.text('playerUnits', 'data/playerUnits.json');
    this.load.text('enemyUnits', 'data/enemyUnits.json');

  }

  public create() {
    this.state.start('Game');
  }
}
