import { HiOutlinePencilSquare as Edit } from "react-icons/hi2";
import { RxDragHandleDots2 as Drag } from "react-icons/rx";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/utils/cn";
import {
  useState,
  useRef,
  type ComponentProps,
  useEffect,
  type HTMLAttributes,
  forwardRef,
} from "react";
import { api } from "@/utils/api";
import { IconButton } from "../ui/icon-button";
import { HiXMark as Close } from "react-icons/hi2";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import { Card } from "../ui/card";
import { Button } from "../ui/button/Index";

type Task = inferProcedureOutput<AppRouter["todo"]["getAllTodos"]>[number];

type CardItemProps = ComponentProps<"div"> & {
  task: Task;
  overlay?: boolean;
  active?: boolean;
  attributes?: Partial<HTMLAttributes<HTMLDivElement>>;
  listeners?: Partial<HTMLAttributes<HTMLDivElement>>;
  insertPosition?: "before" | "after";
};
export const CardItem = forwardRef<HTMLDivElement, CardItemProps>(
  (props, ref) => {
    const { task, attributes, listeners, active, insertPosition } = props;
    const utils = api.useContext();
    const [editing, setEditing] = useState<boolean>(false);
    const [taskName, setEditTask] = useState<string>(task.task);
    const [isCompleted, setIsCompleted] = useState<boolean>(task.completed);
    const inputRef = useRef<HTMLInputElement>(null);
    const insertBefore =
      "before:content-[''] before:absolute before:bg-gray-200 before:rounded-full";
    const insertAfter = "";

    const deleteTask = api.todo.deleteTodo.useMutation({
      async onMutate() {
        await utils.todo.getAllTodos.cancel();
        const allTasks = utils.todo.getAllTodos.getData({
          userId: task.ownerId,
        });
        // if there is no data, stop. don't bother continue the function
        if (!allTasks) return;
        utils.todo.getAllTodos.setData(
          {
            userId: task.ownerId,
          },
          allTasks.filter((t) => t.id !== task.id),
        );
      },
      async onSuccess() {
        await utils.todo.invalidate();
      },
    });

    const editTask = api.todo.updateTodo.useMutation({
      async onMutate(input) {
        await utils.todo.getAllTodos.cancel({ userId: task.ownerId });
        const allTasks = utils.todo.getAllTodos.getData({
          userId: task.ownerId,
        });

        if (!allTasks) return;
        utils.todo.getAllTodos.setData(
          {
            userId: task.ownerId,
          },
          allTasks.map((t) =>
            t.id === input.id ? { ...t, ...input.data } : t,
          ),
        );
      },
      async onSuccess() {
        await utils.todo.invalidate();
        setEditing(false);
        setEditTask(task.task);
      },
    });

    useEffect(() => {
      if (inputRef.current && editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    if (active) {
      return (
        <Card
          ref={ref}
          {...attributes}
          {...listeners}
          variant="secondary"
          className="h-[74px] w-full opacity-70 md:h-[90px]"
        />
      );
    }

    return (
      <Card
        key={task.id}
        id={task.id.toString()}
        variant="secondary"
        ref={ref}
        {...attributes}
        {...listeners}
        className={cn("group relative z-0 flex flex-col gap-4", {
          "opacity-30": active,
          "before:absolute before:-top-3 before:left-0 before:right-0 before:h-1 before:rounded-full before:bg-primary-200 before:content-['']":
            insertPosition === "before",
          "after:absolute after:-bottom-3 after:left-0 after:right-0 after:h-1 after:rounded-full after:bg-primary-200 after:content-['']":
            insertPosition === "after",
        })}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox
              size="medium"
              checked={isCompleted}
              onCheck={(checked) => {
                editTask.mutate({ id: task.id, data: { completed: checked } });
                setIsCompleted(checked);
              }}
            />
            <input
              value={taskName}
              ref={inputRef}
              disabled={!editing}
              placeholder="Type something here..."
              className={cn("rounded-lg bg-secondary-500 focus:outline-none", {
                "line-through": isCompleted,
              })}
              onChange={(e) => setEditTask(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <IconButton
              icon={!editing ? <Edit size={24} /> : <Close size={24} />}
              label="edit task"
              onClick={() => setEditing((p) => !p)}
            />
            <IconButton
              icon={<Drag size={24} />}
              label="edit task"
              className="absolute right-0 top-1/2 -translate-y-1/2"
              onClick={() => setEditing((p) => !p)}
            />
          </div>
        </div>
        {editing && (
          <div className="relative z-10 flex justify-end">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  deleteTask.mutate({ id: task.id });
                }}
              >
                Delete
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  editTask.mutate({ id: task.id, data: { task: taskName } });
                }}
              >
                Save edit
              </Button>
            </div>
          </div>
        )}
      </Card>
    );
  },
);

CardItem.displayName = "CardItem";
