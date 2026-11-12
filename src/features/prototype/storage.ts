import { initialState, stateSchema, type State } from "./model";
export const STORAGE_KEY = "doroboty.prototype.v1";
export const MAX_IMPORT_BYTES = 2_000_000;
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function parseState(raw: string): State {
  if (new TextEncoder().encode(raw).length > MAX_IMPORT_BYTES)
    throw new Error("Plik jest za duży (maksymalnie 2 MB).");
  try {
    return stateSchema.parse(migrateProjectCards(JSON.parse(raw)));
  } catch {
    throw new Error(
      "Nieprawidłowy plik lub nieobsługiwana wersja danych. Dotychczasowy stan pozostaje bez zmian.",
    );
  }
}

function migrateProjectCards(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  const state = value as Record<string, unknown>;
  if (state.version !== 1) return value;
  const fixtures = initialState().people;
  const attachFixtureContext = (rawCard: unknown, fixtureCards: unknown[]) => {
    if (!rawCard || typeof rawCard !== "object") return rawCard;
    const card = rawCard as Record<string, unknown>;
    const fixture = fixtureCards.find(
      (item) =>
        item && typeof item === "object" && (item as Record<string, unknown>).goal === card.goal,
    ) as Record<string, unknown> | undefined;
    if (fixture) {
      for (const key of ["organization", "position", "period"])
        if (!card[key]) card[key] = fixture[key];
    }
    return card;
  };
  if (Array.isArray(state.people)) {
    state.people = state.people.map((entry) => {
      if (!entry || typeof entry !== "object") return entry;
      const person = entry as Record<string, unknown>;
      const fixture = fixtures.find((item) => item.id === person.id);
      const projectCards = Array.isArray(person.projectCards)
        ? person.projectCards
        : person.projectCard
          ? [person.projectCard]
          : (fixture?.projectCards ?? []);
      if (fixture?.projectCards) {
        for (const fixtureCard of fixture.projectCards) {
          const alreadyExists = projectCards.some(
            (card) =>
              card &&
              typeof card === "object" &&
              (card as Record<string, unknown>).goal === fixtureCard.goal,
          );
          if (!alreadyExists && projectCards.length < 20) projectCards.push(fixtureCard);
        }
      }
      person.projectCards = projectCards.map((card) =>
        attachFixtureContext(card, fixture?.projectCards ?? []),
      );
      delete person.projectCard;
      return person;
    });
  }
  if (Array.isArray(state.applications)) {
    state.applications = state.applications.map((entry) => {
      if (!entry || typeof entry !== "object") return entry;
      const application = entry as Record<string, unknown>;
      const projectCards = Array.isArray(application.projectCards)
        ? application.projectCards
        : application.projectCard
          ? [application.projectCard]
          : [];
      application.projectCards = projectCards;
      delete application.projectCard;
      return application;
    });
  }
  state.version = 2;
  return state;
}
export function serializeState(state: State) {
  return JSON.stringify(state, null, 2);
}
export function readState(storage: StoragePort | null) {
  if (!storage)
    return {
      state: initialState(),
      issue:
        "Zapis w przeglądarce jest niedostępny. Zmiany zachowasz przez eksport w ustawieniach.",
      blocked: false,
      original: null,
    };
  let raw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
    const state = raw ? parseState(raw) : initialState();
    return {
      state,
      issue: "",
      blocked: false,
      original: null,
    };
  } catch {
    return {
      state: initialState(),
      issue:
        "Nie udało się odczytać zapisu. Dotychczasowe dane nie zostaną nadpisane. Pobierz je w ustawieniach, a następnie zaimportuj poprawny plik lub zresetuj scenariusz.",
      blocked: true,
      original: raw,
    };
  }
}
export function saveState(storage: StoragePort | null, state: State) {
  if (!storage)
    throw new Error(
      "Zapis w przeglądarce jest niedostępny. Wyeksportuj zmiany przed zamknięciem strony.",
    );
  const raw = serializeState(state);
  if (new TextEncoder().encode(raw).length > MAX_IMPORT_BYTES)
    throw new Error("Dane przekraczają 2 MB. Wyeksportuj je, aby zachować zmiany.");
  try {
    storage.setItem(STORAGE_KEY, raw);
  } catch {
    throw new Error(
      "Nie udało się zapisać zmian w przeglądarce. Wyeksportuj dane przed zamknięciem strony.",
    );
  }
}
