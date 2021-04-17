"use strict";
class Vector2 {
    constructor(x, y, args = []) {
        this.x = x;
        this.y = y;
        this.args = args;
    }
    IntNormalize() {
        return new Vector2(this.x == 0 ? 0 : (this.x > 0 ? 1 : -1), this.y == 0 ? 0 : (this.y > 0 ? 1 : -1));
    }
    Equal(vec) {
        return this.x == vec.x && this.y == vec.y;
    }
    Contains(list) {
        let contains = false;
        list.forEach(pos => {
            if (this.Equal(pos)) {
                contains = true;
            }
        });
        return contains;
    }
    Add(vec) {
        return new Vector2(vec.x + this.x, vec.y + this.y);
    }
    AddSelf(vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
    Subtract(vec) {
        return new Vector2(vec.x - this.x, vec.y - this.y);
    }
    SubtractSelf(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    Multiply(vec) {
        return new Vector2(this.x * vec.x, this.y * vec.y);
    }
    MultiplyNum(num) {
        return new Vector2(this.x * num, this.y * num);
    }
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
    AddArg(arg, state) {
        this.args.push(arg + (state ? "-" : "_"));
    }
}
Vector2.zero = new Vector2(0, 0);
Vector2.down = new Vector2(0, -1);
Vector2.left = new Vector2(-1, 0);
Vector2.right = new Vector2(1, 0);
Vector2.up = new Vector2(0, 1);
Vector2.downLeft = new Vector2(-1, -1);
Vector2.downRight = new Vector2(1, -1);
Vector2.upLeft = new Vector2(-1, 1);
Vector2.upRight = new Vector2(1, 1);
