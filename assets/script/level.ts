import {
  _decorator,
  Component,
  director,
  EventTouch,
  Node,
  Scene,
  Prefab,
  instantiate,
  Widget,
  Label,
} from "cc";
import global from "./const/global";
import levels from "./const/levels";
import { LevelInfo } from "./const/levels";

const { ccclass, property } = _decorator;

@ccclass("level")
export class level extends Component {
  @property(Prefab)
  private levelPrefab: Prefab = null;

  @property(Node)
  private levelContainer: Node = null;

  protected start(): void {
    this.initLevels();
    director.preloadScene("game");
  }

  initLevels() {
    levels.forEach((value: LevelInfo, index: number, array: LevelInfo[]) => {
      if (!this.levelPrefab) return;
      let levelNode = instantiate(this.levelPrefab);
      levelNode.name = `level_${value.levelNum}`;
      levelNode.parent = this.levelContainer;
      let numLab = levelNode.getChildByName("lv_num").getComponent(Label);
      numLab.string = `${value.levelNum + 1}`;
      let currWidget = levelNode.getComponent(Widget);
      currWidget.target = this.levelContainer;
      currWidget.isAlignLeft = true;
      currWidget.isAlignTop = true;
      let lineNum = (index / 3) | 0;
      let itemNum = index % 3;
      currWidget.left = 59.5 + itemNum * (59.5 + 185);
      currWidget.top = 59.5 + lineNum * (59.5 + 185);
    });
  }

  home() {
    director.loadScene("main");
  }

  startGame(e: EventTouch) {
    let target = e.currentTarget;
    if (target) {
      let levelNum = target.name.split("_")[1];
      global.levelNum = Number.parseInt(levelNum);
      director.loadScene("game");
    }
  }
}
