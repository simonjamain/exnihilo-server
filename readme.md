# exNihilo game server

## Intall

run ```npm install```

The server can be launch as a deamon by using forever, if you wish to do so and you don't have forever installed you can run ```npm install forever -g```.

## Start

You can simply start the server by running ```npm run start``` (usefull for dev)

OR

If you want it to run indefinitely with forever, start the server with ```sudo npm run start-forever``` (usefull for "production")

## Port

Default port is 3000, you can change the server port by specifying it at the end of start command like :
```npm run start 80``` OR ```npm run start-forever 80```
