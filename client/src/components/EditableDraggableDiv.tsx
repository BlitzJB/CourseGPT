import { useState } from "react"

export const EditableDraggableDiv = ({ value, onChange, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isHovering, setIsHovering] = useState(false)
    const [currentValue, setCurrentValue] = useState(value);

    const handleBlur = () => {
        onChange(currentValue);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        setCurrentValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
    }

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete();
    };

    return isEditing ? (
        <input 
            type="text" 
            value={currentValue}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className='w-full'
            autoFocus
        />
    ) : (
        <div onClick={() => setIsEditing(true)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='relative cursor-grab min-h-8'>
            <span hidden={!isHovering} className='px-2 py-[1px] rounded-md border-neutral-300 border cursor-pointer absolute right-0 top-[-2px] bg-white'>Edit</span>
            <span hidden={!isHovering} className='px-2 py-[1px] rounded-md border-neutral-300 border cursor-pointer absolute right-[50px] top-[-2px] bg-white' onClick={handleDeleteClick}>Delete</span>
            {value}
        </div>
    );
};