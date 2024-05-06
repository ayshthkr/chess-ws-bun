import {useEffect, useState} from "react";
import {Chessboard} from "react-chessboard";
import {Chess, Move, Square} from "chess.js";
import {useNavigate} from "react-router-dom";
import {useSocket} from "../hooks/useSocket.tsx";

function Game() {
    const [game, setGame] = useState(new Chess());
    const [white, setWhite] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const [moves, setMoves] = useState<Move[]>([]);
    const [newMove, setNewMove] = useState<boolean>(false);
    const socket = useSocket();

    useEffect(() => {
        if(!socket) return;

        socket.onmessage = (message) => {
            if(message.data.toString().startsWith('You are')) {
                const side = message.data.toString().split(' ')[2];
                setWhite(side == 'w' ? true : false);
            } else if(message.data.toString().startsWith('move ')) {
                const from_to: string = message.data.toString().split(' ')[1];
                const f = from_to.split('-');
                const from = f[0] as Square, to = f[1] as Square;
                const gameCopy = {...game};
                const move = gameCopy.move({
                    from,to
                });
                if(!move) console.error('Some error');
                setGame(gameCopy);
            } else if(message.data.toString() == 'Opponent has left the game') {
                alert('Opponent has left the game');
                socket.close();
                navigate('/');
            } else if(message.data.toString() == 'Game ended') {
                alert('Game ended');
                navigate('/');
            } else {
                console.log(message);
            }
        };

        if(newMove) {
            console.log('new');
            const move = moves[moves.length - 1];
            socket.send(`move ${move.from} ${move.to}`);
            setNewMove(false);
        }
    }, [moves, game, newMove, socket]);

    function onDrop(sourceSquare: Square, targetSquare: Square, piece: any) {
        const gameCopy = { ...game };
        const move = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: piece[1].toLowerCase() ?? "q",
        });
        setGame(gameCopy);

        // illegal move
        if (move === null) return false;

        setMoves(_old => [..._old, move]);
        setNewMove(true);

        return true;
    }

    return (
        <div id='board'>
            <div style={{padding: '10px'}}>
                {white == null ? "Waiting for another player" : "Game started"}
            </div>
            <Chessboard
                id="PLAY"
                position={game.fen()}
                onPieceDrop={onDrop}
                customBoardStyle={{
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
                boardOrientation={white || white == null ? 'white' : 'black'}
            />
            <div style={{padding: '10px'}}>
                <button onClick={() => navigate('/')}>Leave</button>
            </div>
        </div>
    );
}

export default Game;