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

const { ccclass, property } = _decorator;

@ccclass("level")
export class level extends Component {
  @property(Prefab)
  private levelPrefab: Prefab = null;

  @property(Node)
  private levelContainer: Node = null;

  protected start(): void {
    this.initLevels();
  }

  initLevels() {
    levels.forEach((value: number, index: number, array: number[]) => {
      if (!this.levelPrefab) return;
      let levelNode = instantiate(this.levelPrefab);
      levelNode.name = `level_${index}`;
      levelNode.parent = this.levelContainer;
      let numLab = levelNode.getChildByName("lv_num").getComponent(Label);
      numLab.string = `${value}`;
      let currWidget = levelNode.getComponent(Widget);
      currWidget.target = this.levelContainer;
      currWidget.isAlignLeft = true;
      currWidget.isAlignTop = true;
      let lineNum = (index / 4) | 0;
      let itemNum = index % 4;
      currWidget.left = 30 + itemNum * (30 + 150);
      currWidget.top = 30 + lineNum * (30 + 150);
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
