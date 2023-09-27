import { type Session } from "next-auth";
import { Card } from "../ui/card";
import { Button } from "../ui/button/Index";
import { api } from "@/utils/api";
import { HiPlus as Plus } from "react-icons/hi2";
import { useState, useCallback, useRef } from "react";

import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type UniqueIdentifier,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CardItem } from "./CardItem";
import { SortableCardItem } from "./SortableCardItem";

type Task = inferProcedureOutput<AppRouter["todo"]["getAllTodos"]>[number];

export const Kanban = ({ session }: { session: Session | null }) => {
  const [newTodo, setNewTodo] = useState<boolean>(false);
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [queryId, setQueryId] = useState<number>(0);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const activeIdx = activeId
    ? tasks.findIndex((task) => task.id === activeId)
    : undefined;
  const selectedPhoto = useRef<Record<string, Task>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 50, tolerance: 10 },
    }),
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 10 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const {
    data: todo,
    isSuccess,
    refetch: refetchAllTodos,
  } = api.todo.getAllTodos.useQuery(
    {
      userId: session!.user.id,
    },
    {
      enabled: !!session,
      onSuccess(data) {
        setTasks(data);
      },
    },
  );
  const utils = api.useContext();
  const addTask = api.todo.addTodo.useMutation({
    async onMutate(input) {
      // optimistic update on adding the task
      await utils.todo.getAllTodos.cancel();
      const prevData = todo ?? [];
      utils.todo.getAllTodos.setData(
        {
          userId: session!.user.id,
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => [...prevData, input],
      );
    },
    async onSuccess() {
      setNewTodo(false);
      setTask("");
      await utils.todo.invalidate();
    },
  });

  const orderTodo = api.todo.orderTodo.useMutation({
    async onSuccess() {
      await refetchAllTodos();
    },
  });
  const { refetch: refetchGetTask } = api.todo.getTaskById.useQuery(
    {
      id: queryId,
    },
    {
      enabled: !!tasks,
      refetchOnWindowFocus: false,
    },
  );

  const orderChangeRequest = useCallback(
    async (id: number, newIdx: number, movedArray: Task[]) => {
      let prevIndexNumber = 0;
      let nextIndexNumber = 0;

      if (movedArray[newIdx - 1] !== undefined) {
        const prevId = movedArray[newIdx - 1]!.id;
        setQueryId(prevId);
        await refetchGetTask().then((data) => {
          if (data.data) {
            prevIndexNumber = data.data.indexNumber;
          }
        });
      }
      if (movedArray[newIdx + 1] !== undefined) {
        const nextId = movedArray[newIdx + 1]!.id;
        setQueryId(nextId);
        await refetchGetTask().then((data) => {
          if (data.data) {
            nextIndexNumber = data.data.indexNumber;
          }
        });
      }
      orderTodo.mutate({
        id: id,
        prevTaskIndexNumber: prevIndexNumber,
        nextTaskIndexNumber: nextIndexNumber,
      });
    },
    [orderTodo, refetchGetTask],
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => setActiveId(active.id),
    [],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      let newIdx = 0;
      let movedArray = [
        {
          id: 0,
          createdAt: new Date(),
          task: "",
          indexNumber: 0,
          ownerId: "",
          completed: false,
        },
      ];
      if (over && active.id !== over.id) {
        setTasks((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          movedArray = arrayMove(items, oldIndex, newIndex);
          newIdx = newIndex;
          return movedArray;
        });
        void orderChangeRequest(
          parseInt(active.id as string),
          newIdx,
          movedArray,
        );
      }
    },
    [orderChangeRequest],
  );

  const RenderCard = useCallback(
    ({ ...props }: Task) => {
      selectedPhoto.current[props.id] = props;
      return (
        <SortableCardItem task={props} key={props.id} indexNumber={activeIdx} />
      );
    },
    [activeIdx],
  );

  return (
    <Card className="flex max-w-lg flex-col gap-4" variant="simple">
      <h1 className="text-xl font-semibold">Todo list</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={tasks?.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          {isSuccess && tasks && tasks.length > 0 && (
            <div className="space-y-4">
              {tasks.map((task) => {
                return RenderCard(task);
              })}
            </div>
          )}
        </SortableContext>
        <DragOverlay>
          {activeId && <CardItem task={selectedPhoto.current[activeId]!} />}
        </DragOverlay>
      </DndContext>
      {isSuccess && tasks && !tasks.length && !newTodo && (
        <>you are done for the day</>
      )}
      {newTodo && (
        <Card className="group flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <input
              className="w-full rounded-lg py-1 ring-0 focus:outline-none focus:ring-0"
              placeholder="Type something here..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setNewTodo(false);
                  setTask("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  const indexNumber = todo?.[todo.length - 1]?.indexNumber ?? 0;
                  addTask.mutate({
                    ownerId: session!.user.id,
                    task: task,
                    indexNumber: 1024 + indexNumber,
                  });
                }}
              >
                Add task
              </Button>
            </div>
          </div>
        </Card>
      )}
      <Button
        iconLeft={<Plus />}
        variant="outlined-primary"
        onClick={() => setNewTodo(true)}
      >
        Add todo
      </Button>
    </Card>
  );
};
