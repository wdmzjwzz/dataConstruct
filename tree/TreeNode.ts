import { Indexer, IndexerL2R } from "./Indexer";

type NodeCallbanck<T> = (node: TreeNode<T>) => void

export class TreeNode<T>{
    private _parent: TreeNode<T> | undefined;
    private _children: Array<TreeNode<T>> | undefined;
    public name: string | undefined;
    public data: T | undefined

    constructor(data: T | undefined = undefined, parent: TreeNode<T> | undefined = undefined, name: string = "") {
        this._parent = parent;
        this.name = name;
        this.data = data;
        if (this._parent) {
            this._parent.addChild(this)
        }
    }
    public isDescendantOf(ancestor: TreeNode<T> | undefined): boolean {
        if (ancestor === undefined) {
            return false
        }
        for (let node: TreeNode<T> | undefined = this._parent; node !== undefined; node = node._parent) {
            if (node === ancestor) {
                return true
            }

        }
        return false
    }
    public removeChildAt(index: number): TreeNode<T> | undefined {
        if (this._children === undefined) {
            return undefined
        }
        let child: TreeNode<T> | undefined = this.getChildAt(index);
        if (!child) {
            return undefined
        }
        this._children.splice(index, 1)
        child._parent = undefined;
        return child
    }
    public removeChild(child: TreeNode<T> | undefined): TreeNode<T> | undefined {
        if (this._children === undefined) {
            return undefined
        }
        if (!child) {
            return undefined
        }
        let index: number = -1
        for (let i = 0; i < this._children.length; i++) {
            const element = this._children[i];
            if (element === child) {
                index = i;
                break
            }
        }
        if (index === -1) {
            return undefined
        }

        return this.removeChildAt(index)
    }
    public getChildAt(index: number): TreeNode<T> | undefined {
        if (this._children === undefined) {
            return undefined
        }
        if (index < 0 || index >= this._children?.length) {
            return undefined
        }
        return this._children[index]
    }
    public remove(): TreeNode<T> | undefined {
        if (this._parent) {
            return this._parent.removeChild(this)
        }
        return undefined
    }
    public addChildAt(child: TreeNode<T>, index: number): TreeNode<T> | undefined {
        if (this.isDescendantOf(child)) {
            return undefined
        }
        if (this._children === undefined) {
            this._children = []
        }
        if (index >= 0 && index <= this._children.length) {
            if (child._parent !== undefined) {
                child._parent.removeChild(child)
            }
            child._parent = this
            this._children.splice(index, 0, child)
            return child
        } else {
            return undefined
        }

    }
    public addChild(child: TreeNode<T>): TreeNode<T> | undefined {

        if (this._children === undefined) {
            this._children = []
        }
        return this.addChildAt(child, this._children.length)
    }
    public get parent(): TreeNode<T> | undefined {
        return this._parent
    }
    public get childCount(): number {
        if (this._children) {
            return this._children.length
        } else {
            return 0
        }
    }
    public hasChild(): boolean {
        return this._children && this._children.length > 0 ? true : false
    }
    public get root(): TreeNode<T> | undefined {
        let current: TreeNode<T> | undefined = this;
        while (current && current.parent) {
            current = current.parent
        }
        return current
    }
    /**
     * depth
     */
    public get depth(): number {
        let current: TreeNode<T> | undefined = this;
        let level: number = 0
        while (current && current.parent) {
            current = current.parent
            level++
        }
        return level
    }
    public visit(preOrderFunc: NodeCallbanck<T> | null = null, postOrderFunc: NodeCallbanck<T> | null = null, indexFunc: Indexer = IndexerL2R) {
        if (preOrderFunc) {
            preOrderFunc(this)
        }
        let arr: Array<TreeNode<T>> | undefined = this._children;
        if (arr) {
            for (let index = 0; index < arr.length; index++) {
                let child: TreeNode<T> | undefined = this.getChildAt(indexFunc(arr.length, index));
                if (child) {
                    child.visit(preOrderFunc, postOrderFunc, indexFunc)
                }
            }
        }
        if (postOrderFunc) {
            postOrderFunc(this)
        }

    }
}