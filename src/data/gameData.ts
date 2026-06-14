import animationsJson from "./animations.json";
import effectsJson from "./effects.json";
import skillsJson from "./skills.json";
import stages from "./stages";
import superCatsJson from "./superCats.json";
import unitsJson from "./units.json";
import type {
  AnimationDefinition,
  EffectDefinition,
  SkillDefinition,
  StageDefinition,
  SuperCatDefinition,
  UnitDefinition,
} from "../game/types";

export const animationDefinitions = animationsJson as AnimationDefinition[];
export const effectDefinitions = effectsJson as EffectDefinition[];
export const skillDefinitions = skillsJson as SkillDefinition[];
export const stageDefinitions = stages as StageDefinition[];
export const superCatDefinitions = superCatsJson as SuperCatDefinition[];
export const unitDefinitions = unitsJson as UnitDefinition[];
