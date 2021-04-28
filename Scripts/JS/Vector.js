"use strict";
// a general purpose class for 2d vectors (X,Y)
class Vector2 {
    constructor(x, y, args = []) {
        this.x = x;
        this.y = y;
        this.args = args;
    }
    // takes a vector in and outputs the vector rounded to -1, 0, or 1
    IntNormalize() {
        return new Vector2(this.x == 0 ? 0 : (this.x > 0 ? 1 : -1), this.y == 0 ? 0 : (this.y > 0 ? 1 : -1));
    }
    // quickly checks if two vectors are equal
    Equal(vec) {
        return this.x == vec.x && this.y == vec.y;
    }
    // does this list of vectors contain this vector?
    Contains(list) {
        let contains = false;
        list.forEach(pos => {
            if (this.Equal(pos)) {
                contains = true;
            }
        });
        return contains;
    }
    // adds two vectors
    Add(vec) {
        return new Vector2(vec.x + this.x, vec.y + this.y);
    }
    // adds a vector to this vector
    AddSelf(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
    // subtracts two vectors
    Subtract(vec) {
        return new Vector2(vec.x - this.x, vec.y - this.y);
    }
    // subtracts a vector from this vector
    SubtractSelf(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    // multiplies two vectors
    Multiply(vec) {
        return new Vector2(this.x * vec.x, this.y * vec.y);
    }
    // multiplies with a single number instead of a vector
    MultiplyNum(num) {
        return new Vector2(this.x * num, this.y * num);
    }
    // gets the value of an arg (will be removed in future refactors)
    GetArg(arg) {
        for (let i = 0; i < this.args.length; i++) {
            let slicedarg = this.args[i].replace(/-/g, "").replace(/_/g, "").toLowerCase();
            if (slicedarg == arg.toLowerCase()) {
                if (this.args[i].indexOf('_') != -1) {
                    return false;
                }
                else if (this.args[i].indexOf('-') != -1) {
                    return true;
                }
                else {
                    return null;
                }
            }
        }
        return null;
    }
    // adds an arg
    AddArg(arg, state) {
        this.args.push(arg + (state ? "-" : "_"));
    }
}
// some useful constants
Vector2.zero = new Vector2(0, 0);
Vector2.down = new Vector2(0, -1);
Vector2.left = new Vector2(-1, 0);
Vector2.right = new Vector2(1, 0);
Vector2.up = new Vector2(0, 1);
Vector2.downLeft = new Vector2(-1, -1);
Vector2.downRight = new Vector2(1, -1);
Vector2.upLeft = new Vector2(-1, 1);
Vector2.upRight = new Vector2(1, 1);
