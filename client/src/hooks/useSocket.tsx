import {useEffect, useState} from "react";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            setSocket(ws);
            ws.send('init');
        }

        ws.onclose = () => setSocket(null);

        return () => {
            ws.close();
        }
    }, []);

    return socket;
}