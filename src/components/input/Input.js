import React, { useState, useRef, useEffect } from 'react';
import './input.scss';

export const Input = React.memo((props) => {

    const {
        val,
        onSave,
        onPlaceholderClick,
        inputMode,
        selected,
    } = props;

    const [isInput, setViewAsInput] = useState(false);
    const [inputValue, setInputValue] = useState(val);
    // const [placeholderSelected, setPlaceholderSelected] = useState();
    const inputEl = useRef(null);
    const placeHolderEl = useRef(null);
    // const [textWidth, setInputWidth] = useState(0);

    const handlePlaceholderDoubleClick = () => {
        if (!isInput) {
            // const width = placeHolderEl.current.offsetWidth;
            // setInputWidth(width); //style={{ width: `${textWidth}px` }}
            // setPlaceholderSelected(false);
            setViewAsInput(true);
        }
    }

    const handleChange = (e) => {
        setInputValue(e.currentTarget.value);
    }

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    }

    const handleSave = () => {
        if (inputValue !== val) {
            if (onSave) {
                const isSaveUpdate = onSave(inputValue);
                if (!isSaveUpdate) {
                    setInputValue(val);
                }
            }
        }
        if (isInput) setViewAsInput(false);
    }

    useEffect(() => {
        if (isInput) {
            // setPlaceholderSelected(false);
            inputEl.current.focus();
        }
        return () => {

        }
    }, [isInput])

    return (
        <div className="input-wrapper">
            {isInput
                ? <input ref={inputEl} type="text" value={inputValue} onChange={handleChange} onKeyDown={handleEnterPress} onBlur={handleSave} />
                : <div ref={placeHolderEl} className={selected ? 'placeholder-text selected' : 'placeholder-text'} onClick={onPlaceholderClick} onDoubleClick={handlePlaceholderDoubleClick}>{inputValue}</div>
            }
        </div>
    );
});