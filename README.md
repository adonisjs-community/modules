# Modules

> An easy and ergonomic way to scaffold your AdonisJS projects ! 

## Introduction

`@adonisjs-community/modules` provides a set of commands based on `adonisjs/core` commands to help you quickly scaffold your AdonisJS projects into modules *(more accurately into feature-based subdirectories)*. 
This allows you to organize your code in a modular way, making it easier to maintain and scale your application.

**INSERT SCREENSHOT HERE**

## Installation

You can install Modules in your AdonisJS project using the following command:

```bash
node ace add @adonisjs-community/modules
```

## Getting Started

After installation, you can create a new module using the `mmake:module` command:

```bash
node ace mmake:module auth
```

This will create a new module named `auth` in the `/app` directory, as well as registering a new alias for the path resolution in your package.json file:

```json
{
  "imports": {
    "...",
    "#auth/*": "./app/auth/*.js"
  }
}
```

## That's it !

You can now reuse the `@adonisjs/core` `make` (as ***m***make) commands to create controllers, models, views, etc., within your module. For example:

```bash
node ace mmake:controller sign_in --module=auth
```

This command will create a new controller file named `sign_in_controller.ts` in the `auth` module.

At this point, you can refer to the [AdonisJS commands documentation](https://docs.adonisjs.com/guides/references/commands#makecontroller) to learn more about the available commands and how to use them.

## License
Modules is open-sourced software licensed under the [MIT license](./LICENSE.md).

## Contributing
We welcome contributions to the Modules package! If you have ideas, suggestions, or improvements, please feel free to open an issue or submit a pull request.
