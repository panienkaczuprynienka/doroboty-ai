import { describe, expect, it } from "vitest";
import { initialState } from "./model";
import {
  MAX_IMPORT_BYTES,
  parseState,
  readState,
  saveState,
  serializeState,
  STORAGE_KEY,
} from "./storage";
function memory(raw: string | null = null) {
  const values = new Map(raw === null ? [] : [[STORAGE_KEY, raw]]);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
describe("browser persistence and recovery", () => {
  it("round-trips a complete valid scenario", () => {
    const storage = memory();
    const s = initialState();
    saveState(storage, s);
    expect(readState(storage).state).toEqual(s);
    expect(parseState(serializeState(s))).toEqual(s);
  });
  it("protects incompatible/corrupt original saves", () => {
    for (const raw of ["{", JSON.stringify({ ...initialState(), version: 3 })]) {
      const storage = memory(raw);
      const loaded = readState(storage);
      expect(loaded.blocked).toBe(true);
      expect(loaded.original).toBe(raw);
      expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    }
  });
  it("does not fail startup when storage access is denied", () => {
    expect(readState(null).state.jobs.length).toBeGreaterThan(0);
    expect(
      readState({
        getItem() {
          throw new Error("Denied");
        },
        setItem() {},
      }).blocked,
    ).toBe(true);
  });
  it("reports quota/write failure without altering the original", () => {
    const old = "old";
    const storage = {
      getItem: () => old,
      setItem() {
        throw new Error("QuotaExceededError");
      },
    };
    expect(() => saveState(storage, initialState())).toThrow("Wyeksportuj");
    expect(storage.getItem()).toBe(old);
  });
  it("rejects invalid references and oversized files", () => {
    const s = initialState();
    s.saved = [{ candidateId: "missing", jobId: s.jobs[0].id }];
    expect(() => parseState(JSON.stringify(s))).toThrow("Dotychczasowy stan");
    expect(() => parseState(" ".repeat(MAX_IMPORT_BYTES + 1))).toThrow("za duży");
  });
  it("accepts legacy appearance preferences without changing scenario data", () => {
    const state = initialState();
    for (const theme of ["dark", "system", "light"]) {
      expect(parseState(JSON.stringify({ ...state, theme }))).toEqual(state);
    }
  });
});

describe("project card migration", () => {
  it("preserves current edits and submitted snapshots without fixture enrichment", () => {
    const state = initialState();
    const card = { ...state.people[0].projectCards![0] };
    delete card.organization;
    delete card.position;
    delete card.period;
    state.people[0].projectCards = [card];
    state.applications[0].projectCards = [card];
    expect(parseState(serializeState(state))).toEqual(state);
  });
  it("migrates legacy single cards once and does not rewrite submitted content", () => {
    const state = initialState();
    const card = { ...state.people[0].projectCards![0] };
    delete card.organization;
    const legacy = JSON.parse(JSON.stringify(state));
    legacy.version = 1;
    delete legacy.people[0].projectCards;
    legacy.people[0].projectCard = { ...card, result: "Human edited result" };
    delete legacy.applications[0].projectCards;
    legacy.applications[0].projectCard = card;
    const migrated = parseState(JSON.stringify(legacy));
    expect(migrated.version).toBe(2);
    expect(migrated.people[0].projectCards![0].result).toBe("Human edited result");
    expect(migrated.applications[0].projectCards).toEqual([card]);
    expect(parseState(serializeState(migrated))).toEqual(migrated);
  });
});

it("preserves a full legacy profile instead of exceeding the 20-card limit", () => {
  const state = initialState();
  const cards = Array.from({ length: 20 }, (_, index) => ({
    ...state.people[0].projectCards![0],
    goal: `Custom project ${index}`,
  }));
  state.people[0].projectCards = cards;
  const migrated = parseState(JSON.stringify({ ...state, version: 1 }));
  expect(migrated.people[0].projectCards).toEqual(cards);
});
