import { atom } from "jotai";
import { TAGS_FILE_PATH, TODO_FILE_PATH, preferences } from "./config";
import fs from "fs";
import { compareDesc } from "date-fns";
import {
  deleteNotesInFolder,
  exportNotes,
  getDeletedNote,
  getInitialValuesFromFile,
  getOldRenamedTitles,
} from "../utils/utils";

export interface Note {
  title: string;
  body: string;
  tags: string[];
  is_draft: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  name: string;
  color: string;
}

const notes = atom<Note[]>(getInitialValuesFromFile(TODO_FILE_PATH) as Note[]);
export const notesAtom = atom(
  (get) => {
    const notesQ = get(notes);

    // Sort based on user preference
    return notesQ.sort((a, b) => {
      if (preferences.sort === "created") {
        return compareDesc(a.createdAt, b.createdAt);
      } else if (preferences.sort === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return compareDesc(a.updatedAt, b.updatedAt);
    });
  },
  async (get, set, newNotes: Note[]) => {
    /**
     * Autosave deletion logic
     * - If a note is renamed, delete the old note file as title is the filename
     * - If a note is deleted, delete the note file
     */
    if (preferences.fileLocation) {
      const differentTitles = getOldRenamedTitles(get(notes), newNotes);
      if (differentTitles.length > 0) {
        try {
          await deleteNotesInFolder(preferences.fileLocation, differentTitles);
        } catch (e) {
          console.error(`Error deleting note: ${e}`);
        }
      }
      const deletedNote = getDeletedNote(get(notes), newNotes);
      if (deletedNote) {
        try {
          await deleteNotesInFolder(preferences.fileLocation, [deletedNote.title]);
        } catch (e) {
          console.error(`Error deleting note: ${e}`);
        }
      }
    }

    // Update the notes
    set(notes, newNotes);

    // Write notes to JSON data
    fs.writeFileSync(TODO_FILE_PATH, JSON.stringify(newNotes, null, 2));

    // Write notes to file system if autosave is enabled
    if (preferences.fileLocation) {
      await exportNotes(preferences.fileLocation, newNotes);
    }
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
