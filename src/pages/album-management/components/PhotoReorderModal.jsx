import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortablePhoto({ photo }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo?.id });

  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-move rounded-lg overflow-hidden border-2 border-gray-200 hover:border-indigo-400 transition-all"
    >
      <img
        src={photo?.thumbnailUrl || photo?.imageUrl}
        alt={photo?.altText || photo?.title}
        className="w-full h-32 object-cover"
      />
      <div className="absolute top-2 left-2 bg-indigo-600 text-white px-2 py-1 rounded text-xs font-semibold">
        {photo?.displayOrder + 1}
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
        <p className="text-white text-xs truncate">{photo?.title}</p>
      </div>
    </div>
  );
}

export default function PhotoReorderModal({ photos, onSave, onClose }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(photos?.sort((a, b) => a?.displayOrder - b?.displayOrder) || []);
  }, [photos]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items?.findIndex((item) => item?.id === active?.id);
        const newIndex = items?.findIndex((item) => item?.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems?.map((item, index) => ({
          ...item,
          displayOrder: index
        }));
      });
    }
  };

  const handleSave = async () => {
    const photoOrders = items?.map((item, index) => ({
      id: item?.id,
      displayOrder: index
    }));

    try {
      await onSave(photoOrders);
      onClose();
    } catch (error) {
      alert('Failed to reorder photos: ' + error?.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Reorder Photos</h2>
              <p className="text-sm text-gray-600 mt-1">Drag and drop photos to change their order</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items?.map(item => item?.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items?.map((photo) => (
                  <SortablePhoto key={photo?.id} photo={photo} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {items?.length} photos • Changes are not saved until you click "Save Order"
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}