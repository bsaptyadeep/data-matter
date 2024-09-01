import React, { useRef, useEffect } from 'react';
import css from "./styles.module.css";

interface AutoScrollBottomProps {
    children: React.ReactNode;
}

const AutoScrollBottom: React.FC<AutoScrollBottomProps> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [children]);

    return <div className={css.autoScrollBottomContainer} ref={containerRef}>
        {children}
        </div>;
};

export default AutoScrollBottom;