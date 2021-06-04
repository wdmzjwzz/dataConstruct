class ListNode<T>{
    public next: ListNode<T> | null;
    public prev: ListNode<T> | null;
    public data: T | undefined;
    constructor(data: T | undefined = undefined) {
        this.next = this.prev = null
        this.data = data
    }
}
export class List<T>{
    private _headNode: ListNode<T>;
    private _length: number;
    constructor() {
        this._headNode = new ListNode<T>();
        this._length = 0;
        this._headNode.prev = this._headNode;
        this._headNode.next = this._headNode
    }
    public empty(): boolean {
        return this._headNode.next === this._headNode
    }
    public get length(): number {
        return this._length
    }
    public begin(): ListNode<T> {
        if (this._headNode.next === null) {
            throw new Error("头节点的next为null");

        }
        return this._headNode.next
    }
    public end() {
        return this._headNode
    }
    public contains(data: T): boolean {
        for (let link: ListNode<T> | null = this._headNode.next; link !== null && link !== this._headNode; link = link.next) {
            if (link && link.data) {
                if (data === link.data) {
                    return true
                }
            }

        }
        return false
    }
    public forNext(cb: (data: T) => void): void {
        for (let link: ListNode<T> | null = this._headNode.next; link !== null && link !== this._headNode; link = link.next) {
            if (link && link.data) {
                cb(link.data)
            }

        }
    }
    public forPrev(cb: (data: T) => void): void {
        for (let link: ListNode<T> | null = this._headNode.prev; link !== null && link !== this._headNode; link = link.prev) {
            if (link && link.data) {
                cb(link.data)
            }

        }
    }
    public insertBefore(node: ListNode<T>, data: T): ListNode<T> {
        let ret: ListNode<T> | null = new ListNode<T>(data)
        ret.prev = node.prev
        ret.next = node
        if (node.prev) {
            node.prev.next = ret
        }
        node.prev = ret
        this._length++;
        return ret
    }
    public remove(node: ListNode<T>) {
        let next: ListNode<T> | null = node.next;
        let prev: ListNode<T> | null = node.prev
        if (prev) {
            prev.next = next;
        }
        if (next) {
            next.prev = prev
        }
        this._length--
    }
    /**
     * push
     */
    public push(data: T) {
        this.insertBefore(this.end(), data)
    }
    /**
     * pop
     */
    public pop(): T | undefined {
        let prev: ListNode<T> | null = this.end().prev;
        if (prev) {
            let ret = prev.data;
            this.remove(prev)
            return ret
        }
        return undefined
    }
    /**
     * push_front
     */
    public push_front(data: T) {
        this.insertBefore(this.begin(), data)
    }
    public pop_front(): T | undefined {
        let ret: T | undefined = this.begin().data;
        this.remove(this.begin())
        return ret
    }
}