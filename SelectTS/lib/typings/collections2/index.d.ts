//declare module 'collections' {
declare module 'collections2' {
    export class SortedMap<K,V> {

        constructor(values?, equals?, hash?);

        length:number;

        has(key:K):boolean;

        get(key:K):V;

        set(key:K, value:V);

        keys():K[];

        values():V[];

        delete(key:K):boolean;

        forEach(callback:(value:V, key:K) => void):void;

        filter(callback:(value:V, key:K) => boolean):SortedMap<K,V>;

    }

    export class HashMap<K,V> {

        constructor(values?, equals?, hash?);

        length:number;

        has(key:K):boolean;

        get(key:K):V;

        set(key:K, value:V);

        keys():K[];

        values():V[];

        delete(key:K):boolean;

        forEach(callback:(value:V, key:K) => void):void;

        filter(callback:(value:V, key:K) => boolean):HashMap<K,V>;
    }


    export class SortedArraySet<V> {
        constructor(values?, equals?, compare?);

        length:number

        push(...values:V[]);

        //Adds values to the end of a collection.

        pop():V;

        //Removes a value from the end of a collection, and returns that value.

        shift():V;

        //Removes a value from the beginning of a collection, and returns that value.

        unshift(...values:V[]);

        //Adds values to the beginning of a collection.

        union(values:V[]):SortedArraySet<V>;

        //Returns the set of values including all values from both of these sets.

        intersection(values:SortedArraySet<V>):SortedArraySet<V>;

        //Returns the set of values that are in both of these sets.

        difference(values:SortedArraySet<V>):SortedArraySet<V>;

        //Returns the set of values that are in this set, excluding the values that are also in the other set.

        symmetricDifference(values:V[]):SortedArraySet<V>;

        //Returns the set of values that are only in one of these sets.

        has(value:V):boolean;

        //Whether an equivalent value exists in this collection.

        get(value:V):V;

        //Retrieves the equivalent value from the collection.

        add(value:V);

        //Adds a value to a collection.

        delete(value:V):V;

        //Deletes the first equivalent value. Returns whether the key was found and successfully deleted.

        remove(value:V):V;

        //An alias for delete(value) on sets that increases the overlap with the W3C DOMTokenList interface, implemented by classList.

        contains(value:V):boolean;

        //An alias for has(value) on sets that increases the overlap with the W3C DOMTokenList interface, implemented by classList.

        toggle(value:V);

        //Toggles the existence of a value in a set.

        addEach(values:V[]):SortedArraySet<V>;

        //Copies values or entries from another collection into this collection, and then returns this.
        //
        //deleteEach(values|keys, equals?)
        //Deletes every value or every value for each key. Returns the number of successful deletions.
        //
        deleteAll(value:V, equals?);

        //Deletes every value equivalent to the given value from the collection.

        slice(start?:number, end?:number);

        //Returns an array of the values contained in the half-open interval [start, end), that is, including the start and excluding the end.

        splice(start:number, length:number, ...values:V[]):Array<V>[];

        //Replaces a length of values from a starting position with the given variadic values, and returns the values that were replaced as an array.

        swap(start:number, length:number, values?:V[]);

        //Replaces a length of values from a starting position with the given values.

        clear();

        //Deletes all of the values in the collection.

        indexOf(value:V):number;

        //Returns the position of a value, or -1 if the value is not found.

        lastIndexOf(value:V):number;

        //Returns the last position of a value, or -1 if the value is not found.

        find(value:V, equals?, start?):V;

        //Finds the first equivalent value.

        findValue(value:V, equals?, start?):V;

        //Finds the first equivalent value.

        findLast(value:V, equals?, start?):V;

        //Finds the last equivalent value, searching from the right.

        findLastValue(value:V, equals?, start?):V;

        //Finds the last equivalent value, searching from the right.

        //iterate|iterator()
        //Iterates every value in this collection.
        //
        forEach(callback:(value:V) => void, thisp?);

        //Calls the callback for each entry in the collection.

        map<U>(callbackfn:(value:V, index:number, array:V[]) => U, thisArg?:any):U[];

        //Returns an array of the respective return values of a callback for each entry in this collection.

        filter(callback:(value:V) => boolean, thisp?):V[];

        //Returns an array with each value from this collection that passes the given test.

        reduce(callbackfn:(previousValue:V, currentValue:V, currentIndex:number, array:V[]) => V, initialValue?:V):V;

        //Aggregates every value in this collection with the result collected up to that index.
        //
        reduceRight(callbackfn:(previousValue:V, currentValue:V, currentIndex:number, array:V[]) => V, initialValue?:V):V;

