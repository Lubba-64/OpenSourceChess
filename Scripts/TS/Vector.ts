// a general purpose class for 2d vectors (X,Y)

type NullableVector = Vector2 | null;
type nullablebool = boolean | null;
class Vector2{
    x:number;
    y:number;
    // args is specifically for chess, some movements on the board need to be passed with arguments. 
    // If i ever come back to the code I will refactor this out for a different solution
    args: string[];
    constructor (x: number,y: number,args: string[] = []){
        this.x = x;
        this.y = y;
        this.args = args;
    }
    // takes a vector in and outputs the vector rounded to -1, 0, or 1
    IntNormalize(): Vector2{
        return new Vector2(this.x == 0 ? 0 : (this.x > 0 ? 1 : -1), this.y == 0 ? 0 : (this.y > 0 ? 1 : -1));
    }
    // quickly checks if two vectors are equal
    Equal (vec: Vector2): boolean{
        return this.x == vec.x && this.y == vec.y;
    }
    // does this list of vectors contain this vector?
    Contains (list: Vector2[]): boolean{
        let contains = false;
        list.forEach(pos=> {
            if (this.Equal(pos)){
                contains = true;
            }
        });
        return contains;
    }
    // adds two vectors
    Add (vec: Vector2): Vector2{
        return new Vector2(vec.x+this.x,vec.y+this.y);
    }
    // adds a vector to this vector
    AddSelf (vec: Vector2): void{
        this.x += vec.x;
        this.y += vec.y;
    }
    // subtracts two vectors
    Subtract (vec: Vector2): Vector2{
        return new Vector2(vec.x-this.x,vec.y-this.y);
    }
    // subtracts a vector from this vector
    SubtractSelf (vec: Vector2): void{
        this.x -= vec.x;
        this.y -= vec.y;
    }
    // multiplies two vectors
    Multiply (vec: Vector2): Vector2{
        return new Vector2(this.x*vec.x,this.y*vec.y);
    }
    // multiplies with a single number instead of a vector
    MultiplyNum (num: number):Vector2{
        return new Vector2(this.x*num,this.y*num)
    }
    // gets the value of an arg (will be removed in future refactors)
    GetArg(arg: string): nullablebool{
        for (let i = 0; i < this.args.length; i++){
            let slicedarg = this.args[i].replace(/-/g,"").replace(/_/g,"").toLowerCase();
            if (slicedarg == arg.toLowerCase()){
                if (this.args[i].indexOf('_') != -1){
                    return false;
                }
                else if (this.args[i].indexOf('-') != -1){
                    return true;
                }
                else{
                    return null;
                }
            }
        }
        return null;
    }
    // adds an arg
    AddArg(arg: string,state: boolean): void{
        this.args.push(arg + (state?"-":"_"))
    }
    // some useful constants
    static zero: Vector2 = new Vector2(0,0);
    static down: Vector2 = new Vector2(0,-1);
    static left: Vector2 = new Vector2(-1,0);
    static right: Vector2 = new Vector2(1,0);
    static up: Vector2 = new Vector2(0,1);
    static downLeft: Vector2 = new Vector2(-1,-1);
    static downRight: Vector2 = new Vector2(1,-1);
    static upLeft: Vector2 = new Vector2(-1,1);
    static upRight: Vector2 = new Vector2(1,1);
}