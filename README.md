# MIRRRS — Estructura de archivos

## Cómo agregar imágenes a un modelo

Crea la siguiente estructura de carpetas junto a los archivos HTML:

```
images/
  agnes-abma/
    book/
      1.jpg
      2.jpg
      3.jpg
      … (tantas como quieras)
    polaroids/
      1.jpg
      2.jpg
      … (tantas como quieras)

  agustina-sposato/
    book/
      1.jpg
      …
    polaroids/
      1.jpg
      …
```

## Cómo agregar o editar un modelo

Abre `mediaslide.js` y edita el array `MODELS`.

Cada modelo tiene esta forma:

```js
{
  slug:      'nombre-apellido',        // URL-friendly, sin espacios
  name:      'Nombre Apellido',        // Nombre que aparece en la web
  division:  'women',                  // 'women' | 'men'
  category:  'main',                   // 'main' | 'new-faces' | 'image'
  instagram: 'https://www.instagram.com/handle', // null si no tiene
  stats: {
    height: "179 cm / 5'10½\"",
    bust:   '83 cm / 32½"',
    waist:  '62 cm / 24½"',
    hips:   '90 cm / 35½"',
    shoes:  '40 EU / 9 US / 7 UK',
    dress:  '36 EU / 6 US / 8 UK',
    hair:   'Vinyl Blond · Curly',
    eyes:   'Blue',
  },
  bookCount:     20,   // cuántas fotos hay en images/{slug}/book/
  polaroidCount: 6,    // cuántas fotos hay en images/{slug}/polaroids/
},
```

Si un modelo no tiene fotos todavía, deja `bookCount: 0` y `polaroidCount: 0`. La card aparecerá con un placeholder hasta que agregues las imágenes.

## Archivos del proyecto

```
index.html          ← página de inicio (por crear)
models.html         ← grid de modelos
model.html          ← página individual de modelo
contact.html        ← contacto con mapa
apply.html          ← formulario de aplicación
styles.css          ← todos los estilos
mediaslide.js       ← datos de modelos (editar aquí)
i18n.js             ← traducciones EN / DE
images/             ← fotos de modelos (ver arriba)
logo.svg
logo-mark.svg
logo-monogram.svg
```

## Cuando MediaSlide esté disponible

Reemplaza `mediaslide.js` con la versión que hace las llamadas a la API. La interfaz pública (`window.MIRRRS.fetchModels()` y `window.MIRRRS.fetchModel(slug)`) permanece igual — los HTML no necesitan cambios.
