# Namespace is a function written by CoffeeScript creator Jashkenas to emulate namespace or module functionality. 
# The code and following usage examples are taken directly from https://github.com/jashkenas/coffee-script/wiki/FAQ.
# namespace 'Hello.World', (exports) ->
  ## `exports` is where you attach namespace members
# exports.hi = -> console.log 'Hi World!'

# namespace 'Say.Hello', (exports, top) ->
  # #`top` is a reference to the main namespace
  # exports.fn = -> top.Hello.World.hi()
# Say.Hello.fn()  # prints 'Hi World!'

namespace = (target, name, block) ->
  [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
  top    = target
  target = target[item] or= {} for item in name.split '.'
  block target, top

#namespace 'Regular', (exports) ->
  ## `exports` is where you attach namespace members
#  exports.easeOut = -> console.log 'Hi World!'

#namespace 'Say', (exports, top) ->
  # #`top` is a reference to the main namespace
#  exports.fn = -> top.Hello.World.hi()


