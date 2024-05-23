# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.8.0](https://github.com/xzhayon/imho/compare/@imho/cache-redis@0.7.0...@imho/cache-redis@0.8.0) (2024-05-23)


### Features

* migrate to affex ([#48](https://github.com/xzhayon/imho/issues/48)) ([e5696e8](https://github.com/xzhayon/imho/commit/e5696e80877e81122fa385a92a23a59383b422f7))


### BREAKING CHANGES

* drop support for @xzhayon/fx





# [0.7.0](https://github.com/xzhavilla/imho/compare/@imho/cache-redis@0.6.1...@imho/cache-redis@0.7.0) (2024-05-02)


### Features

* **cache:** use Fx 0.9 ([3d2971c](https://github.com/xzhavilla/imho/commit/3d2971c7f6387d6a6e6038bc21f542e5bb9757cb))


### BREAKING CHANGES

* **cache:** drop support for Fx 0.7





## [0.6.1](https://github.com/xzhavilla/imho/compare/@imho/cache-redis@0.6.0...@imho/cache-redis@0.6.1) (2024-04-23)

**Note:** Version bump only for package @imho/cache-redis





# [0.6.0](https://github.com/xzhavilla/imho/compare/@imho/cache-redis@0.5.0...@imho/cache-redis@0.6.0) (2024-04-23)


### chore

* **cache:** update dependencies ([e972aea](https://github.com/xzhavilla/imho/commit/e972aea43e84284d59edc6c4a31ee84f5113edb9))


### Features

* support Fx 0.7 ([d41d682](https://github.com/xzhavilla/imho/commit/d41d6825478b88edbdca9ce0bb28d8539fc45ac2))
* use Fx typed errors ([05ed840](https://github.com/xzhavilla/imho/commit/05ed840d4b554a872900f366feed74dd1fe0e484))


### BREAKING CHANGES

* **cache:** drop support for @imho/cache 0.5
* drop support for Fx 0.6





# [0.5.0](https://github.com/xzhavilla/imho/compare/@imho/cache-redis@0.4.3...@imho/cache-redis@0.5.0) (2024-04-17)


### Features

* update Fx and simplify code ([#32](https://github.com/xzhavilla/imho/issues/32)) ([188ff94](https://github.com/xzhavilla/imho/commit/188ff94fd351eff643c9a119ce1ba017f8ad3dc5))


### BREAKING CHANGES

* the new Fx produces effectors instead of effects, and encourages exporting layers instead of handlers





## [0.4.3](https://github.com/xzhavilla/imho/compare/@imho/cache-redis@0.4.2...@imho/cache-redis@0.4.3) (2024-04-11)

**Note:** Version bump only for package @imho/cache-redis





## [0.4.2](https://github.com/xzhavilla/imho/compare/@imho/cache-redis@0.4.1...@imho/cache-redis@0.4.2) (2024-04-11)


### Bug Fixes

* update Fx dependency ([#29](https://github.com/xzhavilla/imho/issues/29)) ([f9122bd](https://github.com/xzhavilla/imho/commit/f9122bd0d179cb2fa84c33612d0704c789b7f4b5))





## [0.4.1](https://github.com/xzhavilla/imho/compare/@imho/cache-redis@0.4.0...@imho/cache-redis@0.4.1) (2024-04-09)


### Bug Fixes

* **cache:** update codec dependency ([#28](https://github.com/xzhavilla/imho/issues/28)) ([92777b7](https://github.com/xzhavilla/imho/commit/92777b758047f77fe870d553eea653e5cf066b24))





# 0.4.0 (2024-04-02)


### Features

* support Fx in place of fp-ts and Effect-TS ([#13](https://github.com/xzhavilla/imho/issues/13)) ([bf151e0](https://github.com/xzhavilla/imho/commit/bf151e0d369a639b921eb9eb98727a6a85609f3d))


### BREAKING CHANGES

* support for fp-ts and Effect-TS was dropped, and there is now a single package per module/dependency





## [0.3.1](https://github.com/xzhavilla/imho/compare/@imho/cache-fp-ts-redis@0.3.0...@imho/cache-fp-ts-redis@0.3.1) (2023-07-28)

**Note:** Version bump only for package @imho/cache-fp-ts-redis





# [0.3.0](https://github.com/xzhavilla/imho/compare/@imho/cache-fp-ts-redis@0.2.0...@imho/cache-fp-ts-redis@0.3.0) (2023-07-22)


### Bug Fixes

* add missing dependencies ([592fc9f](https://github.com/xzhavilla/imho/commit/592fc9fe916394c22211a5f2d1e7b7cc644e401c))


### BREAKING CHANGES

* new peer dependencies added

Refs: https://stackoverflow.com/questions/54926369/what-dependency-type-should-types-be-for-a-published-package





# 0.2.0 (2023-07-21)


### Features

* **cache:** add Redis Cache implementation ([804d190](https://github.com/xzhavilla/imho/commit/804d19040de57074a8aa45edf6e945f9e80cc315))
