import { Indexer } from "./Indexer";
import { IEnumerator } from "./IEnumerator"
import { IAdapter } from "./IAdapter"
import { TreeNode } from "./TreeNode"
export class NodeT2BEnumerator<T, IdxFunc extends Indexer> implements IEnumerator<TreeNode<T>>{

    private _node: TreeNode<T> | undefined;
    private _adapter !: IAdapter<TreeNode<T>>;
    private _currNode!: TreeNode<T> | undefined;
    private _indexer!: IdxFunc;
    constructor(node: TreeNode<T> | undefined, func: IdxFunc, adapter: any) {
        if (!node) {
            return
        }
        this._node = node;
        this._indexer = func;

        this._adapter = adapter;
        this._adapter.add(this._node);
        this._currNode = undefined

    }
    public reset(): void {
        if (!this._node) {
            return
        }
        this._currNode = undefined;
        this._adapter.clear()
        this._adapter.add(this._node)
    }
    public moveNext(): boolean {

        if (this._adapter.isEmpty) {
            return false
        }
        this._currNode = this._adapter.remove();
        if (this._currNode) {
            let len: number = this._currNode.childCount;
            for (let i = 0; i < len; i++) {
                let childIdex: number = this._indexer(len, i)
                let child: TreeNode<T> | undefined = this._currNode.getChildAt(childIdex);
                if (child) {
                    this._adapter.add(child)
                }
            }
        }
        return true
    }
    public get current(): TreeNode<T> | undefined {
        return this._currNode
    }
}