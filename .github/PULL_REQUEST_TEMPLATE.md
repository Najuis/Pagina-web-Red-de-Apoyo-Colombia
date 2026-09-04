---
name: Pull Request Template
description: Plantilla para solicitudes de incorporación de cambios
title: "[PR] "
labels: ["triage"]
assignees: ""

---

## Descripción de los cambios

Describe qué cambios has hecho y por qué.

## Tipo de cambio

Por favor, elimina las que no correspondan:

- [ ] Nueva funcionalidad
- [ ] Corrección de bug
- [ ] Mejora de performance
- [ ] Actualización de documentación
- [ ] Refactorización
- [ ] Bug de seguridad

## Lista de verificación

Por favor, verifica que hayas completado lo siguiente:

- [ ] He leído las guías de contribución
- [ ] El código sigue el estilo del proyecto (TypeScript estricto, sin `any`)
- [ ] He realizado una auto-revisión de mi código
- [ ] He añadido comentarios donde sea necesario
- [ ] He verificado que no hay errores de TypeScript (`npm run typecheck`)
- [ ] He verificado que el build funciona (`npm run build`)
- [ ] He añadido/tests si corresponde

## Capturas de pantalla (si aplica)

Si los cambios incluyen cambios en la UI, añade capturas de pantalla aquí.

## Checklist adicional para cambios admin/editor

- [ ] He verificado permisos de role (ADMIN/EDITOR)
- [ ] He comprobado que las validaciones Zod funcionan correctamente
- [ ] He probado flujos de 2FA si corresponde

## Checklist adicional para cambios de base de datos

- [ ] He generado la migración con `npm run prisma:generate`
- [ ] He aplicado la migración localmente
- [ ] He probado el seed con datos de ejemplo