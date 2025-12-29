import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';

const EditableText = ({ 
  contentKey, 
  children,
  getText,
  onUpdate, 
  className = '', 
  as = 'p',
  multiline = false 
}) => {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(children || '');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  
  // Get role from profile or user metadata
  const userRole = profile?.role || user?.user_metadata?.role || null;
  const isAdmin = userRole === 'admin';

  // Update value when children changes (from dynamic content)
  useEffect(() => {
    if (!isEditing) {
      const currentText = getText ? getText(contentKey, children) : children;
      setValue(currentText || '');
    }
  }, [children, getText, contentKey, isEditing]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value.trim() === children?.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      const result = await onUpdate(contentKey, value);
      console.log('Content saved:', { contentKey, value, result });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
      setValue(children);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(children);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isAdmin) {
    const Component = as;
    return <Component className={className}>{children}</Component>;
  }

  if (isEditing) {
    return (
      <div className="w-full">
        {multiline ? (
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} w-full px-4 py-3 border-2 border-accent rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-secondary bg-white text-sophisticated-dark`}
            rows={Math.ceil(value.length / 50)}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className={`${className} w-full px-4 py-3 border-2 border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white text-sophisticated-dark`}
          />
        )}

        {/* Save/Cancel buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs px-3 py-1 bg-accent text-white rounded hover:bg-accent/80 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleCancel}
            className="text-xs px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const Component = as;
  return (
    <div className="relative inline-block group w-full">
      <div className="flex items-center gap-2">
        <Component className={className}>
          {children}
        </Component>
        
        {/* Edit button - small pencil icon that appears next to text */}
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 p-1.5 text-accent hover:text-accent/70"
          title="Click to edit"
          aria-label="Edit content"
        >
          <Icon name="Pencil" size={16} />
        </button>
      </div>
    </div>
  );
};

export default EditableText;
