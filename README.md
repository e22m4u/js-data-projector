## @e22m4u/js-data-projector

JavaScript модуль для работы с проекцией данных.

Модуль использует декларативные схемы для определения правил видимости полей
данных. Поддерживается вложенность, именованные схемы, области проекции
и строгий режим.

## Содержание

- [Установка](#установка)
- [Использование](#использование)
  - [Функция `projectData`](#функция-projectdata)
    - [Создание проекции](#создание-проекции)
    - [Проекция элементов массива](#проекция-элементов-массива)
    - [Строгий режим](#строгий-режим)
    - [Вложенные схемы](#вложенные-схемы)
    - [Область проекции](#область-проекции)
  - [Класс `DataProjector`](#класс-dataprojector)
    - [Именованные схемы](#именованные-схемы)
    - [Комбинирование именованных схем](#комбинирование-именованных-схем)
- [Тесты](#тесты)
- [Лицензия](#лицензия)

## Установка

```bash
npm install @e22m4u/js-data-projector
```

## Использование

Модуль экспортирует функцию `projectData` и класс `DataProjector`.
Оба инструмента реализуют одинаковый функционал создания проекций,
за исключением возможности регистрации именованных схем, которая
доступна только экземпляру класса.

### Функция `projectData`

Функция создает проекцию данных на основе переданного объекта схемы.
Принимает исходные данные и дополнительные опции для управления режимом
строгости и областью видимости.

Сигнатура:

- `projectData(schemaOrName, data, [options])` - возвращает проекцию;
  - `schemaOrName: string | object` - схема проекции или имя;
  - `data: object | object[]` - проектируемые данные;
  - `options?: object` - объект настроек;
    - `strict?: boolean` - строгий режим;
    - `scope?: string` - область проекции;
    - `resolver?: Function` - функция для разрешения имени;

#### Создание проекции

Схема проекции описывает настройки видимости для каждого поля. Логические
значения определяют видимость поля. Поля, отсутствующие в схеме, остаются
в результате по умолчанию.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  name: true,
  password: false,
};

const data = {
  name: 'Fedor',       // будет доступно, явное правило
  password: 'pass123', // будет исключено, явное правило
  extra: 10,           // будет доступно в режиме по умолчанию
};

const result = projectData(schema, data);
console.log(result);
// {
//   name: 'Fedor',
//   extra: 10
// }
```

#### Проекция элементов массива

Если входные данные представляют собой массив, то проекция применяется к
каждому элементу рекурсивно. Структура результата соответствует исходному
массиву.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  id: true,
  secret: false,
};

const data = [
  {id: 1, secret: 'A'},
  {id: 2, secret: 'B'},
];

const result = projectData(schema, data);
console.log(result);
// [
//   {id: 1},
//   {id: 2}
// ]
```

#### Строгий режим

Строгий режим исключает из результата все поля, не описанные в схеме явно.
Поведение регулируется опцией `strict`. Данный режим позволяет гарантировать
отсутствие лишних данных в результате.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  name: true,
  password: false,
};

const data = {
  name: 'Fedor',       // будет доступно, явное правило
  password: 'pass123', // будет исключено, явное правило
  extra: 10,           // будет исключено в строгом режиме
};

const result = projectData(schema, data, {
  strict: true, // <= строгий режим
});
console.log(result);
// {
//   name: 'Fedor'
// }
```

#### Вложенные схемы

Вложенные объекты обрабатываются с помощью свойства `schema` в настройках
поля. Данное свойство позволяет определять правила видимости для вложенных
структур данных.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  id: false,
  name: true,
  city: {
    select: true, // правило видимости поля city
    schema: {     // вложенная схема
      id: false,
      name: true,
    },
  },
};

const data = {
  id: 10,             // будет скрыто, явное правило
  name: 'Fedor',
  city: {
    id: 20,           // будет скрыто, явное правило
    name: 'Moscow',
  },
};

const result = projectData(schema, data);
console.log(result);
// {
//   name: 'Fedor',
//   city: {
//     name: 'Moscow',
//   }
// }
```

#### Область проекции

Правила видимости полей могут зависеть от области проекции. Свойство `scopes`
определяет специфичные правила для разных контекстов, передаваемых через
опцию `scope`.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  name: true,
  password: {
    scopes: {
      input: true,   // правило для области 'input'
      output: false, // правило для области 'output'
    },
  },
};

const data = {
  name: 'Fedor',       // будет доступно, явное правило
  password: 'pass123', // будет доступно в зависимости от области
};

const inputData = projectData(schema, data, {
  scope: 'input', // <= область проекции
});
console.log(inputData);
// {
//   name: 'Fedor',
//   password: 'pass123'
// }

const outputData = projectData(schema, data, {
  scope: 'output', // <= область проекции
});
console.log(outputData);
// {
//   name: 'Fedor'
// }
```

### Класс `DataProjector`

Класс управляет реестром схем и предоставляет методы для их регистрации и
использования. Экземпляр хранит именованные схемы в памяти, что позволяет
ссылаться на них по строковому идентификатору при создании проекций.

Метод `defineSchema`:

- `defineSchema(name, schema)` - возвращает `this`;
  - `name: string` - имя схемы;
  - `schema: object` - схема проекции;

Метод `project`:

- `project(schemaOrName, data, [options])` - возвращает проекцию;
  - `schemaOrName: string | object` - схема проекции или имя;
  - `data: object | object[]` - проектируемые данные;
  - `options?: object` - объект настроек;
    - `strict?: boolean` - строгий режим;
    - `scope?: string` - область проекции;

#### Именованные схемы

Класс позволяет регистрировать схемы под уникальными именами. Метод
`defineSchema` сохраняет схему в реестре, а метод `project` использует
имя для применения правил.

```js
import {DataProjector} from '@e22m4u/js-data-projector';

const projector = new DataProjector();

// регистрация именованной схемы
projector.defineSchema('user', {
  id: true,
  name: true,
  password: false,
});

const data = {
  id: 10,
  name: 'Fedor',
  password: 'pass123',
};

const result = projector.project('user', data);
console.log(result);
// {
//   id: 10,
//   name: 'Fedor'
// }
```

#### Комбинирование именованных схем

Именованные схемы могут быть использованы внутри других схем. Что позволяет
комбинировать зарегистрированные схемы для комплексных структур данных.

```js
import {DataProjector} from '@e22m4u/js-data-projector';

const projector = new DataProjector();

// регистрация схемы адреса
projector.defineSchema('address', {
  city: true,
  zip: false,
});

// регистрация схемы пользователя
projector.defineSchema('user', {
  name: true,
  location: {
    schema: 'address', // ссылка на именованную схему
  },
});

const data = {
  name: 'John',
  location: {
    city: 'Moscow',
    zip: '101000',
  },
};

const result = projector.project('user', data);
console.log(result);
// {
//   name: 'John',
//   location: {
//     city: 'Moscow'
//   }
// }
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
