(function() {

  describe('Vector', function() {
    it('Vector.add adds two vectors and returns a vector object', function() {
      var vec;
      vec = Vector.add(1, 1, 0, 1);
      expect(vec.x).toBe(1);
      return expect(vec.y).toBe(2);
    });
    it('Vector.subtract subtracts one vector from another and returns a vector object', function() {
      var vec;
      vec = Vector.subtract(5, 5, 2, 3);
      expect(vec.x).toBe(3);
      return expect(vec.y).toBe(2);
    });
    it('Vector.subtract handles negative values', function() {
      var vec;
      vec = Vector.subtract(0, -1, 3, 2);
      expect(vec.x).toBe(-3);
      return expect(vec.y).toBe(-3);
    });
    it('Vector.dotProduct returns a value for the dot product of two vectors', function() {
      expect(Vector.dotProduct(1, 2, 3, 4)).toBe(11);
      expect(Vector.dotProduct(0, 0, 0, 0)).toBe(0);
      return expect(Vector.dotProduct(-1, 1, -1, 1)).toBe(2);
    });
    it('Vector.length returns the length of a vector from its x and y components', function() {
      expect(Vector.length(0, 0)).toBe(0);
      expect(Vector.length(-1, -1)).toBe(Math.sqrt(2));
      return expect(Vector.length(5, 5)).toBe(Math.sqrt(50));
    });
    it('Vector.normalize returns the normal form of a vector from its x and y components', function() {
      var vec;
      vec = Vector.normalize(-1, -2);
      expect(vec.x).toBe(-1. / Math.sqrt(5));
      return expect(vec.y).toBe(-2. / Math.sqrt(5));
    });
    return it('Vector.scale scales a Vector by a value', function() {
      expect(Vector.scale(0, 5, 10000).x).toBe(0);
      expect(Vector.scale(0, 5000, 10000).y).toBe(0);
      expect(Vector.scale(2, -100, 10000).x).toBe(-200);
      return expect(Vector.scale(-10, 5, 100).y).toBe(-1000);
    });
  });

}).call(this);
