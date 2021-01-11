### Hexlet tests and linter status:
[![Actions Status](https://github.com/Dimabytes/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/Dimabytes/frontend-project-lvl2/actions)
[![Node CI](https://github.com/Dimabytes/frontend-project-lvl2/workflows/Node%20CI/badge.svg)](https://github.com/hexlet-boilerplates/nodejs-package/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/cae235b46304d2598880/maintainability)](https://codeclimate.com/github/Dimabytes/frontend-project-lvl2/maintainability)
[![Test coverage](https://api.codeclimate.com/v1/badges/cae235b46304d2598880/test_coverage)](https://codeclimate.com/github/Dimabytes/frontend-project-lvl2/test_coverage)

# Вычислитель отличий

Программа определяющая разницу между двумя структурами данных. Это популярная задача, для решения которой существует множество онлайн сервисов http://www.jsondiff.com/. Подобный механизм, например, используется при выводе тестов или при автоматическом отслеживании изменении в конфигурационных файлах.

[Демо шаг 1](https://asciinema.org/a/I5jPGCjij4kPuzsGoGJ15dvcY)

[Демо шаг 5](https://asciinema.org/a/rvJky8z0i3DqVf7ar2BuJeX8i)

[Демо шаг 6](https://asciinema.org/a/3uKJ2QwByFoXk5FAC4zTPqS5f)
## [Демо final](https://asciinema.org/a/KpeOy7eUeyIN0KwsHuymJrk8p)

* Поддержка разных входных форматов: yaml, json
* Генерация отчета в виде plain text, stylish и json
* Пример использования:
````
# формат plain
 gendiff --format plain path/to/file.yml another/path/file.json

Property 'common.follow' was added with value: false
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group2' was removed

# формат stylish
 gendiff filepath1.json filepath2.json

{
    + follow: false
      setting1: Value 1
    - setting2: 200
    - setting3: true
    + setting3: {
        key: value
    }
    + setting4: blah blah
    + setting5: {
        key5: value5
    }
 }
````

## Установка

````
make install
````

## Использование

* ### Помощь
````
 gendiff -h
````

* ### Версия
````
 gendiff -v
````

* ### Формат вывода

stylish, plain, json. По умолчанию stylish.

````
 gendiff -f --format [format]
````

