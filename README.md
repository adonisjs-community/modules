# Modules

> An easy and ergonomic way to scaffold your AdonisJS projects ! 

## Introduction

`@adonisjs-community/modules` provides a set of commands based on `adonisjs/core` commands to help you quickly scaffold your AdonisJS projects into modules *(more accurately into feature-based subdirectories)*. 
This allows you to organize your code in a modular way, making it easier to maintain and scale your application.

```
├── app
│  ├── auth
│  │  ├── controllers
│  │  ├── services
│  │  └── models
│  └── users
│     ├── exceptions
│     ├── factories
│     └── validators

```

## Installation

You can install Modules in your AdonisJS project using the following command:

```bash
node ace add @adonisjs-community/modules
```

## Getting Started

After installation, you can create a new module using the `make:module` command:

```bash
node ace make:module auth
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

You can now reuse the `@adonisjs/core` and `@adonisjs/lucid` `make` commands with flag `-m (--module)` to create controllers, models, views, etc., within your module. For example:

```bash
node ace make:controller sign_in -m=auth
node ace make:controller sign_in --module auth
```

This command will create a new controller file named `sign_in_controller.ts` in the `auth` module.

At this point, you can refer to the [AdonisJS commands documentation](https://docs.adonisjs.com/guides/references/commands#makecontroller) to learn more about the available commands and how to use them.

## Particularities (`@adonisjs/lucid`)

When using the `@adonisjs/lucid` commands, you can also specify the module where you want to create your models, migrations, and factories.

That said, when generating a model, the `-m` alias will not work, as this alias is already used to specify if the codemods should generate a migration for the model.

Last thing to note, the generated migrations will be placed in the `database/migrations` directory and not inside the module directory. This is because migrations are global to the application and not specific to a module. Thus, order of execution is important, and having them in a single directory allows you to manage them more easily.

## License
Modules is open-sourced software licensed under the [MIT license](./LICENSE.md).

## Contributing
We welcome contributions to the Modules package! If you have ideas, suggestions, or improvements, please feel free to open an issue or submit a pull request.
