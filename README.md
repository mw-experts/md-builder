# md-builder

## How to use repository

1. Rename `nx-cloud.env-example` to `nx-cloud.env` and set all values
2. [Commit Message Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)

## Repository commands

```
nx g @nrwl/node:library md-builder --setParserOptionsProject=true --strict=true --testEnvironment=node --standaloneConfig=true --publishable --importPath=@mw-experts/md-builder
```

## TODO

- Protect `main` branch from push
- Setup hooks and lint to check commit message format
