export class Vector2 {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    /**
         * Get vector's x value.
         */
    public readonly x: number;
    /**
     * Get vector's y value.
     */
    public readonly y: number;
    /**
     * Get vector's length.
     */
    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    };

}