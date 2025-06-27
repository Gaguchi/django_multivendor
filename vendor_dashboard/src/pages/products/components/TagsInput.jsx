import React, { useState, useRef, useEffect } from 'react';
import './TagsInput.css';

export default function TagsInput({ 
    value = '', 
    onChange, 
    placeholder = 'Enter tags...',
    maxTags = 10,
    suggestions = [] 
}) {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    
    // Convert comma-separated string to array
    const tags = value ? value.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // Filter suggestions based on input and existing tags
    const filteredSuggestions = suggestions.filter(suggestion => 
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(suggestion)
    );

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setShowSuggestions(newValue.length > 0 && filteredSuggestions.length > 0);
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag if input is empty and backspace is pressed
            removeTag(tags.length - 1);
        }
    };

    const addTag = (tag) => {
        if (tag && !tags.includes(tag) && tags.length < maxTags) {
            const newTags = [...tags, tag];
            onChange(newTags.join(', '));
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        onChange(newTags.join(', '));
    };

    const handleSuggestionClick = (suggestion) => {
        addTag(suggestion);
    };

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div className="tags-input-container">
            <div 
                className="tags-input-wrapper"
                onClick={handleContainerClick}
            >
                {tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                        {tag}
                        <button
                            type="button"
                            className="tag-remove"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTag(index);
                            }}
                            aria-label={`Remove ${tag} tag`}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                    className="tags-input-field"
                    onFocus={() => setShowSuggestions(inputValue.length > 0 && filteredSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
            </div>
            
            {showSuggestions && (
                <div className="tags-suggestions">
                    {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                        <div
                            key={index}
                            className="tags-suggestion-item"
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
            
            {tags.length > 0 && (
                <div className="tags-info">
                    <small className="text-muted">
                        {tags.length} tag{tags.length !== 1 ? 's' : ''} 
                        {maxTags && ` (max ${maxTags})`}
                    </small>
                </div>
            )}
        </div>
    );
}
