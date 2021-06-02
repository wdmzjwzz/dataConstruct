import { TreeNode } from "./TreeNode"
import { NodeB2TEnumerator } from "./NodeB2TEnumerator"
import { NodeT2BEnumerator } from "./NodeT2BEnumerator"
import { IEnumerator } from "./IEnumerator"
import { IndexerL2R, IndexerR2L } from "./Indexer"
import { Stack } from "./Stack"
import { Queue } from "./Queue"
export class NodeEnumeratorFactory {
    // 深度优先，从做到右，从上到下
    static create_df_l2r_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
        let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerR2L, new Stack(true));
        return iter
    }
    // 深度优先，从右到左，从上到下
    static create_df_r2l_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
        let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerL2R, new Stack(true));
        return iter
    }
    // 广度优先 从左到右，从上到下
    static create_bf_l2r_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
        let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerL2R, new Queue(true));
        return iter
    }
    // 广度优先 从右到左，从上到下
    static create_bf_r2l_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
        let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerR2L, new Queue(true));
        return iter
    }

    // 从下到上
    // 广度优先 从右到左，从下到上
    static create_df_l2r_b2t_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
        let iter: IEnumerator<TreeNode<T>> = new NodeB2TEnumerator<T>(NodeEnumeratorFactory.create_df_r2l_t2b_iter(node));
        return iter
    }

}