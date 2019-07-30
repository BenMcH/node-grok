# Node-grok

This project's goal is to create a bridge between a secured network and the outside world in which TCP connections can be made, similar to ngrok.

The original inspriation for the project was simply wanting a self-hosted version of ngrok so that personal data does not have to travel through an unknown server.

## How it works

The principal behind how node-grok works is very simple, luckily! The server listens for websocket connections using Socket.io. When the server receives a connection,
it chooses a random port in the 203XX range and opens a TCP server and echos this information back to the client. Note: The server does not know or care what port the
end application is listening on. It is entirely up to the client to forward these connections to the right port once a websocket event has been received.

Simultaneous connections are made possible by making the server generate a random transaction id when it receives a connection on the port it has opened. This
transaction id is then managed on the client-side to make sure that all traffic is sent to the appropriate socket that has been opened.

## Usage

_TODO: Document usage, make more versatile_
