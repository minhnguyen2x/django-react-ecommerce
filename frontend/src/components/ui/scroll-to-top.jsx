import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export function ScrollToTop() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!showScrollTop) return null;

    return (
        <Button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 shadow-lg hover:opacity-90"
            style={{ backgroundColor: 'rgb(37, 99, 235)' }}
            size="icon"
        >
            <FaArrowUp className="text-lg" />
        </Button>
    );
}
