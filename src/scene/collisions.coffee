class CollisionManager
  constructor: (scene) ->
    @checkCollision = []
    @collided = []
    @typesToTest = {}
    @scene = scene
    @detail = false
    
  #new function for setting the detail from generate points 
  turnOnDetail: () ->
    @detail = true
    
  onUpdate: (event) ->
    for sprite in @checkCollision 
      @runCollisionDetection(sprite)
    for sprite in @collided
      from = sprite.o1
      collisionEvent = {type:"collision",keyCode:sprite.o2}
      from.receiveCollisionEvent(sprite.o2)
    @collided = []
    
  observe: (sprite) ->
    @checkCollision.push sprite if sprite not in @checkCollision
  
  unObserve:(sprite)->
    index = @checkCollision.indexOf(sprite)
    @checkCollision.splice(index,1)    
   
  addTypeToTest: (sprite,type)->
    if @typesToTest.sprite
      @typesToTest.sprite.push(type) 
    else
      @typesToTest.sprite = [type]
   
  pixelByPixel:(xMax,xMin,yMax,yMin,o1,o2)->
    xDiff = xMax - xMin
    yDiff = yMax - yMin 
    canvas = document.getElementById "myCanvas"
    canvas2 = document.createElement('canvas')
    canvas2.width = canvas.width
    canvas2.height = canvas.height
    tempContext = canvas2.getContext('2d')
    o1.runDrawing2(tempContext)
    imgData1 = tempContext.getImageData(xMin,yMin,xDiff,yDiff)
    pixels1 = imgData1.data
    tempContext.clearRect(0,0,canvas2.width,canvas2.height)
    o2.runDrawing(tempContext)
    imgData2 = tempContext.getImageData(xMin,yMin,xDiff,yDiff)
    pixels2 = imgData2.data
    for pixel1 in pixels1 by 3
      for pixel2 in pixels2 by 3
        if pixel1 > 0 and pixel2 > 0
          if @detail is true
            @generatePoints(xDiff,yDiff,xMin,yMin,o1,o2)
            return true
          else
            return true
    return false   
    
  detectCollisions:(o1,o2)->
    side1 = Math.max(o1.width+(2*o1.lineWidth),o1.height+(2*o1.lineWidth))
    side2 = Math.max(o2.width+(2*o2.lineWidth),o2.height+(2*o2.lineWidth))
    x = Math.round(o1.adjustedX)+(o1.lineWidth)
    y = Math.round(o1.adjustedY)+(o1.lineWidth)
    x2 = Math.round(o2.adjustedX)+(o2.lineWidth)
    y2 = Math.round(o2.adjustedY)+(o2.lineWidth)
    x -= (side1/2 + 0.5) << 0#x -= (o1.width/2 + 0.5) << 0
    y -= (side1/2 + 0.5) << 0#y -= (o1.height/2 + 0.5) << 0
    x2 -= (side2/2 + 0.5) << 0 #x2 -= (o2.width/2 + 0.5) << 0
    y2 -= (side2/2 + 0.5) << 0 #y2 -= (o2.height/2 + 0.5) << 0
    xMin = Math.max(x,x2)
    yMin = Math.max(y,y2)
    xMax = Math.min(x+o1.width,x2+o2.width+o1.lineWidth+o2.lineWidth)
    yMax = Math.min(y+o1.height,y2+o2.height+o1.lineWidth+o2.lineWidth)
    if(xMin >= xMax) or (yMin >= yMax)
      return false
    else #pixel-by-pixel
      @pixelByPixel(xMax,xMin,yMax,yMin,o1,o2)
  notOnCanvas:(sprite)->
    canvasObject = new Rectangle(x:scene.canvasWidth/2,y:scene.canvasHeight/2,width:scene.canvasWidth,height:scene.canvasHeight)  
    opposite = @detectCollisions(sprite,canvasObject)    
    return true if opposite is false
    return false if opposite is true 
    
  
    
 
  detectAtTime:(xDiff,yDiff,xMin,yMin,o1,o2,moment)->
    canvas = document.getElementById "myCanvas"
    w = xDiff - xMin
    h = yDiff - yMin
    tempCanvas = document.createElement "canvas"
    tempCanvas.width = 500#canvas.width
    tempCanvas.height = 500#canvas.height 
    tempContext = tempCanvas.getContext "2d"
    tempContext.save()
    o1.setupCanvas(tempContext)
    tempContext.translate((o1.adjustedX-o1.delta.x)*moment,(o1.adjustedY-o1.delta.y)*moment) 
    tempContext.rotate((o1.rotation-o1.delta.rotation)*moment)
    o1.draw(tempContext)
    imgData1 = tempContext.getImageData(xMin,yMin,xDiff,yDiff)
    pixels1 = imgData1.data
    tempContext.restore()
    tempContext.clearRect(0,0,500,500)
    o2.setupCanvas(tempContext)
    tempContext.rotate((o1.rotation-o1.delta.rotation)*moment)
    tempContext.translate((o2.adjustedX-o2.delta.x)*moment,(o2.adjustedY-o2.delta.y)*moment)
    o2.draw(tempContext)
    imgData2 = tempContext.getImageData(xMin,yMin,xDiff,yDiff)
    pixels2 = imgData2.data
    return {pixels1:pixels1,pixels2:pixels2}
    
    
  collidesAtTime:(xDiff,yDiff,xMin,yMin,o1,o2,moment)->
    pixels = @detectAtTime(xDiff,yDiff,xMin,yMin,o1,o2,moment)
    for pixel1 in pixels.pixels1 by 3
      for pixel2 in pixels.pixels2 by 3
        if pixel1 > 0 and pixel2 > 0
          return true
    return false   
    
  makePointsList:(xDiff,yDiff,xMin,yMin,o1,o2,moment)->
    list = []
    pixels = @detectAtTime(xDiff,yDiff,xMin,yMin,o1,o2,moment)
    x = 0
    y = 0
    for pixel1 in pixels.pixels1 by 3
      for pixel2 in pixels.pixels2 by 3
        if x >= xDiff 
          x = 0
          y = y + 1
        else
          x = x + 1
        if pixel1 > 0 and pixel2 > 0
          list.push ([x+xMin,y+yMin])
          if list.length > 10
            return list
  
  drawAtCollide:(o,time)->
   
    o.rotation = o.rotation - ((o.rotation-o.delta.rotation)*time)
    o.x = o.x - ((o.x-o.delta.x)*time)
    o.y = o.y - ((o.y-o.delta.y)*time)
    o.adjustedX = o.adjustedX - ((o.adjustedX-o.delta.x)*time)
    o.adjustedY = o.adjustedY - ((o.adjustedY-o.delta.y)*time)
    
    
  generatePoints:(xDiff,yDiff,xMin,yMin,o1,o2)-> 
    min = 0
    max = o1.time-1
    mid = 0
    midValue = true
    time = o1.time
    isColliding = true
    while min <= max
      mid = Math.floor((min+max)/2)
      moment = mid/time
      isColliding = @collidesAtTime(xDiff,yDiff,xMin,yMin,o1,o2,moment)#collision at time
      if isColliding is false
        min = mid + 1
      if isColliding is true
        max = mid - 1
    if isColliding is true #find points at mid
      o1.collideTime = mid
      @drawAtCollide(o1,mid/o1.time+1)
      #return true
    else #find points at mid + 1
      o1.collideTime = mid + 1
      @drawAtCollide(o1,(mid+1)/o1.time+1)
      return true
      
      
  moveBackBoundary:(o1)-> 
    min = 0
    max = o1.time-1
    mid = 0
    midValue = true
    time = o1.time
    isColliding = true
    while min <= max
      mid = Math.floor((min+max)/2)
      moment = mid/time
      isColliding = @testBound(o1,moment)#collision at time
      if isColliding is false
        min = mid + 1
      if isColliding is true
        max = mid - 1
    if isColliding is true #find points at mid
      o1.collideTime = mid
      @drawAtCollide(o1,mid/o1.time+1)
      return true
    else #find points at mid + 1
      o1.collideTime = mid + 1
      @drawAtCollide(o1,(mid+1)/o1.time+1)
      return true
 
    
  testBound:(o1,moment)-> #does not account for rotation!
    canvas = document.getElementById "myCanvas"
    y = o1.adjustedY + (o1.adjustedY-o1.delta.y)*moment
    
    x = o1.adjustedX + (o1.adjustedX-o1.delta.x)*moment
    h = o1.height
    w = o1.width
    yMin = y - (h/2)
    yMax = y + (h/2)
    xMin = x - (w/2)
    xMax = x + (w/2)
    if xMin <= 0
      return true
    else if xMax >= canvas.width  
      return true
    else if yMax >= canvas.height
      return true
    else if yMin <= 0
      return true  
    console.log "false" 
    return false
  hitsBoundary:(sprite)->
    canvas = document.getElementById "myCanvas"
    
    if sprite instanceof Circle
      radius = sprite.radius
      if sprite.adjustedX + radius >= canvas.width
        return true
      if sprite.adjustedX - radius <= 0
        return true
      if sprite.adjustedY + radius >= canvas.height
        return true
      if sprite.adjustedY - radius <= 0
        return true
    else
      y = sprite.adjustedY
      x = sprite.adjustedX
      h = sprite.height
      w = sprite.width
      yMin = y - (h/2)
      yMax = y + (h/2)
      xMin = x - (w/2)
      xMax = x + (w/2)
      if xMin < 0
        return true
      else if xMax >= canvas.width  
        return true
      else if yMax >= canvas.height
        return true
      else if yMin < 0
        return true
  runCollisionDetection:(sprite) ->
    for type in @typesToTest.sprite
      if type is "boundary"
        if @hitsBoundary(sprite) is true
          @moveBackBoundary(sprite)
          #console.log "made it here"
          #@drawAtCollide(sprite,.5)
          @collided.push({o1:sprite,o2:"boundary"}) 
    index = @scene.sprites.indexOf(sprite)
    isCorrectType = false
    for object in @scene.sprites#@allSprites
      #for type in @typesToTest.sprite
      #if object instanceof Circle
        #if object instanceof type for type in @typesToTest.sprite
        #console.log object
      isCorrectType = true
        #if type is "boundary"
        #  isCorrectType = false
        #else if type is "all" or object instanceof type
        #  isCorrectType = true
     # if isCorrectType
     #   if (index isnt @scene.sprites.indexOf(object))
     #     collision = @detectCollisions(sprite,object)
          #@collided.push({o1:sprite,o2:object}) if collision is true
    for subSprite in sprite.subSprites
      @runCollisionDetection(subSprite)

