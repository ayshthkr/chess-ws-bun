import {Room} from "./room.ts";
import {z} from "zod";

let roomsList: Room[] = [];

const MessageTypes = z.enum(['init']);

const server = Bun.serve<{ socketId: number }>({
    fetch(req, server) {
        const success = server.upgrade(req, {
            data: {
                socketId: Math.random()
            },
        });
        if(success) return undefined;
    },
    websocket: {
        open(ws) {
            ws.send('Welcome from the chess server');
        },
        message(ws, message) {
            if(message.toString().trim() == 'init') {
                const lastRoom = roomsList.at(roomsList.length - 1);
                if(!lastRoom || lastRoom.roomType == 'full') {
                    // Creating a new room when no other rooms exists
                    const newRoom = new Room(Math.random(), ws.data.socketId);
                    const newRoomID = newRoom.getID();
                    // Subscribing  the user to the room
                    ws.subscribe(newRoomID);
                    ws.publish(newRoomID, 'Created a room. Waiting for a person');
                    roomsList.push(newRoom);
                } else {
                    // Adding the member to the last room
                    lastRoom.addMember(ws.data.socketId);
                    const lastRoomID = lastRoom.getID();
                    ws.subscribe(lastRoomID);
                    server.publish(lastRoomID, 'Starting the game');
                    const color = lastRoom.getColor(ws.data.socketId)
                    ws.send('You are ' + color);
                    ws.publish(lastRoomID, 'You are ' + (color == 'w' ? 'b' : 'w'));
                }
            } else if(message.toString().startsWith('move')) {
                
                let ms = message.toString().trim().split(' ');
                const from = ms[1], to = ms[2];
                
                // Find the room with the member who sent the msg
                const room = roomsList.find(room => room.hasMember(ws.data.socketId));
                if(!room) throw new Error('Room not found');

                // Check whether it is that person's move
                const validMove = ((room.movesList.length % 2 == 0) ? room.white : room.black) == ws.data.socketId;
                if(!validMove) {
                    ws.send( 'Not your move');
                    return;
                }
                room.move(from, to);
                ws.publish(room.getID(), `move ${from}-${to}`);
                // server.publish(room.getID(), room.getBoard() ?? "asd");

                // Check for game over
                if(room.isGameOver()) {
                    server.publish(room.getID(), 'Game ended');
                    roomsList = roomsList.filter(_room => _room.id != room.id);
                }
            } else {
                ws.send('Invalid code');
            }
        },
        close(ws) {
            const room = roomsList.find(room => room.hasMember(ws.data.socketId));
            if(room) {
                server.publish(room.getID(), 'Opponent has left the game');
                roomsList = roomsList.filter(_room => _room.id != room.id);
            }
        }
    }
});
