# Script Summary

## `modulesfreeSync`

This script makes use of the synchronous `fs` module and recursion. It works quite good but it's still *blocking code* and it doesn't make use of promises properly.

## `modulesfreePromises`

This one makes use of the `fs/promises` module. It's an improvement over the previous one. It's still not ideal as it doesn't make use of recursion when searching (yet). I'm starting to see why people love `async/await`.
