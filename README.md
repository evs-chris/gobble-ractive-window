# gobble-ractive-window

Compile ractive-window scripts into conveniently loadable modules.

## Installation

First, you need to have gobble installed - see the [gobble readme](https://github.com/gobblejs/gobble) for details. Then, simply reference `'ractive-window'` in a `transform`, and gobble will take care of getting the plugin installed.

## Usage

This is a file transform that will be run on any `.rw.html` files at the stage in the gobble pipeline in which it is called.

```js
gobble(lastStep).transform('ractive-window');
```

### Options
* TODO

## TODO
* Client loader

## License

Copyright (c) 2014 Chris Reeves. Released under an [MIT license](https://github.com/evs-chris/gobble-giblets/blob/master/LICENSE.md).
