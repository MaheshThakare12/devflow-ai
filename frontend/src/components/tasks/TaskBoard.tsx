'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task } from '@/types';
import { TaskCard } from './TaskCard';
import { useReorderTasks } from '@/hooks/useTasks';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-600' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-primary' },
  { id: 'done', title: 'Done', color: 'bg-success' }
];

export function TaskBoard({ tasks, projectId }: { tasks: Task[], projectId: string }) {
  const [boardData, setBoardData] = useState<Record<string, Task[]>>({ 'todo': [], 'in-progress': [], 'done': [] });
  const reorderMutation = useReorderTasks();

  useEffect(() => {
    const newData: Record<string, Task[]> = { 'todo': [], 'in-progress': [], 'done': [] };
    tasks.forEach(task => {
      if (newData[task.status]) newData[task.status].push(task);
    });
    
    Object.keys(newData).forEach(key => {
      newData[key].sort((a, b) => a.order - b.order);
    });
    
    setBoardData(newData);
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    
    const newBoard = { ...boardData };
    const sourceList = [...newBoard[sourceCol]];
    const destList = sourceCol === destCol ? sourceList : [...newBoard[destCol]];

    const [moved] = sourceList.splice(source.index, 1);
    moved.status = destCol as any;
    destList.splice(destination.index, 0, moved);

    newBoard[sourceCol] = sourceList;
    if (sourceCol !== destCol) newBoard[destCol] = destList;

    sourceList.forEach((t, i) => t.order = i);
    if (sourceCol !== destCol) destList.forEach((t, i) => t.order = i);

    setBoardData(newBoard);

    const updates = [
      ...sourceList.map(t => ({ id: t._id, status: t.status, order: t.order })),
      ...(sourceCol !== destCol ? destList.map(t => ({ id: t._id, status: t.status, order: t.order })) : [])
    ];

    reorderMutation.mutate({ projectId, updates });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-1 min-w-[300px] max-w-[400px] flex flex-col bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                <h3 className="font-semibold">{col.title}</h3>
              </div>
              <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-medium text-slate-300">
                {boardData[col.id]?.length || 0}
              </span>
            </div>
            
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3 transition-colors ${snapshot.isDraggingOver ? 'bg-white/5' : ''}`}
                >
                  {boardData[col.id]?.map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                          className={snapshot.isDragging ? 'z-50 opacity-90' : ''}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
