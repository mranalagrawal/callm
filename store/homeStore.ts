import { defineStore } from "pinia";

interface Field {
  key: string;
  value: string;
}

interface Metaobject {
  fields: Field[];
}

interface HeroState {
  ids: string[];
  metaobject: Metaobject | null;
}

export const useHomeStore = defineStore({
  id: "hero",
  state: (): HeroState => ({
    ids: [],
    metaobject: null,
  }),
  actions: {
    setIds(idsData: string[]) {
      this.ids = idsData;
    },
    setMetaobject(metaobject: Metaobject) {
      this.metaobject = metaobject;
    },
  },
});