        //Aggregates every value in this collection, from right to left.
        //
        //group(callback, thisp?, equals?)
        //Returns an array of [key, class] entries where every value from the collection is placed into the same equivalence class if they return the same key through the given callback.
        //
        some(callbackfn:(value:V) => boolean):boolean;

        //Returns whether any entry in this collection passes a given test.
        //
        //every(callback, thisp?)
        //Returns whether every entry in this collection passes a given test.
        //
        //any()
        //Returns whether any value in the collection is truthy.
        //
        //all()
        //Returns whether all values in the collection are truthy.
        //
        //one()
        //Returns one, arbitrary value from this collection, or undefined if there are none.
        //
        //only()
        //Returns the only value in this collection, or undefined if there is more than one value, or if there are no values in the collection.
        //
        sorted(compareFn?:(a:V, b:V) => number):V[];

        //Returns a sorted array of the values in this collection.
        //
        reversed():V[];

        //Returns a copy of this collection with the values in reverse order.
        //
        //join(delimiter?)
        //Returns a string of all the values in the collection delimited by the given string.
        //
        //sum(zero?)
        //Returns the sum of all values in this collection.
        //
        //average()
        //Returns the arithmetic mean of the collection, by computing its sum and the count of values and returning the quotient.
        //
        //min()
        //Returns the smallest value in this collection.
        //
        //max()
        //Returns the largest value in this collection.
        //
        //zip(...iterables)
        //Returns an array of the respective values in this collection and in each collection provided as an argument.
        //
        //enumerate(start?)
        //Returns an array of [index, value] entries for each value in this collection, counting all values from the given index.
        //
        //concat(...iterables)
        //Returns a new collection of the same type containing all the values of itself and the values of any number of other iterable collections in order.
        //
        //flatten()
        //Assuming that this is a collection of collections, returns a new collection that contains all the values of each nested collection in order.
        //
        toArray():V[];

        //Returns an array of each value in this collection.
        //
        //toObject()
        //Returns an object with each property name and value corresponding to the entries in this collection.
        //
        //toJSON()
        //Used by JSON.stringify to create a JSON representation of the collection.
        //
        //equals(value, equals?)
        //Returns whether this collection is equivalent to the given collection.
        //
        //compare(value, compare?)
        //Compares two values and returns a number having the same relative value to zero.
        //
        //clone(depth?, memo?)
        //Creates a deep replica of this collection.
        //
        //constructClone(values?)
        //Creates a shallow clone of this collection.
        //
        //contentCompare(left, right)
        //The compare function used by this collection to determine how to order its own values.
        //
        //contentEquals(left, right)
        //The equals function used to check whether values in this collection are equivalent.
        //
        //addRangeChangeListener(listener, token?, beforeChange?)
        //Adds a listener for when values are added or removed at any position.
        //
        //removeRangeChangeListener(listener, token?, beforeChange?)
        //Unregisters a range change listener provided by addRangeChangeListener.
        //
        //dispatchRangeChange(plus, minus, index, beforeChange?)
        //Informs range change listeners that values were removed then added at an index.
        //
        //addBeforeRangeChangeListener(listener, token?)
        //Adds a listener for before values are added or removed at any position.
        //
        //removeBeforeRangeChangeListener(listener, token?)
        //Unregisters a range change listener provided by addBeforeRangeChangeListener or addRangeChangeListener with the beforeChange flag.
        //
        //dispatchBeforeRangeChange(plus, minus, index)
        //Informs range change listeners that values will be removed then added at an index.
        //
        //addOwnPropertyChangeListener(key, listener, beforeChange?)
        //Adds a listener for an owned property with the given name.
        //
        //addBeforeOwnPropertyChangeListener(name, listener)
        //Adds a listener for before a property changes.
        //
        //removeOwnPropertyChangeListener(name, listener, beforeChange?)
        //Unregisters a property change listener provided by addOwnPropertyChangeListener.
        //
        //removeBeforeOwnPropertyChangeListener(key, listener)
        //Unregisters a property change listener provided by addBeforeOwnPropertyChangeListener or addOwnPropertyChangeListener with the beforeChange flag.
        //
        //dispatchOwnPropertyChange(key, value, beforeChange?)
        //Informs property change listeners that the value for a property name has changed.
        //
        //dispatchBeforeOwnPropertyChange(key, value)
        //Informs property change listeners that the value for a property name will change.
        //
        //makePropertyObservable(name)
    }
}
//}
