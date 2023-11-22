import { Vec2, Vec3, v2, v3 } from "cc";

export enum AnniType {
  move = 0,
  scale = 1,
  rotation = 2,
}

export default [
  {
    levelNum: 0,
    prefabName: "lv0",
    anniName: "move0",
    speed: 2,
    originPos: v3(-88.075, 112.239, 0),
    anniType: AnniType.move,
  },
  {
    levelNum: 1,
    prefabName: "lv1",
    anniName: "move1",
    speed: 1,
    anniType: AnniType.move,
    originPos: v3(99.617, 347.036, 0),
  },
  {
    levelNum: 2,
    prefabName: "lv2",
    anniName: "move2",
    speed: 1,
    anniType: AnniType.move,
    originPos: v3(269.5, 200, 0),
  },
  {
    levelNum: 3,
    prefabName: "lv3",
    anniName: "scale1",
    anniType: AnniType.scale,
    speed: 1,
  },
  {
    levelNum: 4,
    prefabName: "lv4",
    anniName: "scale2",
    anniType: AnniType.scale,
    speed: 2,
  },
  {
    levelNum: 5,
    anniType: AnniType.scale,
    prefabName: "lv5",
    anniName: "scale3",
    speed: 2,
  },
  {
    levelNum: 6,
    anniType: AnniType.scale,
    prefabName: "lv6",
    anniName: "scale4",
    speed: 1.5,
  },
  {
    levelNum: 7,
    anniType: AnniType.scale,
    prefabName: "lv7",
    anniName: "scale4",
    speed: 1.5,
  },
  {
    levelNum: 8,
    anniType: AnniType.move,
    prefabName: "lv8",
    anniName: "move3",
    originPos: v3(423.52, 239.04, 0),
    speed: 1.3,
  },
  {
    levelNum: 9,
    prefabName: "lv9",
    anniType: AnniType.rotation,
    anniName: "rotation1",
    originAngles: [v3(0, 0, 0), v3(0, 0, -360)],
    speed: 1,
  },
  {
    levelNum: 10,
    prefabName: "lv10",
    anniType: AnniType.move,
    originPos: v3(176.692, 101.12, 0),
    anniName: "move4",
    speed: 0.9,
  },
  {
    levelNum: 11,
    prefabName: "lv11",
    anniType: AnniType.scale,
    anniName: "scale4",
    speed: 1.4,
  },
  {
    levelNum: 12,
    prefabName: "lv12",
    anniType: AnniType.move,
    originPos: v3(207.68, 162.952, 0),
    anniName: "move5",
    speed: 1.5,
  },
] as LevelInfo[];

export interface LevelInfo {
  levelNum: number;
  prefabName: string;
  anniName: string;
  speed: number;
  originPos?: Vec3;
  originAngles?: Vec3[];
  anniType: number;
}


