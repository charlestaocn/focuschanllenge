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
  AnimationClip,
  director,
  Label,
  log,
  Vec3,
} from "cc";

import global from "./const/global";
import levels, { AnniType, LevelInfo } from "./const/levels";
const { ccclass, property } = _decorator;

@ccclass("game")
export class game extends Component {
  private static instance: game = null;

  private lvNum: number = 0;

  @property([Prefab])
  private lvPrefabs: Prefab[] = [];

  @property(Node)
  private score: Node = null;

  @property([AnimationClip])
  private animationClips: AnimationClip[] = [];

  @property(Label)
  private scoreNodeLabel: Label = null;

  @property(Label)
  private lvNode: Label = null;

  @property(Label)
  private tryTimesLabel: Label = null;

  @property(Node)
  private nextLvBtn: Node = null;

  private move: Node = null;

  private currentLevelInfo: LevelInfo = null;

  private stopGame: boolean = false;

  private currentGameNode: Node = null;

  private scoreStr: string = "";

  private initDelay: boolean = true;

  start() {
    this.lvNum = global.levelNum;
    this.initGame();
    input.on(Input.EventType.TOUCH_END, (e) => {
      if (this.stopGame) return;
      this.stopMove(e);
    });
    game.instance = this;
  }

  initGame() {
    this.lvNode.string = "lv" + (this.lvNum + 1);
    this.scoreStr = "";
    global.tryTimes = 0;
    this.getLevelInfo();
    this.initPrefab();
    this.initDelay = true;
    setTimeout(() => {
      this.movePic(true, false);
      this.initDelay = false;
    }, 500);
  }

  initPrefab() {
    let prefabNode: Node = null;
    let currPrefabName = this.currentLevelInfo.prefabName;

    this.lvPrefabs.forEach((prefab) => {
      if (prefab.name == currPrefabName) {
        prefabNode = instantiate(prefab);
      }
    });

    if (prefabNode) {
      prefabNode.parent = this.node;
      this.move = prefabNode.getChildByName("move");
      this.move.addComponent(Animation);
      let moveAnni = this.move.getComponent(Animation);
      let currAnniName = this.currentLevelInfo.anniName;
      let currAnniArray = this.animationClips.filter(
        (value: AnimationClip, index: number) => {
          if (value.name == currAnniName) {
            value.speed = this.currentLevelInfo.speed;
            return true;
          }
        }
      );
      if (currAnniArray.length == 0) {
        throw new Error(
          "No animation found for animation name: " + currAnniName
        );
      }
      moveAnni.defaultClip = currAnniArray[0];
      moveAnni.addClip(currAnniArray[0]);
      this.currentGameNode = prefabNode;
    } else {
      throw new Error(
        "No level prefab found for currPrefabName : " + currPrefabName
      );
    }
  }
  getLevelInfo() {
    let tempLevs = levels.filter(
      (value: LevelInfo, index: number, array: LevelInfo[]) =>
        value.levelNum == this.lvNum
    );
    if (tempLevs.length == 0 || tempLevs.length > 1) {
      throw new Error(
        " level cannot find  in array  lvNum:" +
          this.lvNum +
          "or duplicate level found"
      );
    }
    this.currentLevelInfo = tempLevs[0];
  }
  movePic(state: boolean, resume: boolean) {
    let anni = this.move.getComponent(Animation);
    if (state) {
      this.stopGame = false;
      if (resume) {
        anni.resume();
      } else {
        anni.play();
      }
    } else {
      this.stopGame = true;
      anni.pause();
    }
  }

  private stopMove(event: EventTouch) {
    console.log("try", global.tryTimes);
    if (game.instance.initDelay) return;

    global.tryTimes++;

    let checkRes = false;

    switch (game.instance.currentLevelInfo.anniType) {
      case AnniType.move:
        checkRes = game.instance.checkPos();
        break;
      case AnniType.scale:
        checkRes = game.instance.checkScale();
        break;
      case AnniType.rotation:
        checkRes = game.instance.checkAngles();
        break;
      default:
        throw new Error(
          "no success handler for  anni name " +
            game.instance.currentLevelInfo.anniName
        );
    }

    if (checkRes) {
      game.instance.scoreStr =
        100 - (Number.parseFloat((Math.random() * 5).toFixed(2)) + 1) + " % ";
      game.instance.success();
    } else {
      game.instance.movePic(false, false);
      game.instance.playShake(true);
      setTimeout(() => {
        game.instance.playShake(false);
        game.instance.movePic(true, true);
      }, 250);
    }
  }

  private checkAngles(): boolean {
    let successAngles: Vec3[] = game.instance.currentLevelInfo.originAngles;
    let currRotation = game.instance.move.eulerAngles;
    let successFlag = false;
    successAngles.forEach((curr, index, arr) => {
      if (curr.equals(currRotation, 10)) {
        successFlag = true;
        return;
      }
    });
    return successFlag;
  }
  private checkScale(): boolean {
    let scale: Vec3 = game.instance.move.scale;
    return scale.equals(v3(1, 1, 1), 0.05);
  }

  private checkPos(): boolean {
    let originPos = game.instance.currentLevelInfo.originPos;
    let pos = game.instance.move.position;
    return originPos.equals(pos, 10);
  }

  private success() {
    this.scoreNodeLabel.string = this.scoreStr;
    this.tryTimesLabel.string = global.tryTimes + " Tries";
    this.score.active = true;
    this.checkHasNext();
    this.movePic(false, false);
    let origin = this.currentGameNode.getChildByName("origin");
    if (origin) origin.active = true;
  }

  private checkHasNext() {
    console.log(global.levelNum, levels.length);
    if (global.levelNum == levels.length - 1) {
      this.nextLvBtn.active = false;
    }
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
    this.scoreStr = "";
    global.tryTimes = 0;
    this.stopGame = false;
    this.node.removeAllChildren();
    this.initPrefab();
    this.score.active = false;
    setTimeout(() => {
      this.movePic(true, false);
    }, 500);
  }

  public nextLv() {
    global.levelNum++;
    this.lvNum = global.levelNum;
    this.initGame();
    this.score.active = false;
  }

  public backLevelMenu() {
    input.off(Input.EventType.TOUCH_END);
    director.loadScene("level");
  }
}
