# Script Summary

## `modulesfreeSync`

This script makes use of the synchronous `fs` module and recursion. It works quite good but it's still *blocking code* and it doesn't make use of promises properly.

## `modulesfreePromises`

This one makes use of the `fs/promises` module. It's an improvement over the previous one. It's still not ideal as it doesn't make use of recursion when searching (yet). I'm starting to see why people love `async/await`.

## `modulesfreePromisesRecursion`

This is the most complete one. It was kinda chaotic to implement recursion but I managed to do it. 
This one makes use of `fs/promises` module with `async/await` + searching in arbitrary depth leveraging recursion.
I couldn't have done it without `async/await` it just made the code much more readable and I was able to kinda abstract away from the complexities of promises and imagine the synchronous solution. It was magic.
