import React, { useState, useRef, useEffect } from 'react';
import './input.scss';

export const Input = React.memo((props) => {

    const {
        val,
        isInput,
        onPlaceholderClick,
        onPlaceholderDoubleClick,
        onEnterPress,
        onInputBlur,
        onInputFocus,
        onValueChange,
        selected,
    } = props;

    const [inputValue, setInputValue] = useState(val || '');
    const inputEl = useRef(null);
    const placeHolderEl = useRef(null);

    const handlePlaceholderDoubleClick = () => {
        onPlaceholderDoubleClick && onPlaceholderDoubleClick(inputEl.current);
    }

    const handleChange = (e) => {
        const value = e.currentTarget.value;
        setInputValue(value);
        onValueChange(value);
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            onEnterPress && onEnterPress(inputValue);
        }
    }

    const handleInputFocus = () => {
        if (isInput) onInputFocus && onInputFocus(inputEl.current);
    }

    const handleInputBlur = () => {
        onInputBlur && onInputBlur(inputEl.current);
    }

    useEffect(() => {
        if (isInput) {
            inputEl.current.focus();
        } else {
            setInputValue(val);
        }
    }, [isInput, val])

    return (
        <div className="input-wrapper">
            {isInput
                ? <input ref={inputEl} type="text" value={inputValue} onFocus={handleInputFocus} onChange={handleChange} onKeyDown={handleEnterPress} onBlur={handleInputBlur} />
                : <div
                    ref={placeHolderEl}
                    className={selected ? 'placeholder-text selected' : 'placeholder-text'}
                    onClick={onPlaceholderClick}
                    onDoubleClick={handlePlaceholderDoubleClick}
                >
                    {val}
                </div>
            }
        </div>
    );
});
