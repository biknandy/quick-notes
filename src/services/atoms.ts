import { atom } from "jotai";
import { TAGS_FILE_PATH, TODO_FILE_PATH } from "./config";
import fs from "fs";
import { environment } from "@raycast/api";
import { compareDesc } from "date-fns";

export interface Note {
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Tag {
  name: string;
  color: string;
}

const getInitialValuesFromFile = (filepath: string): [] => {
  try {
    // Check if the file exists
    if (fs.existsSync(filepath)) {
      const storedItemsBuffer = fs.readFileSync(filepath);
      return JSON.parse(storedItemsBuffer.toString());
    } else {
      fs.mkdirSync(environment.supportPath, { recursive: true });
      return []; // Return empty array if file doesn't exist
    }
  } catch (error) {
    fs.mkdirSync(environment.supportPath, { recursive: true });
    return [];
  }
};

const notes = atom<Note[]>(getInitialValuesFromFile(TODO_FILE_PATH) as Note[]);
export const notesAtom = atom(
  (get) => {
    const notesQ = get(notes);
    return notesQ.sort((a, b) => compareDesc(a.updatedAt, b.updatedAt));
  },
  (get, set, newNotes: Note[]) => {
    set(notes, newNotes);

    // Write updated notes to the file
    fs.writeFileSync(TODO_FILE_PATH, JSON.stringify(newNotes, null, 2));
  },
);

const tags = atom<Tag[]>(getInitialValuesFromFile(TAGS_FILE_PATH) as Tag[]);
export const tagsAtom = atom(
  (get) => get(tags),
  (get, set, newTags: Tag[]) => {
    set(tags, newTags);

    // Write updated notes to the file
    fs.writeFileSync(TAGS_FILE_PATH, JSON.stringify(newTags, null, 2));
  },
);

// export const searchModeAtom = atom(false);

// export const searchBarTextAtom = atom("");
// export const newTodoTextAtom = atom((get) => get(searchBarTextAtom).trim());
// export const editingAtom = atom<false | Note>(false);
