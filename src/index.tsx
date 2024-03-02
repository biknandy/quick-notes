import { List } from "@raycast/api";
import { useEffect } from "react";
import { notesAtom } from "./services/atoms";
import { useAtom } from "jotai";
import Actions from "./components/actions";
import { format } from "date-fns";

export default function Command() {
  const [notes] = useAtom(notesAtom);

  useEffect(() => {
    console.log(notes);
  }, [notes]);

  return (
    <List isShowingDetail={notes.length > 0}>
      {notes.length === 0 ? (
        <List.EmptyView title="⌘ + N to create a new note." actions={<Actions noNotes />} />
      ) : (
        notes.map((note, index) => (
          <List.Item
            key={index}
            title={note.title}
            detail={<List.Item.Detail markdown={note.body} />}
            actions={
              <Actions
                noNotes={false}
                title={note.title}
                note={note.body}
                tags={note.tags}
                createdAt={note.createdAt}
              />
            }
            accessories={[
              {
                date: new Date(note.updatedAt),
                tooltip: `Last updated ${format(note.updatedAt, "MMMM d, yyyy '@' HH:mm")}`,
              },
            ]}
          />
        ))
      )}
    </List>
  );
}
