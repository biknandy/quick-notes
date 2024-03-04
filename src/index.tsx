import { List } from "@raycast/api";
import { useEffect } from "react";
import { notesAtom } from "./services/atoms";
import { useAtom } from "jotai";
import Actions from "./components/actions";
import { format } from "date-fns";

export default function Command() {
  const [notes] = useAtom(notesAtom);

  const drafts = notes.filter((n) => n.is_draft);
  const published = notes.filter((n) => !n.is_draft);

  return (
    <List isShowingDetail={notes.length > 0}>
      {published.length === 0 && drafts.length === 0 ? (
        <List.EmptyView title="⌘ + N to create a new note." actions={<Actions noNotes />} />
      ) : (
        <>
          {drafts.length > 0 && (
            <List.Section title="Drafts">
              {drafts.map((note, index) => (
                <List.Item
                  key={index}
                  title={note.title}
                  detail={<List.Item.Detail markdown={note.body} />}
                  actions={
                    <Actions
                      noNotes={false}
                      isDraft={note.is_draft}
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
              ))}
            </List.Section>
          )}
          <List.Section title="Notes">
            {published.map((note, index) => (
              <List.Item
                key={index}
                title={note.title}
                detail={<List.Item.Detail markdown={note.body} />}
                actions={
                  <Actions
                    noNotes={false}
                    isDraft={note.is_draft}
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
            ))}
          </List.Section>
        </>
      )}
    </List>
  );
}
