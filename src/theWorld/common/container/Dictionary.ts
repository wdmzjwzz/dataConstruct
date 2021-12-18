export class Dictionary<T> {
  public constructor() {
    this._items = new Map<string, T>();
  }

  public get length(): number {
    return this._count;
  }

  public contains(key: string): boolean {
    return this._items.has(key);
  }

  public find(key: string): T | undefined {
    return this._items.get(key);
  }

  public insert(key: string, value: T): void {
    this._items.set(key, value);
    this._count++;
  }

  public remove(key: string): boolean {
    let ret: T | undefined = this.find(key);
    if (ret === undefined) {
      return false;
    }
    this._items.delete(key);
    this._count--;
    return true;
  }

  public get keys(): string[] {
    let keys: string[] = [];
    let keyArray = this._items.keys();
    for (let key of keyArray) {
      keys.push(key);
    }
    return keys;
  }

  public get values(): T[] {
    let values: T[] = [];
    // 一定要用of，否则出错
    let vArray = this._items.values();
    for (let value of vArray) {
      values.push(value);
    }
    return values;
  }

  private _items: Map<string, T>;
  private _count: number = 0;
}
