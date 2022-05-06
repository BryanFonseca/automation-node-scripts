# My automation Node.js scripts

I'm starting a Node.js journey, and with that I mean I started reading the docs and found out it has a quite easy-to-follow API.

## `modulesfree`

Since I'm learning React (using create-react-app) and my Linux partition has pretty limited storage, it's no wonder I was running out of space! I realized node_modules folders might take a considerable amount of space on a modern React project set up.

This script takes a searching path as input, from which it'll recursively search for node_modules folders to delete them.

This is my first Node script and I had a bit of a trouble trying to search for a directory recursively using the `fs/promises` module (promises + recursion = headache 😵) so I ended up doing it synchronously. It could be better so I'll problably update it when I figure out how to do it.

In any case, I think I learned a thing or two about Node.js while doing this simple script, that's cool!.
