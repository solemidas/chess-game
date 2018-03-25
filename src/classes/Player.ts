import {
  PlayerAlliance,
} from 'classes/index';
export default class Player {
  private alliance: PlayerAlliance;
  constructor(alliance: PlayerAlliance) {
    this.alliance = alliance;
  }

  isWhite() {
    return this.alliance === PlayerAlliance.WHITE;
  }
}