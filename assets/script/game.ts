import {
  _decorator,
  Component,
  Input,
  input,
  instantiate,
  Node,
  Prefab,
  Animation,
  EventTouch,
  v3,
} from "cc";

import global from "./const/global";
const { ccclass, property } = _decorator;

@ccclass("game")
export class game extends Component {
  private lvNum: number = 0;

  @property([Prefab])
  private lvPrefabs: Prefab[] = [];

  @property(Node)
  private score: Node = null;

  private move: Node = null;

  start() {
    this.lvNum = global.levelNum;
    this.initGame();
    input.on(Input.EventType.TOUCH_END, (e) => {
      this.stopMove(e);
    });
  }

  initGame() {
    let prefabNode: Node = null;
    this.lvPrefabs.forEach((prefab) => {
      if (prefab.name == "" + this.lvNum) {
        prefabNode = instantiate(prefab);
      }
    });
    if (prefabNode) {
      prefabNode.parent = this.node;
      this.move = prefabNode.getChildByName("move");
      setTimeout(() => {
        this.movePic(true, false);
      }, 500);
    } else {
      console.log("通关了！！");
    }
  }

  movePic(state: boolean, resume: boolean) {
    let anni = this.move.getComponent(Animation);
    if (state) {
      if (resume) {
        anni.resume();
      } else {
        anni.play();
      }
    } else {
      anni.pause();
    }
  }

  private stopMove(event: EventTouch) {
    let pos = this.move.position;
    let originPos = v3(66, 321, 0);
    let x = Math.abs(pos.x - originPos.x);
    let y = Math.abs(pos.y - originPos.y);
    // console.log("x + y!!", x, y);

    if (x + y < 100) {
      this.success();
    } else {
      this.movePic(false, false);
      this.playShake(true);
      setTimeout(() => {
        this.playShake(false);
        this.movePic(true, true);
      }, 250);
    }
  }

  private success() {
    global.levelNum += 1;
    this.score.active = true;
    this.movePic(false, false);
    console.log("success!!");
  }
  private playShake(state: boolean) {
    let anni = this.node.getComponent(Animation);
    if (state) {
      anni.play();
    } else {
      anni.pause();
    }
  }

  public replay() {
    console.log("replay");
  }

  public nextLv() {
    console.log("nextLv");
  }
}
