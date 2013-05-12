scene = new Scene
gameLoop = new GameLoop
keys = new KeyManager
collisions = new CollisionManager(scene)

#Edit Me#

square1 = new Star(x:200,y:200,radius:10)
square2 = new Star(x:100,y:200,radius:10,xVelocity:.1,yVelocity:.3)
b1 = new Star(x:100,y:200,radius:20,xVelocity:-.2,yVelocity:.3)

tween = new Tween(attribute:"x",from:100,to:178)

scene.addSprites(square1,b1,square2)
#square2.addAnimation(tween)

test = (o)->
  #console.log o.xVelocity 
  #console.log o.yVelocity
  
  if o.y > 350 or o.y < 40
    o.yVelocity = o.yVelocity*-1
  if o.x >= 650 or o.x <=40
    o.xVelocity = o.xVelocity*-1
  #console.log o.xVelocity 
  #console.log o.yVelocity

stop = (o)->
  o.xVelocity = 0
  o.yVelocity = 0

test2 = (o)->
  console.log "moo"
  square2.xVelocity=-.1
  

#square2.addEvent(type:collisions,detail:true,toDo:f=->test2(square2))
square2.addEvent(type:collisions,detail:true,objectType:"boundary",toDo:f=->test(square2))
b1.addEvent(type:collisions,detail:true,objectType:"boundary",toDo:f=->test(b1))


