import { _decorator, Component, director, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("menu")
export class menu extends Component {
  startGame() {
    director.loadScene("level");
  }
  
}
