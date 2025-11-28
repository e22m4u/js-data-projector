## @e22m4u/js-data-projector

JavaScript модуль для работы с проекцией данных.

Модуль использует декларативные схемы для определения правил видимости полей
данных. Поддерживается вложенность, именные схемы, области проекции
и строгий режим.

## Содержание

- [Установка](#установка)
- [Использование](#использование)
  - [Функция `projectData`](#функция-projectdata)
  - [Класс `DataProjector`](#класс-dataprojector)
- [Тесты](#тесты)
- [Лицензия](#лицензия)

## Установка

```bash
npm install @e22m4u/js-data-projector
```

## Использование

Модуль экспортирует функцию `projectData` и класс `DataProjector`.
Оба инструмента реализуют одинаковый функционал создания проекций,
за исключением возможности регистрации именных схем, которая
доступна только экземпляру класса.

### Функция `projectData`

Создание проекции с помощью схемы.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  name: true,
  password: false,
}

const data = {
  name: 'Fedor',       // будет доступно, явное правило
  password: 'pass123', // будет исключено, явное правило
  extra: 10            // будет доступно в режиме по умолчанию
}

const result = projectData(schema, data);
console.log(result);
// {
//   name: 'Fedor',
//   extra: 10
// }
```

Создание проекции каждого элемента массива.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  id: true,
  secret: false
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

Создание проекции в строгом режиме.

```js
import {projectData} from '@e22m4u/js-data-projector';

const schema = {
  name: true,
  password: false,
}

const data = {
  name: 'Fedor',       // будет доступно, явное правило
  password: 'pass123', // будет исключено, явное правило
  extra: 10            // будет исключено в строгом режиме
}

const result = projectData(schema, data, {
  strict: true, // <= строгий режим
});
console.log(result);
// {
//   name: 'Fedor'
// }
```

Создание проекции с помощью вложенной схемы.

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
    }
  }
}

const data = {
  id: 10,             // будет скрыто, явное правило
  name: 'Fedor',
  city: {
    id: 20,           // будет скрыто, явное правило
    name: 'Moscow',
  }
}

const result = projectData(schema, data);
console.log(result);
// {
//   name: 'Fedor',
//   city: {
//     name: 'Moscow',
//   }
// }
```

Создание проекции для указанной области.

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
}

const data = {
  name: 'Fedor',       // будет доступно, явное правило
  password: 'pass123', // будет доступно в зависимости от области
}

const inputData = projectData(schema, data, {
  scope: 'input' // <= область проекции
});
console.log(inputData);
// {
//   name: 'Fedor',
//   password: 'pass123'
// }

const outputData = projectData(schema, data, {
  scope: 'output' // <= область проекции
});
console.log(outputData);
// {
//   name: 'Fedor'
// }
```

### Класс `DataProjector`

Создание проекции с помощью схемы.

```js
import {DataProjector} from '@e22m4u/js-data-projector';

const projector = new DataProjector();

const schema = {
  name: true,
  password: false,
}

const data = {
  name: 'Fedor',
  password: 'pass123', // будет скрыто
  extra: 10
}

const result = projector.project(schema, data);
console.log(result);
// {
//   name: 'Fedor',
//   extra: 10
// }
```

Создание проекции с помощью именной схемы.

```js
import {DataProjector} from '@e22m4u/js-data-projector';

const projector = new DataProjector();

// регистрация именной схемы
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

Комбинирование именных схем.

```js
import {DataProjector} from '@e22m4u/js-data-projector';

const projector = new DataProjector();

// регистрация схемы адреса
projector.defineSchema('address', {
  city: true,
  zip: false
});

// регистрация схемы пользователя
projector.defineSchema('user', {
  name: true,
  location: {
    schema: 'address' // ссылка на именную схему
  }
});

const data = {
  name: 'John',
  location: {
    city: 'Moscow',
    zip: '101000'
  }
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
