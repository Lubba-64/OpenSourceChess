type NullableVector = Vector2 | null;
type nullablebool = boolean | null;
class Vector2{
    x:number;
    y:number;
    args: string[];
    constructor (x: number,y: number,args: string[] = []){
        this.x = x;
        this.y = y;
        this.args = args;
    }
    IntNormalize(): Vector2{
        return new Vector2(this.x == 0 ? 0 : (this.x > 0 ? 1 : -1), this.y == 0 ? 0 : (this.y > 0 ? 1 : -1));
    }
    Equal (vec: Vector2): boolean{
        return this.x == vec.x && this.y == vec.y;
    }
    Contains (list: Vector2[]): boolean{
        let contains = false;
        list.forEach(pos=> {
            if (this.Equal(pos)){
                contains = true;
            }
        });
        return contains;
    }
    Add (vec: Vector2): Vector2{
        return new Vector2(vec.x+this.x,vec.y+this.y);
    }
    AddSelf (vec: Vector2): void{
        this.x += vec.x;
        this.y += vec.y;
    }
    Subtract (vec: Vector2): Vector2{
        return new Vector2(vec.x-this.x,vec.y-this.y);
    }
    SubtractSelf (vec: Vector2): void{
        this.x -= vec.x;
        this.y -= vec.y;
    }
    Multiply (vec: Vector2): Vector2{
        return new Vector2(this.x*vec.x,this.y*vec.y);
    }
    MultiplyNum (num: number):Vector2{
        return new Vector2(this.x*num,this.y*num)
    }
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
    AddArg(arg: string,state: boolean): void{
        this.args.push(arg + (state?"-":"_"))
    }
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