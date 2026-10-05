# ManaByte

Aplicación web para **construir mazos** y **llevar la colección** de *Magic: The Gathering*.

Los datos de las cartas (nombre, imagen, ediciones, símbolos de maná) vienen de [Scryfall](https://scryfall.com/). En ManaByte solo se guarda lo que es tuyo: usuario, mazos, copias y metadatos (cantidad, foil, idioma, estado).

Sitio web: [ManaByte](https://manabyte.linkelverde.dev/)

## Qué puedes hacer

- **Cuenta**: registro, login y sesión con JWT en cookies.
- **Mazos**: crear mazos con formato, añadir cartas a mainboard, sideboard, commander o companion, y cambiar la impresión (showcase, borderless, promo, etc.).
- **Importar listas**: pegar un decklist al estilo `4 Lightning Bolt (STA) 42` y resolverlo contra Scryfall.
- **Buscar cartas**: búsqueda pública por nombre y elección de printing.
- **Colección**: carpetas de cartas que posees, con cantidad, foil, idioma y condición.

## Stack

| Capa | Tecnología |
| --- | --- |
| API | Django 6, Django REST Framework, JWT (cookies) |
| Base de datos | PostgreSQL |
| Frontend | React 19, TanStack Start / Router / Query, Tailwind CSS, shadcn/ui |
| Cartas | [API de Scryfall](https://scryfall.com/docs/api) |

## Estructura

```
manabyte/
├── core/          # API Django (apps: users, deck, folder, collection)
└── frontend/      # App web (TanStack Start)
```

La API vive bajo `/api/`:

- `api/auth/` — login, registro, logout, me, refresh
- `api/deck/` — mazos y cartas del mazo (incluye alta masiva)
- `api/collection/` — ítems de colección
- `api/folder/` — carpetas (mazos o colección)
- `api/stats/` — datos generales para dashboard


## Requisitos

- Python 3 (con `venv`)
- Node.js (npm)
- PostgreSQL

## Configuración

### Backend

En `core/` crea un `.env` (el archivo no se versiona):

```env
# Django
DJANGO_SECRET_KEY=
DJANGO_DEBUG=
DJANGO_ALLOWED_HOSTS=

# PostgreSQL
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=

# CORS
CORS_ALLOWED_ORIGINS=

# CSRF
CSRF_TRUSTED_ORIGINS=

# JWT
JWT_ACCESS_TOKEN_MINUTES=
JWT_REFRESH_TOKEN_DAYS=
```

Luego:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r core/requirements.txt
cd core
python manage.py migrate
python manage.py runserver
```

La API queda en `http://127.0.0.1:8000`.

Tests:

```bash
cd core
pytest
```


### Frontend

En `frontend/` define la URL de la API, por ejemplo en `.env`:

```env
VITE_BASE_API_URL=http://127.0.0.1:8000
```

CORS del backend ya permite `http://localhost:3000`.

```bash
cd frontend
npm install
npm run dev
```

La app queda en `http://localhost:3000`.

## Cómo encaja todo

1. El navegador habla con Django (credenciales incluidas) para mazos, carpetas y colección.
2. El mismo navegador consulta Scryfall para buscar cartas, cargar imágenes y resolver listas importadas.
3. Cada carta se identifica por su `scryfall_id`; puedes tener la misma carta en varias impresiones.