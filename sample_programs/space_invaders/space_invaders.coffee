
scene = new Scene
gameLoop = new GameLoop
keys = new KeyManager
collisions = new CollisionManager(scene)

enemies = new Sprite y:50
enemy1 = new Square(x:50,y:0,width:40,xVelocity:.1,yVelocity:0,fill:"red")
enemy2 = new Square(x:125,y:0,width:40,xVelocity:.1,yVelocity:0)
enemy3 = new Square(x:200,y:0,width:40,xVelocity:.1,yVelocity:0,fill:"yellow")
enemy4 = new Square(x:275,y:0,width:40,xVelocity:.1,yVelocity:0)
enemy5 = new Square(x:350,y:0,width:40,xVelocity:.1,yVelocity:0,fill:"blue")
enemy6 = new Square(x:100,y:50,width:40,xVelocity:.1,yVelocity:0)
enemy7 = new Square(x:175,y:50,width:40,xVelocity:.1,yVelocity:0,fill:"black")
enemy8 = new Square(x:250,y:50,width:40,xVelocity:.1,yVelocity:0)
enemy9 = new Square(x:325,y:50,width:40,xVelocity:.1,yVelocity:0,fill:"green")
enemy10 = new Square(x:50,y:100,width:40,xVelocity:.1,yVelocity:0,fill:"orange")
enemy11 = new Square(x:125,y:100,width:40,xVelocity:.1,yVelocity:0)
enemy12 = new Square(x:175,y:100,width:40,xVelocity:.1,yVelocity:0,fill:"pink")
enemy13 = new Square(x:250,y:100,width:40,xVelocity:.1,yVelocity:0)
enemy14 = new Square(x:325,y:100,width:40,xVelocity:.1,yVelocity:0,fill:"purple")
gun = new Triangle(lineWidth:0.2,width:20,height:30,x:200,y:200,alpha:0.4,fill:"yellow",lineWidth:1,xVelocity:0,yVelocity:0,y:380)
shot = new Circle(radius:5,lineWidth:2,x:-20,y:-20)

row1Enemies = [enemy1,enemy2,enemy3,enemy4,enemy5]
row2Enemies = [enemy6,enemy7,enemy8,enemy9]
row3Enemies = [enemy10,enemy11,enemy12,enemy13,enemy14]
scene.makeChild(enemies,enemy) for enemy in row1Enemies
scene.makeChild(enemies,enemy) for enemy in row2Enemies
scene.makeChild(enemies,enemy) for enemy in row3Enemies
scene.addSprites(gun,enemies,shot)


tween1 = new Tween(attribute:"rotation",ease:None.easeNone,from:0,to:6.28,duration:5900,yoyo:true)
tween2 = new Tween(attribute:"alpha",ease:None.easeNone,from:0.1,to:1,duration:5900,yoyo:true)
tween3 = new Tween(attribute:"rotation",ease:None.easeNone,from:1,to:0.1,duration:5900,yoyo:true)
tween4 = new Tween(attribute:"rotation",ease:Bounce.easeInOut,from:0,to:6.28,duration:5900,yoyo:true)


animations =
changeVelocity:()->
  if @adjustedY < 350
    @xVelocity = @xVelocity*-1
    @move(10*@xVelocity,.5+@y/100)
  else
    alert "You Lost!"
bloop:()->
    shot.moveTo(@x,@y-@height/2-20)
    shot.yVelocity = -.6
splode:()->
    scene.removeChild(enemies,this)
include(animations,Sprite)


gun.addEvent(type:keys,action:"keydown",code:37,toDo:f=->gun.move -.5,0)
gun.addEvent(type:keys,action:"keydown",code:39,toDo:f=->gun.move .5,0)
gun.addEvent(type:keys,action:"keydown",code:38,toDo:f=->gun.bloop())

for enemy in row1Enemies
  do(enemy)->
    enemy.addEvent(type:collisions,objectType:Circle,toDo:f=->enemy.splode())
    enemy.addEvent(type:collisions,objectType:"boundary",toDo:f=->enemy.changeVelocity())
    enemy.addAnimation tween1

for enemy in row2Enemies
  do(enemy)->
    enemy.addEvent(type:collisions,objectType:Circle,toDo:f=->enemy.splode())
    enemy.addEvent(type:collisions,objectType:"boundary",toDo:f=->enemy.changeVelocity())
    enemy.addAnimation tween2
    enemy.addAnimation tween3

for enemy in row3Enemies
  do(enemy)->
    enemy.addEvent(type:collisions,objectType:Circle,toDo:f=->enemy.splode())
    enemy.addEvent(type:collisions,objectType:"boundary",toDo:f=->enemy.changeVelocity())
    enemy.addAnimation tween4


