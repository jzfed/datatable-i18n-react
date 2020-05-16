import React, { useState, useRef, useEffect } from 'react';
import { CLASS_PREFIX } from '../../common/js/constant';
import './input.scss';

export const Input = React.memo((props) => {

    const {
        val,
        isInput,
        inputClass,
        placeHolderClass,
        onPlaceHolderBlur,
        onPlaceholderClick,
        onPlaceholderDoubleClick,
        onPlaceholderMouseout,
        onEnterPress,
        onInputBlur,
        onInputFocus,
        onValueChange,
        selected,
    } = props;

    const [inputValue, setInputValue] = useState(val || '');
    const [tabIndex, setTabindex] = useState(-1);
    const inputEl = useRef(null);
    const placeHolderEl = useRef(null);

    const handlePlaceHolderClick = () => {
        setTabindex(0);
        onPlaceholderClick && onPlaceholderClick(inputEl.current);
    }

    const handlePlaceHolderBlur = () => {
        setTabindex(-1);
        onPlaceHolderBlur && onPlaceHolderBlur();

    }

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
        <div className={`${CLASS_PREFIX}input-wrapper`}>
            {isInput
                ? <input ref={inputEl} type="text" value={inputValue} onFocus={handleInputFocus} onChange={handleChange} onKeyDown={handleEnterPress} onBlur={handleInputBlur} className={inputClass} />
                : <div
                    ref={placeHolderEl}
                    className={selected ? 'placeholder-text selected' : 'placeholder-text'}
                    onClick={handlePlaceHolderClick}
                    onMouseOut={onPlaceholderMouseout}
                    onDoubleClick={handlePlaceholderDoubleClick}
                    onBlur={handlePlaceHolderBlur}
                    tabIndex={tabIndex}
                >
                    {val}
                </div>
            }
        </div>
    );
});
