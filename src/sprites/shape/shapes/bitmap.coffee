#Bitmap takes draws a bitmap, png, jpg, or svg file that is loaded into the html.
#Bitmap requires the image id from the html.
class Bitmap extends Shape
  constructor:(args = {})-> 
    super(args.x,args.y,args.angularVelocity,args.velocity,args.otherVelocity,
    args.alpha,args.rotation,args.fill,args.stroke,args.lineCap,args.lineWidth,args.lineJoin,args.miterLimit,args.xVelocity,args.yVelocity)
    @image = document.getElementById(args.image)
    @width = @image.width
    @height = @image.height
    @centerPoint = {x:-@width/2-@lineWidth/2,y:-@height/2-@lineWidth/2}    
    #@buildDrawingCanvas()
  createStamp: (context) ->
  draw:(context)->
    context.drawImage(@image,@centerPoint.x,@centerPoint.y)
    #context.drawImage(@image,30,30)
  #toDo: what to do if not imgId given?
