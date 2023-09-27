import { type AppRouter } from "@/server/api/root";
import { useSortable } from "@dnd-kit/sortable";
import { type inferProcedureOutput } from "@trpc/server";
import { CardItem } from "./CardItem";
type Task = inferProcedureOutput<AppRouter["todo"]["getAllTodos"]>[number];

export const SortableCardItem = ({
  task,
  indexNumber,
}: {
  task: Task;
  indexNumber?: number;
}) => {
  const { attributes, listeners, isDragging, index, over, setNodeRef } =
    useSortable({
      id: task.id,
      transition: {
        duration: 150, // milliseconds
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });
  return (
    <CardItem
      task={task}
      attributes={attributes}
      listeners={listeners}
      active={isDragging}
      ref={setNodeRef}
      //   determine the droppable indicator
      insertPosition={
        indexNumber !== undefined && over?.id === task.id && !isDragging
          ? index > indexNumber
            ? "after"
            : "before"
          : undefined
      }
    />
  );
};
