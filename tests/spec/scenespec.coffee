describe 'Scene', ->
  scene = null
  beforeEach ->
    canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    canvas.id = "myCanvas"
    document.body.appendChild(canvas)
    scene = new Scene()
  describe 'Constructor', ->
    it 'Scene is defined', ->
      expect(scene).toBeDefined()
    it 'Sprites array is created in constructor', ->
      expect(scene.sprites).toBeDefined()
      scene.sprites.length = 0
  describe 'Add Sprites to the Sprites Array',->
    it 'Add sprite to Sprites Array', ->
      sprite = new Sprite()
      scene.addSprite(sprite)
      expect(scene.sprites.length).toBe(1)
    it 'Add 1 sprite to Sprites Array with addSprites(sprites...)', ->
      scene.addSprites(new Sprite)
      expect(scene.sprites.length).toBe(1)
    it 'Add 4 sprites with addSprites(sprites...)',->
      scene.addSprites(new Sprite(),new Sprite, new Sprite, new Sprite)
      expect(scene.sprites.length).toBe(4)
  describe 'Update and Draw Functions', ->
    it 'Update function runs with 0 sprites', ->
      scene.update()
    it 'Draw function runs with 0 sprites', ->
      scene.draw()
    it 'Update function runs with 1 sprite', ->
      scene.addSprite(new Sprite())
      scene.update()
    it 'Draw function runs with 1 sprite', ->
      scene.addSprite(new Sprite())
      scene.draw()
    it 'Update function runs with 3 sprites', ->
      scene.addSprite(new Sprite())
      scene.addSprite(new Sprite())
      scene.addSprite(new Sprite())
      scene.update()
    it 'Draw function runs with 3 sprites', ->
      scene.addSprite(new Sprite())
      scene.addSprite(new Sprite())
      scene.addSprite(new Sprite())
      scene.draw()
  describe 'Add Children', ->
    it 'Add a Child to a Sprite', ->  
      scene.makeChild(new Sprite,new Sprite)
    it 'Add 5 Children to a Sprite', ->
      parent = new Sprite
      scene.makeChild(parent, new Sprite)
      scene.makeChild(parent, new Sprite)
      scene.makeChild(parent, new Sprite)
      scene.makeChild(parent, new Sprite)
      scene.makeChild(parent, new Sprite)
    it 'Add a Child to a Child Sprite', ->
      parent = new Sprite(x:100,y:100)
      child = new Sprite(x:0,y:0)
      grandchild = new Sprite(x:10,y:10)
      scene.makeChild(parent, child)
      expect(child.adjustedX).toBe(100)
      expect(child.adjustedY).toBe(100)
      scene.makeChild(child, grandchild)
      expect(grandchild.adjustedX).toBe(110)
      expect(grandchild.adjustedY).toBe(110)

      










