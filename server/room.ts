import {z} from "zod";
import { Chess } from 'chess.js'

const RoomTypes = z.enum(['waiting', 'full']);

type MoveList = {
    from: string;
    to: string;
}

export class Room {
    public id: number;
    public roomType: z.infer<typeof RoomTypes>;
    public member1: number;
    public member2: number;
    public chess: Chess | null;
    public white: number | null;
    public black: number | null;
    public movesList: MoveList[];
    constructor(id: number, member1: number) {
        this.id = id;
        this.roomType = 'waiting';
        this.member1 = member1;
        this.member2 = 0;
        this.chess = null;
        this.white = null;
        this.black = null;
        this.movesList = [];
    }

    addMember(id: number) {
        this.member2 = id;
        this.roomType = 'full';
        this.startGame();
    }

    getID() {
        return `${this.id}`
    }

    hasMember(id: number) {
        return this.member1 == id || this.member2 == id;
    }

    exists() {
        if(!this.chess) throw new Error('No match found');
        else return;
    }

    startGame() {
        this.chess = new Chess();
        this.white = Math.random() % 2 == 0 ? this.member1 : this.member2;
        this.black = this.white == this.member1 ? this.member2 : this.member1;
    }

    getBoard() {
        return this.chess?.ascii();
    }

    getColor(id: number) {
        return this.white == id ? 'w' : 'b';
    }

    move(from: string, to: string) {
        try {
            this.chess?.move({from, to});
            this.movesList.push({
                from, to
            });
        } catch (e) {
            console.error(e);
        }
    }

    isGameOver() {
        return this.chess?.isGameOver();
    }
}