describe 'Back', ->
  it 'Back.easeIn begins by moving back from the initial position', ->
    expect(Back.easeIn(2,10,2000,0)).toBeLessThan(0)
  it 'Back.easeIn ends by moving towards the final position', ->
    x = Back.easeIn(1990,10,2000,0)
    expect(Back.easeIn(1999,10,2000,0)).toBeGreaterThan(x)
  it 'Back.easeOut begins by moving toward the final position', ->
    expect(Back.easeOut(1,100,2000,0)).toBeGreaterThan(0)
  it 'Back.easeOut ends by moving past the final position', ->
    expect(Back.easeOut(1950,100,2000,0)).toBeGreaterThan(100)
  it 'Back.easeInOut begins by moving back from the initial position and ends by moving past the final position',->
    expect(Back.easeIn(2,100,2000,0)).toBeLessThan(0)
    expect(Back.easeInOut(1950,100,2000,0)).toBeGreaterThan(100)
